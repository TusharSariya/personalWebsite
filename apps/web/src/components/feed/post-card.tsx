import type { Post } from "@personalWebsite/api/schemas/posts";

function VisibilityBadge({ visibility }: { visibility: Post["visibility"] }) {
	return (
		<span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground text-xs capitalize">
			{visibility}
		</span>
	);
}

function TypeBadge({ type }: { type: Post["type"] }) {
	return (
		<span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs capitalize">
			{type}
		</span>
	);
}

function TextCard({ post }: { post: Post }) {
	const content = post.content as { body: string };
	return <p className="text-base leading-7">{content.body}</p>;
}

function PhotoCard({ post }: { post: Post }) {
	const content = post.content as {
		caption?: string;
		imageUrl: string;
	};

	return (
		<div className="space-y-3">
			<img
				src={content.imageUrl}
				alt={content.caption ?? "Photo post"}
				className="h-64 w-full rounded-xl object-cover"
				loading="lazy"
			/>
			{content.caption ? <p>{content.caption}</p> : null}
		</div>
	);
}

function ActivityCard({ post }: { post: Post }) {
	const content = post.content as {
		title: string;
		activityType: string;
		distanceKm?: number;
		durationMinutes?: number;
		mapImageUrl?: string;
	};

	return (
		<div className="space-y-3">
			{content.mapImageUrl ? (
				<img
					src={content.mapImageUrl}
					alt={content.title}
					className="h-40 w-full rounded-xl object-cover"
					loading="lazy"
				/>
			) : null}
			<h3 className="font-semibold text-lg">{content.title}</h3>
			<p className="text-muted-foreground text-sm capitalize">
				{content.activityType}
			</p>
			<div className="flex gap-4 text-sm">
				{content.distanceKm != null ? (
					<span>{content.distanceKm} km</span>
				) : null}
				{content.durationMinutes != null ? (
					<span>{content.durationMinutes} min</span>
				) : null}
			</div>
		</div>
	);
}

function BookCard({ post }: { post: Post }) {
	const content = post.content as {
		title: string;
		author: string;
		coverUrl?: string;
		rating?: number;
		status: string;
		review?: string;
	};

	return (
		<div className="flex gap-4">
			{content.coverUrl ? (
				<img
					src={content.coverUrl}
					alt={content.title}
					className="h-28 w-20 rounded-lg object-cover"
					loading="lazy"
				/>
			) : null}
			<div className="space-y-1">
				<h3 className="font-semibold text-lg">{content.title}</h3>
				<p className="text-muted-foreground text-sm">{content.author}</p>
				<p className="text-muted-foreground text-xs capitalize">
					{content.status.replaceAll("_", " ")}
				</p>
				{content.rating != null ? (
					<p className="text-sm">{content.rating}/5</p>
				) : null}
				{content.review ? <p className="text-sm">{content.review}</p> : null}
			</div>
		</div>
	);
}

function ArticleCard({ post }: { post: Post }) {
	const content = post.content as {
		title: string;
		slug: string;
		excerpt: string;
		body?: string;
	};

	return (
		<div className="space-y-2">
			<h3 className="font-semibold text-lg">{content.title}</h3>
			<p className="text-muted-foreground">{content.excerpt}</p>
			<p className="text-muted-foreground text-xs">/{content.slug}</p>
		</div>
	);
}

export function PostCard({ post }: { post: Post }) {
	return (
		<article className="rounded-xl border bg-card p-4 shadow-sm">
			<div className="mb-3 flex items-center justify-between">
				<TypeBadge type={post.type} />
				<VisibilityBadge visibility={post.visibility} />
			</div>
			{post.type === "text" ? <TextCard post={post} /> : null}
			{post.type === "photo" ? <PhotoCard post={post} /> : null}
			{post.type === "activity" ? <ActivityCard post={post} /> : null}
			{post.type === "book" ? <BookCard post={post} /> : null}
			{post.type === "article" ? <ArticleCard post={post} /> : null}
			<time className="mt-3 block text-muted-foreground text-xs">
				{new Date(post.createdAt).toLocaleString()}
			</time>
		</article>
	);
}
