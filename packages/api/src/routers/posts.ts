import { createDb, post } from "@personalWebsite/db";
import { and, desc, eq, lt, or } from "drizzle-orm";

import { protectedProcedure } from "../index";
import { demoPostTemplatesForDb } from "../mocks/feed-posts";
import {
	createPostInputSchema,
	listPostsInputSchema,
	type Post,
} from "../schemas/posts";
import { decodeCursor, encodeCursor } from "../utils/cursor";

function toPost(row: typeof post.$inferSelect): Post {
	return {
		id: row.id,
		userId: row.userId,
		type: row.type,
		visibility: row.visibility,
		content: row.content as Post["content"],
		createdAt: row.createdAt.toISOString(),
	};
}

export const postsRouter = {
	list: protectedProcedure
		.input(listPostsInputSchema)
		.handler(async ({ input, context }) => {
			const db = createDb();
			const userId = context.session.user.id;
			const limit = input.limit;

			const filters = [eq(post.userId, userId)];

			if (input.cursor) {
				const { createdAt, id } = decodeCursor(input.cursor);
				const cursorDate = new Date(createdAt);

				filters.push(
					or(
						lt(post.createdAt, cursorDate),
						and(eq(post.createdAt, cursorDate), lt(post.id, id)),
					)!,
				);
			}

			const rows = await db
				.select()
				.from(post)
				.where(and(...filters))
				.orderBy(desc(post.createdAt), desc(post.id))
				.limit(limit + 1);

			const hasMore = rows.length > limit;
			const pageRows = hasMore ? rows.slice(0, limit) : rows;
			const last = pageRows.at(-1);

			return {
				items: pageRows.map(toPost),
				nextCursor:
					hasMore && last
						? encodeCursor({
								createdAt: last.createdAt.toISOString(),
								id: last.id,
							})
						: null,
			};
		}),

	create: protectedProcedure
		.input(createPostInputSchema)
		.handler(async ({ input, context }) => {
			const db = createDb();
			const id = crypto.randomUUID();
			const { type, visibility, content } = input;

			const [row] = await db
				.insert(post)
				.values({
					id,
					userId: context.session.user.id,
					type,
					visibility,
					content,
				})
				.returning();

			if (!row) {
				throw new Error("Failed to create post");
			}

			return toPost(row);
		}),

	seedDemo: protectedProcedure.handler(async ({ context }) => {
		const db = createDb();
		const userId = context.session.user.id;

		const existing = await db
			.select({ id: post.id })
			.from(post)
			.where(eq(post.userId, userId))
			.limit(1);

		if (existing.length > 0) {
			return { created: 0, message: "Feed already has posts" };
		}

		const now = Date.now();

		await db.insert(post).values(
			demoPostTemplatesForDb.map((demo, index) => ({
				id: crypto.randomUUID(),
				userId,
				type: demo.type,
				visibility: demo.visibility,
				content: demo.content,
				createdAt: new Date(now - index * 60 * 60 * 1000),
			})),
		);

		return {
			created: demoPostTemplatesForDb.length,
			message: "Demo feed seeded",
		};
	}),
};
