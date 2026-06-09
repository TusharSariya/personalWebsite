import { MOCK_FEED_AUTHOR } from "@personalWebsite/api/mocks";
import type { Post } from "@personalWebsite/api/schemas/posts";
import {
	Bookmark,
	Heart,
	MessageCircle,
	MoreHorizontal,
	Send,
} from "lucide-react";
import type { ReactNode } from "react";

import { formatRelativeTime } from "./utils/format-relative-time";

function mockLikeCount(postId: string): number {
	let hash = 0;
	for (const char of postId) {
		hash = (hash * 31 + char.charCodeAt(0)) % 1000;
	}
	return 12 + (hash % 180);
}

function getPhotoCaption(post: Post): string | undefined {
	if (post.type !== "photo") return undefined;
	return (post.content as { caption?: string }).caption;
}

function getPhotoLocation(post: Post): string | undefined {
	if (post.type !== "photo") return undefined;
	return (post.content as { location?: string }).location;
}

export function SocialPost({
	post,
	children,
}: {
	post: Post;
	children: ReactNode;
}) {
	const caption = getPhotoCaption(post);
	const location = getPhotoLocation(post);
	const likes = mockLikeCount(post.id);
	const isPhoto = post.type === "photo";
	const isText = post.type === "text";

	return (
		<article className="border-border border-b py-4">
			<header className="mb-3 flex items-center gap-3 px-4">
				<img
					src={MOCK_FEED_AUTHOR.avatarUrl}
					alt={MOCK_FEED_AUTHOR.displayName}
					className="h-9 w-9 rounded-full object-cover"
				/>
				<div className="min-w-0 flex-1">
					<p className="font-semibold text-sm leading-tight">
						{MOCK_FEED_AUTHOR.username}
					</p>
					{location ? (
						<p className="truncate text-muted-foreground text-xs">{location}</p>
					) : (
						<time
							className="text-muted-foreground text-xs"
							dateTime={post.createdAt}
						>
							{formatRelativeTime(post.createdAt)}
						</time>
					)}
				</div>
				<button
					type="button"
					className="text-muted-foreground hover:text-foreground"
					aria-label="More options"
				>
					<MoreHorizontal className="h-5 w-5" />
				</button>
			</header>

			{isText ? <div className="px-4 pb-3">{children}</div> : null}

			{!isText ? <div className={isPhoto ? "" : "px-4"}>{children}</div> : null}

			<div className="px-4 pt-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<button
							type="button"
							className="hover:text-red-500"
							aria-label="Like"
						>
							<Heart className="h-6 w-6" />
						</button>
						<button
							type="button"
							className="text-muted-foreground hover:text-foreground"
							aria-label="Comment"
						>
							<MessageCircle className="h-6 w-6" />
						</button>
						<button
							type="button"
							className="text-muted-foreground hover:text-foreground"
							aria-label="Share"
						>
							<Send className="h-6 w-6" />
						</button>
					</div>
					<button
						type="button"
						className="text-muted-foreground hover:text-foreground"
						aria-label="Save"
					>
						<Bookmark className="h-6 w-6" />
					</button>
				</div>

				<p className="mt-2 font-semibold text-sm">{likes} likes</p>

				{caption ? (
					<p className="mt-1 text-sm leading-snug">
						<span className="font-semibold">{MOCK_FEED_AUTHOR.username}</span>{" "}
						{caption}
					</p>
				) : null}

				{location ? (
					<time
						className="mt-1 block text-muted-foreground text-xs"
						dateTime={post.createdAt}
					>
						{formatRelativeTime(post.createdAt)}
					</time>
				) : null}
			</div>
		</article>
	);
}
