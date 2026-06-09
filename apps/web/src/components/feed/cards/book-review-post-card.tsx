import type { Post } from "@personalWebsite/api/schemas/posts";

import { StarRating } from "../utils/star-rating";

export function BookReviewPostCard({ post }: { post: Post }) {
	const content = post.content as {
		title: string;
		author: string;
		coverUrl?: string;
		rating?: number;
		status: string;
		review?: string;
	};

	return (
		<div className="rounded-lg border bg-muted/30 p-4">
			<div className="flex gap-4">
				{content.coverUrl ? (
					<img
						src={content.coverUrl}
						alt={content.title}
						className="h-36 w-24 shrink-0 rounded-md object-cover shadow-sm"
						loading="lazy"
					/>
				) : null}
				<div className="min-w-0 flex-1 space-y-2">
					<div>
						<h2 className="font-semibold text-lg leading-snug">
							{content.title}
						</h2>
						<p className="text-muted-foreground text-sm">{content.author}</p>
					</div>
					{content.rating != null ? (
						<StarRating rating={content.rating} />
					) : null}
					<span className="inline-block rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs capitalize">
						{content.status.replaceAll("_", " ")}
					</span>
				</div>
			</div>
			{content.review ? (
				<blockquote className="mt-3 border-muted-foreground/30 border-l-2 pl-3 text-foreground/90 text-sm italic leading-relaxed">
					{content.review}
				</blockquote>
			) : null}
		</div>
	);
}
