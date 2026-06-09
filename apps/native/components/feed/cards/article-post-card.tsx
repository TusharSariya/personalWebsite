import type { Post } from "@personalWebsite/api/schemas/posts";
import { Image } from "expo-image";
import { Text, View } from "react-native";

export function ArticlePostCard({ post }: { post: Post }) {
	const content = post.content as {
		title: string;
		slug: string;
		excerpt: string;
		imageUrls?: string[];
	};

	return (
		<View className="retro-panel-inset gap-3 p-4">
			<View className="gap-1">
				<Text className="font-semibold text-foreground text-lg">
					{content.title}
				</Text>
				<Text className="text-muted text-sm leading-relaxed">
					{content.excerpt}
				</Text>
			</View>
			{content.imageUrls && content.imageUrls.length > 0 ? (
				<View className="flex-row gap-2">
					{content.imageUrls.slice(0, 2).map((url) => (
						<Image
							key={url}
							source={{ uri: url }}
							style={{ flex: 1, height: 100, borderRadius: 0 }}
							className="border border-border"
							contentFit="cover"
						/>
					))}
				</View>
			) : null}
			<Text className="text-primary text-sm">Read more → /{content.slug}</Text>
		</View>
	);
}
