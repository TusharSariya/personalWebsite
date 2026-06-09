import type {
	RouteBounds,
	RoutePoint,
} from "@personalWebsite/api/utils/activity-route";
import {
	getRouteBounds,
	smoothRoutePoints,
} from "@personalWebsite/api/utils/activity-route";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import {
	CircleMarker,
	MapContainer,
	Polyline,
	TileLayer,
	useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./activity-route-map.css";

const CARTO_DARK_NO_LABELS =
	"https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";

const ROUTE_SMOOTH_ITERATIONS = 4;

const ROUTE_OFF_WHITE = "#d8d4cc";

const ROUTE_LINE = {
	color: ROUTE_OFF_WHITE,
	weight: 4,
	lineCap: "round" as const,
	lineJoin: "round" as const,
};

const ROUTE_GLOW = {
	color: ROUTE_OFF_WHITE,
	weight: 6,
	opacity: 0.2,
	lineCap: "round" as const,
	lineJoin: "round" as const,
};

function FitBounds({ bounds }: { bounds: RouteBounds }) {
	const map = useMap();

	useEffect(() => {
		map.fitBounds(bounds, { padding: [12, 12] });
	}, [map, bounds]);

	return null;
}

function RouteEndpoints({ points }: { points: RoutePoint[] }) {
	const start = points[0];
	const end = points.at(-1);
	if (!start || !end) return null;

	return (
		<>
			<CircleMarker
				center={[start.lat, start.lng]}
				radius={5}
				pathOptions={{
					color: ROUTE_OFF_WHITE,
					fillColor: ROUTE_OFF_WHITE,
					fillOpacity: 1,
					weight: 2,
				}}
			/>
			<CircleMarker
				center={[end.lat, end.lng]}
				radius={5}
				pathOptions={{
					color: ROUTE_OFF_WHITE,
					fillColor: "#000000",
					fillOpacity: 1,
					weight: 2,
				}}
			/>
		</>
	);
}

export default function ActivityRouteMapClient({
	routePoints,
}: {
	routePoints: RoutePoint[];
}) {
	const smoothedPoints = useMemo(
		() => smoothRoutePoints(routePoints, ROUTE_SMOOTH_ITERATIONS),
		[routePoints],
	);
	const bounds = getRouteBounds(routePoints);
	const positions = smoothedPoints.map(
		(point) => [point.lat, point.lng] as [number, number],
	);
	const center = L.latLngBounds(bounds).getCenter();

	return (
		<div className="activity-route-map aspect-[2/1] w-full border-border border-b-2">
			<MapContainer
				center={center}
				zoom={14}
				scrollWheelZoom
				zoomControl={false}
				attributionControl={false}
				className="h-full w-full"
				style={{ height: "100%", width: "100%" }}
			>
				<TileLayer url={CARTO_DARK_NO_LABELS} />
				<FitBounds bounds={bounds} />
				<Polyline positions={positions} pathOptions={ROUTE_GLOW} />
				<Polyline positions={positions} pathOptions={ROUTE_LINE} />
				<RouteEndpoints points={routePoints} />
			</MapContainer>
			<p className="px-2 py-1 text-[10px] text-muted-foreground">
				© OpenStreetMap · © CARTO
			</p>
		</div>
	);
}
