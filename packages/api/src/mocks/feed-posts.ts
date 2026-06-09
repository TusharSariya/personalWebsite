import type { ListPostsOutput, Post } from "../schemas/posts";
import { decodeCursor, encodeCursor } from "../utils/cursor";

const demoPostTemplates = [
	{
		type: "text" as const,
		visibility: "private" as const,
		content: { body: "Starting my life log. One feed for everything." },
	},
	{
		type: "photo" as const,
		visibility: "public" as const,
		content: {
			caption: "Golden hour walk",
			imageUrl:
				"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
			width: 800,
			height: 600,
		},
	},
	{
		type: "activity" as const,
		visibility: "friends" as const,
		content: {
			title: "Morning Run",
			activityType: "run",
			distanceKm: 5.2,
			durationMinutes: 28,
			mapImageUrl:
				"https://images.unsplash.com/photo-1476480862126-209bfaa8dfc8?w=800",
		},
	},
	{
		type: "book" as const,
		visibility: "private" as const,
		content: {
			title: "Project Hail Mary",
			author: "Andy Weir",
			coverUrl:
				"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
			rating: 4.5,
			status: "reading" as const,
			review: "Halfway through and hooked.",
		},
	},
	{
		type: "article" as const,
		visibility: "public" as const,
		content: {
			title: "Why one feed beats five apps",
			slug: "why-one-feed",
			excerpt:
				"Photos, runs, books, and essays belong in one chronological timeline.",
			body: "A single scroll makes memory easier to browse later.",
		},
	},
	{
		type: "text" as const,
		visibility: "public" as const,
		content: { body: "Note to self: ship the feed before adding Garmin sync." },
	},
	{
		type: "photo" as const,
		visibility: "private" as const,
		content: {
			caption: "Desk setup",
			imageUrl:
				"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
		},
	},
	{
		type: "activity" as const,
		visibility: "public" as const,
		content: {
			title: "Evening Ride",
			activityType: "bike",
			distanceKm: 18.4,
			durationMinutes: 52,
		},
	},
	{
		type: "book" as const,
		visibility: "friends" as const,
		content: {
			title: "The Hobbit",
			author: "J.R.R. Tolkien",
			coverUrl:
				"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
			rating: 5,
			status: "read" as const,
		},
	},
	{
		type: "article" as const,
		visibility: "private" as const,
		content: {
			title: "March training recap",
			slug: "march-training-recap",
			excerpt: "Consistency mattered more than intensity this month.",
		},
	},
	{
		type: "text" as const,
		visibility: "friends" as const,
		content: { body: "Finished a long walk without checking my phone." },
	},
	{
		type: "photo" as const,
		visibility: "public" as const,
		content: {
			caption: "Coffee and notebook",
			imageUrl:
				"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
		},
	},
	{
		type: "activity" as const,
		visibility: "private" as const,
		content: {
			title: "Trail Hike",
			activityType: "hike",
			distanceKm: 8.1,
			durationMinutes: 145,
		},
	},
	{
		type: "book" as const,
		visibility: "public" as const,
		content: {
			title: "Dune",
			author: "Frank Herbert",
			status: "want_to_read" as const,
		},
	},
	{
		type: "article" as const,
		visibility: "public" as const,
		content: {
			title: "Designing mixed post cards",
			slug: "designing-mixed-post-cards",
			excerpt: "Same shell, different innards for photos, runs, and essays.",
		},
	},
] as const;

export const MOCK_USER_ID = "mock-user-1";

export const MOCK_FEED_POSTS: Post[] = demoPostTemplates.map((demo, index) => ({
	id: `mock-post-${index + 1}`,
	userId: MOCK_USER_ID,
	type: demo.type,
	visibility: demo.visibility,
	content: demo.content,
	createdAt: new Date(Date.now() - index * 60 * 60 * 1000).toISOString(),
}));

export function listMockPosts(cursor?: string, limit = 20): ListPostsOutput {
	let startIndex = 0;

	if (cursor) {
		const { id } = decodeCursor(cursor);
		const cursorIndex = MOCK_FEED_POSTS.findIndex((post) => post.id === id);
		startIndex = cursorIndex === -1 ? 0 : cursorIndex + 1;
	}

	const items = MOCK_FEED_POSTS.slice(startIndex, startIndex + limit);
	const hasMore = startIndex + limit < MOCK_FEED_POSTS.length;
	const last = items.at(-1);

	return {
		items,
		nextCursor:
			hasMore && last
				? encodeCursor({ createdAt: last.createdAt, id: last.id })
				: null,
	};
}

export const demoPostTemplatesForDb = demoPostTemplates;
