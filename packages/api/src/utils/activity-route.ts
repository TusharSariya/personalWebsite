export type RoutePoint = { lat: number; lng: number };

export type RouteBounds = [[number, number], [number, number]];

export function downsampleRoutePoints(
	points: RoutePoint[],
	maxPoints = 80,
): RoutePoint[] {
	if (points.length <= maxPoints) {
		return points;
	}

	const step = (points.length - 1) / (maxPoints - 1);
	const sampled: RoutePoint[] = [];

	for (let i = 0; i < maxPoints; i++) {
		const index = Math.round(i * step);
		const point = points[index];
		if (point) {
			sampled.push(point);
		}
	}

	const last = points.at(-1);
	const sampledLast = sampled.at(-1);
	if (
		last &&
		sampledLast &&
		(last.lat !== sampledLast.lat || last.lng !== sampledLast.lng)
	) {
		sampled.push(last);
	}

	return sampled;
}

export function smoothRoutePoints(
	points: RoutePoint[],
	iterations = 2,
): RoutePoint[] {
	if (points.length < 2) {
		return points;
	}

	const originalStart = points[0];
	const originalEnd = points.at(-1);
	if (!originalStart || !originalEnd) {
		return points;
	}

	let smoothed = [...points];

	for (let i = 0; i < iterations; i++) {
		const next: RoutePoint[] = [];

		for (let j = 0; j < smoothed.length - 1; j++) {
			const p0 = smoothed[j] as RoutePoint;
			const p1 = smoothed[j + 1] as RoutePoint;

			next.push({
				lat: 0.75 * p0.lat + 0.25 * p1.lat,
				lng: 0.75 * p0.lng + 0.25 * p1.lng,
			});
			next.push({
				lat: 0.25 * p0.lat + 0.75 * p1.lat,
				lng: 0.25 * p0.lng + 0.75 * p1.lng,
			});
		}

		smoothed = next;
	}

	smoothed[0] = originalStart;
	smoothed[smoothed.length - 1] = originalEnd;

	return smoothed;
}

export function getRouteBounds(points: RoutePoint[]): RouteBounds {
	let south = points[0]?.lat ?? 0;
	let north = points[0]?.lat ?? 0;
	let west = points[0]?.lng ?? 0;
	let east = points[0]?.lng ?? 0;

	for (const point of points) {
		south = Math.min(south, point.lat);
		north = Math.max(north, point.lat);
		west = Math.min(west, point.lng);
		east = Math.max(east, point.lng);
	}

	return [
		[south, west],
		[north, east],
	];
}

type GpxTrkpt = {
	"@_lat"?: string | number;
	"@_lon"?: string | number;
};

export function parseGpxTrackPointsFromDoc(doc: unknown): RoutePoint[] {
	if (!doc || typeof doc !== "object") {
		return [];
	}

	const gpx = (doc as { gpx?: { trk?: unknown } }).gpx;
	const tracks = asArray(gpx?.trk);
	const points: RoutePoint[] = [];

	for (const track of tracks) {
		const segments = asArray((track as { trkseg?: unknown }).trkseg);
		for (const segment of segments) {
			const trackpoints = asArray(
				(segment as { trkpt?: unknown }).trkpt,
			) as GpxTrkpt[];
			for (const trkpt of trackpoints) {
				const lat = Number(trkpt["@_lat"]);
				const lng = Number(trkpt["@_lon"]);
				if (Number.isFinite(lat) && Number.isFinite(lng)) {
					points.push({ lat, lng });
				}
			}
		}
	}

	return points;
}

function asArray<T>(value: T | T[] | undefined): T[] {
	if (value === undefined) return [];
	return Array.isArray(value) ? value : [value];
}
