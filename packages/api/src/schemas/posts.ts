import { z } from "zod";

export const postTypeSchema = z.enum([
	"text",
	"photo",
	"activity",
	"book",
	"article",
]);
export const postVisibilitySchema = z.enum(["private", "friends", "public"]);

export const textContentSchema = z.object({
	body: z.string().min(1),
});

export const photoContentSchema = z.object({
	caption: z.string().optional(),
	imageUrl: z.string().url(),
	width: z.number().int().positive().optional(),
	height: z.number().int().positive().optional(),
});

export const activityContentSchema = z.object({
	title: z.string().min(1),
	activityType: z.string().min(1),
	distanceKm: z.number().nonnegative().optional(),
	durationMinutes: z.number().nonnegative().optional(),
	mapImageUrl: z.string().url().optional(),
});

export const bookContentSchema = z.object({
	title: z.string().min(1),
	author: z.string().min(1),
	coverUrl: z.string().url().optional(),
	rating: z.number().min(0).max(5).optional(),
	status: z.enum(["reading", "read", "want_to_read"]),
	review: z.string().optional(),
});

export const articleContentSchema = z.object({
	title: z.string().min(1),
	slug: z.string().min(1),
	excerpt: z.string().min(1),
	body: z.string().optional(),
});

export const postContentSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("text"), content: textContentSchema }),
	z.object({ type: z.literal("photo"), content: photoContentSchema }),
	z.object({ type: z.literal("activity"), content: activityContentSchema }),
	z.object({ type: z.literal("book"), content: bookContentSchema }),
	z.object({ type: z.literal("article"), content: articleContentSchema }),
]);

export const createPostInputSchema = z
	.object({
		visibility: postVisibilitySchema.default("private"),
	})
	.and(postContentSchema);

export const listPostsInputSchema = z.object({
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(50).default(20),
});

export const postSchema = z.object({
	id: z.string(),
	userId: z.string(),
	type: postTypeSchema,
	visibility: postVisibilitySchema,
	content: z.union([
		textContentSchema,
		photoContentSchema,
		activityContentSchema,
		bookContentSchema,
		articleContentSchema,
	]),
	createdAt: z.string(),
});

export const listPostsOutputSchema = z.object({
	items: z.array(postSchema),
	nextCursor: z.string().nullable(),
});

export type Post = z.infer<typeof postSchema>;
export type PostType = z.infer<typeof postTypeSchema>;
export type CreatePostInput = z.infer<typeof createPostInputSchema>;
export type ListPostsOutput = z.infer<typeof listPostsOutputSchema>;
