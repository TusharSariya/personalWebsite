import type { Post } from "@personalWebsite/api/schemas/posts";
import { Activity, Heart, Timer } from "lucide-react";
import type { ReactNode } from "react";

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
		<div className="retro-panel-inset overflow-hidden">
			{content.mapImageUrl ? (
				<img
					src={content.mapImageUrl}
					alt={`Route for ${content.title}`}
					className="h-40 w-full object-cover"
					loading="lazy"
				/>
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
