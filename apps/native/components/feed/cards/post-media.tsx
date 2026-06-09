import type { Post } from "@personalWebsite/api/schemas/posts";

import { ActivityPostCard } from "./activity-post-card";
import { ArticlePostCard } from "./article-post-card";
import { BookReviewPostCard } from "./book-review-post-card";
import { GarminActivityPostCard } from "./garmin-activity-post-card";
import { PhotoPostCard } from "./photo-post-card";
import { TextPostCard } from "./text-post-card";

export function PostMedia({ post }: { post: Post }) {
	switch (post.type) {
		case "photo":
			return <PhotoPostCard post={post} />;
		case "article":
			return <ArticlePostCard post={post} />;
		case "book":
			return <BookReviewPostCard post={post} />;
		case "activity": {
			const content = post.content as { source?: string; device?: string };
			if (content.source === "garmin" || content.device) {
				return <GarminActivityPostCard post={post} />;
			}
			return <ActivityPostCard post={post} />;
		}
		case "text":
			return <TextPostCard post={post} />;
		default:
			return null;
	}
}
