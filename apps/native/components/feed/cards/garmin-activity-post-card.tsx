import type { Post } from "@personalWebsite/api/schemas/posts";
import { Image } from "expo-image";
import { Text, View } from "react-native";

import { formatPace } from "../utils/format-pace";

export function GarminActivityPostCard({ post }: { post: Post }) {
	const content = post.content as {
		title: string;
		activityType: string;
		distanceKm?: number;
		durationMinutes?: number;
		mapImageUrl?: string;
		device?: string;
		avgHeartRate?: number;
		paceMinPerKm?: number;
		calories?: number;
	};

	return (
		<View className="overflow-hidden rounded-lg border border-border">
			{content.mapImageUrl ? (
				<Image
					source={{ uri: content.mapImageUrl }}
					style={{ width: "100%", height: 160 }}
					contentFit="cover"
				/>
			) : null}
			<View className="gap-3 p-4">
				<View className="flex-row items-start justify-between gap-2">
					<View className="flex-1">
						<Text className="font-semibold text-foreground text-lg">
							{content.title}
						</Text>
						<Text className="text-muted text-sm capitalize">
							{content.activityType}
						</Text>
					</View>
					{content.device ? (
						<Text className="rounded-full bg-sky-500/10 px-2.5 py-1 font-medium text-sky-500 text-xs">
							{content.device}
						</Text>
					) : null}
				</View>
				<View className="flex-row flex-wrap gap-3">
					{content.distanceKm != null ? (
						<Stat label="Distance" value={`${content.distanceKm} km`} />
					) : null}
					{content.durationMinutes != null ? (
						<Stat label="Time" value={`${content.durationMinutes} min`} />
					) : null}
					{content.paceMinPerKm != null ? (
						<Stat label="Pace" value={formatPace(content.paceMinPerKm)} />
					) : null}
					{content.avgHeartRate != null ? (
						<Stat label="Avg HR" value={`${content.avgHeartRate} bpm`} />
					) : null}
				</View>
				{content.calories != null ? (
					<Text className="text-muted text-xs">{content.calories} cal</Text>
				) : null}
			</View>
		</View>
	);
}

function Stat({ label, value }: { label: string; value: string }) {
	return (
		<View className="min-w-[45%] flex-1 rounded-md bg-muted/50 px-3 py-2">
			<Text className="text-muted text-xs">{label}</Text>
			<Text className="mt-0.5 font-semibold text-foreground text-sm">
				{value}
			</Text>
		</View>
	);
}
