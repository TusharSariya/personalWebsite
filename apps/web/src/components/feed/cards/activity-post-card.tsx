import type { Post } from "@personalWebsite/api/schemas/posts";

export function ActivityPostCard({ post }: { post: Post }) {
	const content = post.content as {
		title: string;
		activityType: string;
		distanceKm?: number;
		durationMinutes?: number;
	};

	return (
		<div className="rounded-lg border bg-muted/30 p-4">
			<h2 className="font-semibold text-lg">{content.title}</h2>
			<p className="text-muted-foreground text-sm capitalize">
				{content.activityType}
			</p>
			<div className="mt-2 flex gap-4 text-sm">
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
