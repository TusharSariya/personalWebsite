import { relations } from "drizzle-orm";
import {
	index,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

export const postTypeEnum = pgEnum("post_type", [
	"text",
	"photo",
	"activity",
	"book",
	"article",
]);

export const postVisibilityEnum = pgEnum("post_visibility", [
	"private",
	"friends",
	"public",
]);

export const post = pgTable(
	"post",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		type: postTypeEnum("type").notNull(),
		visibility: postVisibilityEnum("visibility").notNull().default("private"),
		content: jsonb("content").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("post_user_created_idx").on(table.userId, table.createdAt),
		index("post_created_id_idx").on(table.createdAt, table.id),
	],
);

export const postRelations = relations(post, ({ one }) => ({
	user: one(user, {
		fields: [post.userId],
		references: [user.id],
	}),
}));
