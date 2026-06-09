import type { Post } from "@personalWebsite/api/schemas/posts";
import { Text, View } from "react-native";

export function ActivityPostCard({ post }: { post: Post }) {
	const content = post.content as {
		title: string;
		activityType: string;
		distanceKm?: number;
		durationMinutes?: number;
	};

	return (
		<View className="rounded-lg border border-border bg-muted/30 p-4">
			<Text className="font-semibold text-foreground text-lg">
				{content.title}
			</Text>
			<Text className="text-muted text-sm capitalize">
				{content.activityType}
			</Text>
			<View className="mt-2 flex-row gap-4">
				{content.distanceKm != null ? (
					<Text className="text-foreground text-sm">
						{content.distanceKm} km
					</Text>
				) : null}
				{content.durationMinutes != null ? (
					<Text className="text-foreground text-sm">
						{content.durationMinutes} min
					</Text>
				) : null}
			</View>
		</View>
	);
}
