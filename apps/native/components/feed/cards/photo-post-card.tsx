import type { Post } from "@personalWebsite/api/schemas/posts";
import { Image } from "expo-image";

export function PhotoPostCard({ post }: { post: Post }) {
	const content = post.content as {
		imageUrl: string;
		caption?: string;
	};

	return (
		<Image
			source={{ uri: content.imageUrl }}
			style={{ width: "100%", aspectRatio: 1 }}
			contentFit="cover"
			accessibilityLabel={content.caption ?? "Photo"}
		/>
	);
}
