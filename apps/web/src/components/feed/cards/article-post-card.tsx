import type { Post } from "@personalWebsite/api/schemas/posts";

export function ArticlePostCard({ post }: { post: Post }) {
	const content = post.content as {
		title: string;
		slug: string;
		excerpt: string;
		imageUrls?: string[];
	};

	return (
		<div className="retro-panel-inset space-y-3 p-4">
			<div className="space-y-1">
				<h2 className="font-semibold text-lg leading-snug">{content.title}</h2>
				<p className="text-muted-foreground text-sm leading-relaxed">
					{content.excerpt}
				</p>
			</div>
			{content.imageUrls && content.imageUrls.length > 0 ? (
				<div className="grid grid-cols-2 gap-2">
					{content.imageUrls.slice(0, 2).map((url) => (
						<img
							key={url}
							src={url}
							alt=""
							className="aspect-[4/3] w-full border border-border object-cover"
							loading="lazy"
							fetchPriority="low"
						/>
					))}
				</div>
			) : null}
			<p className="text-primary text-sm">
				Read more{" "}
				<span className="text-muted-foreground">→ /{content.slug}</span>
			</p>
		</div>
	);
}
