import type { Post } from "@personalWebsite/api/schemas/posts";

export function TextPostCard({ post }: { post: Post }) {
	const content = post.content as { body: string };

	return (
		<p className="whitespace-pre-wrap text-base leading-relaxed">
			{content.body}
		</p>
	);
}
