import type { Post } from "@personalWebsite/api/schemas/posts";
import type { RoutePoint } from "@personalWebsite/api/utils/activity-route";
import { Activity, Heart, Timer } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

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
	const mapRef = useRef<HTMLDivElement>(null);
	const [isMapVisible, setIsMapVisible] = useState(false);

	useEffect(() => {
		const element = mapRef.current;
		if (!element || !content.routePoints?.length) {
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setIsMapVisible(true);
				}
			},
			{ rootMargin: "200px 0px" },
		);

		observer.observe(element);
		return () => observer.disconnect();
	}, [content.routePoints]);

	return (
		<div className="retro-panel-inset overflow-hidden">
			{content.routePoints && content.routePoints.length >= 2 ? (
				<div ref={mapRef}>
					<ActivityRouteMap
						routePoints={content.routePoints}
						isVisible={isMapVisible}
					/>
				</div>
			) : null}
			<div className="space-y-3 p-4">
				<div className="flex items-start justify-between gap-2">
					<div>
						<h2 className="font-semibold text-lg">{content.title}</h2>
						<p className="text-muted-foreground text-sm capitalize">
							{content.activityType}
						</p>
					</div>
					{content.device ? (
						<span className="retro-badge shrink-0 bg-sky-500/10 font-medium text-sky-600 dark:text-sky-400">
							{content.device}
						</span>
					) : null}
				</div>
				<div className="grid grid-cols-2 gap-3">
					{content.distanceKm != null ? (
						<Stat label="Distance" value={`${content.distanceKm} km`} />
					) : null}
					{content.durationMinutes != null ? (
						<Stat
							label="Time"
							value={`${content.durationMinutes} min`}
							icon={<Timer className="h-3.5 w-3.5" />}
						/>
					) : null}
					{content.paceMinPerKm != null ? (
						<Stat label="Pace" value={formatPace(content.paceMinPerKm)} />
					) : null}
					{content.avgHeartRate != null ? (
						<Stat
							label="Avg HR"
							value={`${content.avgHeartRate} bpm`}
							icon={<Heart className="h-3.5 w-3.5" />}
						/>
					) : null}
				</div>
				{content.calories != null ? (
					<p className="flex items-center gap-1.5 text-muted-foreground text-xs">
						<Activity className="h-3.5 w-3.5" />
						{content.calories} cal
					</p>
				) : null}
			</div>
		</div>
	);
}

function Stat({
	label,
	value,
	icon,
}: {
	label: string;
	value: string;
	icon?: ReactNode;
}) {
	return (
		<div className="border border-border bg-muted/50 px-3 py-2">
			<p className="text-muted-foreground text-xs">{label}</p>
			<p className="mt-0.5 flex items-center gap-1 font-semibold text-sm">
				{icon}
				{value}
			</p>
		</div>
	);
}
