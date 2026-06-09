import type { Post } from "@personalWebsite/api/schemas/posts";
import { Text } from "react-native";

export function TextPostCard({ post }: { post: Post }) {
	const content = post.content as { body: string };

	return (
		<Text className="text-base text-foreground leading-relaxed">
			{content.body}
		</Text>
	);
}
