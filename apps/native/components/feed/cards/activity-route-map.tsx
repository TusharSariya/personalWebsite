import type { RoutePoint } from "@personalWebsite/api/utils/activity-route";
import { smoothRoutePoints } from "@personalWebsite/api/utils/activity-route";
import { useEffect, useMemo, useRef } from "react";
import { Text, View } from "react-native";
import MapView, {
	type MapView as MapViewType,
	Polyline,
	UrlTile,
} from "react-native-maps";

const CARTO_DARK_NO_LABELS =
	"https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png";

const ROUTE_SMOOTH_ITERATIONS = 4;

const ROUTE_OFF_WHITE = "#d8d4cc";

export function ActivityRouteMap({
	routePoints,
}: {
	routePoints: RoutePoint[];
}) {
	const mapRef = useRef<MapViewType>(null);
	const smoothedPoints = useMemo(
		() => smoothRoutePoints(routePoints, ROUTE_SMOOTH_ITERATIONS),
		[routePoints],
	);
	const coordinates = useMemo(
		() =>
			smoothedPoints.map((point) => ({
				latitude: point.lat,
				longitude: point.lng,
			})),
		[smoothedPoints],
	);

	useEffect(() => {
		if (coordinates.length < 2) {
			return;
		}

		mapRef.current?.fitToCoordinates(coordinates, {
			edgePadding: { top: 12, right: 12, bottom: 12, left: 12 },
			animated: false,
		});
	}, [coordinates]);

	return (
		<View className="border-border border-b-2">
			<MapView
				ref={mapRef}
				style={{ width: "100%", height: 160, backgroundColor: "#000" }}
				mapType="none"
				userInterfaceStyle="dark"
				scrollEnabled
				zoomEnabled
				rotateEnabled={false}
				pitchEnabled={false}
				showsCompass={false}
				showsScale={false}
				showsUserLocation={false}
				showsMyLocationButton={false}
			>
				<UrlTile
					urlTemplate={CARTO_DARK_NO_LABELS}
					maximumZ={19}
					flipY={false}
				/>
				<Polyline
					coordinates={coordinates}
					strokeColor="rgba(216, 212, 204, 0.2)"
					strokeWidth={6}
					lineCap="round"
					lineJoin="round"
				/>
				<Polyline
					coordinates={coordinates}
					strokeColor={ROUTE_OFF_WHITE}
					strokeWidth={4}
					lineCap="round"
					lineJoin="round"
				/>
			</MapView>
			<Text className="px-2 py-1 text-[10px] text-muted">
				© OpenStreetMap · © CARTO
			</Text>
		</View>
	);
}
