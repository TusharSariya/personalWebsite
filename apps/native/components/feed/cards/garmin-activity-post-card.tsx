import type { Post } from "@personalWebsite/api/schemas/posts";
import type { RoutePoint } from "@personalWebsite/api/utils/activity-route";
import { Text, View } from "react-native";

import { formatPace } from "../utils/format-pace";

import { ActivityRouteMap } from "./activity-route-map";

type GarminActivityContent = {
	title: string;
	activityType: string;
	distanceKm?: number;
	durationMinutes?: number;
	routePoints?: RoutePoint[];
	device?: string;
	avgHeartRate?: number;
	paceMinPerKm?: number;
	calories?: number;
};

export function GarminActivityPostCard({ post }: { post: Post }) {
	const content = post.content as GarminActivityContent;

	return (
		<View className="retro-panel-inset overflow-hidden">
			{content.routePoints && content.routePoints.length >= 2 ? (
				<ActivityRouteMap routePoints={content.routePoints} />
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
						<Text className="retro-badge bg-sky-500/10 font-medium text-sky-500">
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
		<View className="min-w-[45%] flex-1 border border-border bg-muted/50 px-3 py-2">
			<Text className="text-muted text-xs">{label}</Text>
			<Text className="mt-0.5 font-semibold text-foreground text-sm">
				{value}
			</Text>
		</View>
	);
}
