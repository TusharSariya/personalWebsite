import type { RoutePoint } from "@personalWebsite/api/utils/activity-route";
import { lazy, Suspense } from "react";

const ActivityRouteMapClient = lazy(
	() => import("./activity-route-map-client"),
);

function MapPlaceholder() {
	return (
		<div className="aspect-[2/1] w-full border-border border-b-2 bg-muted/30" />
	);
}

export function ActivityRouteMap({
	routePoints,
	isVisible,
}: {
	routePoints: RoutePoint[];
	isVisible: boolean;
}) {
	if (!isVisible) {
		return <MapPlaceholder />;
	}

	if (typeof window === "undefined") {
		return <MapPlaceholder />;
	}

	return (
		<Suspense fallback={<MapPlaceholder />}>
			<ActivityRouteMapClient routePoints={routePoints} />
		</Suspense>
	);
}
