import type { Post } from "@personalWebsite/api/schemas/posts";

export function PhotoPostCard({ post }: { post: Post }) {
	const content = post.content as {
		imageUrl: string;
		caption?: string;
	};

	return (
		<img
			src={content.imageUrl}
			alt={content.caption ?? "Photo"}
			className="aspect-square w-full object-cover"
			loading="lazy"
		/>
	);
}
