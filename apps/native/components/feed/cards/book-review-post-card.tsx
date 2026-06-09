import type { Post } from "@personalWebsite/api/schemas/posts";
import { Image } from "expo-image";
import { Text, View } from "react-native";

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
		<View className="retro-panel-inset p-4">
			<View className="flex-row gap-4">
				{content.coverUrl ? (
					<Image
						source={{ uri: content.coverUrl }}
						style={{ width: 72, height: 108, borderRadius: 0 }}
						className="border border-border"
						contentFit="cover"
					/>
				) : null}
				<View className="min-w-0 flex-1 gap-2">
					<Text className="font-semibold text-foreground text-lg">
						{content.title}
					</Text>
					<Text className="text-muted text-sm">{content.author}</Text>
					{content.rating != null ? (
						<StarRating rating={content.rating} />
					) : null}
					<Text className="retro-badge self-start bg-muted text-muted capitalize">
						{content.status.replaceAll("_", " ")}
					</Text>
				</View>
			</View>
			{content.review ? (
				<Text className="mt-3 border-border border-l-2 pl-3 text-foreground text-sm italic leading-relaxed">
					{content.review}
				</Text>
			) : null}
		</View>
	);
}
