import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "../../..");
const defaultTcx = join(repoRoot, "activity_23165095318.tcx");
const defaultGpx = join(repoRoot, "activity_23165095318.gpx");
const outputPath = join(
	scriptDir,
	"../src/mocks/fixtures/st-johns-running.json",
);

const tcxPath = process.argv[2] ?? defaultTcx;
const gpxPath = process.argv[3] ?? defaultGpx;

const parser = new XMLParser({
	ignoreAttributes: false,
	removeNSPrefix: true,
	isArray: (name) =>
		["Lap", "Trackpoint", "trkpt", "trkseg", "trk"].includes(name),
});

function asArray<T>(value: T | T[] | undefined): T[] {
	if (value === undefined) return [];
	return Array.isArray(value) ? value : [value];
}

function readHr(
	hr: { Value?: string | number } | undefined,
): number | undefined {
	const value = hr?.Value;
	if (value === undefined) return undefined;
	const n = Number(value);
	return Number.isFinite(n) ? n : undefined;
}

function tcxActivity(tcxPath: string) {
	const xml = readFileSync(tcxPath, "utf8");
	const doc = parser.parse(xml);
	const activity = doc.TrainingCenterDatabase?.Activities?.Activity;
	if (!activity) {
		throw new Error(`No Activity found in ${tcxPath}`);
	}

	const sport: string = activity["@_Sport"] ?? "Other";
	const startedAt: string = activity.Id;
	const laps = asArray(activity.Lap).map((lap) => ({
		startTime: lap["@_StartTime"] as string | undefined,
		durationSeconds: Number(lap.TotalTimeSeconds ?? 0),
		distanceMeters: Number(lap.DistanceMeters ?? 0),
		calories: Number(lap.Calories ?? 0),
		avgHeartRate: readHr(lap.AverageHeartRateBpm),
		maxHeartRate: readHr(lap.MaximumHeartRateBpm),
	}));

	const totalDurationSeconds = laps.reduce(
		(sum, lap) => sum + lap.durationSeconds,
		0,
	);
	const totalDistanceMeters = laps.reduce(
		(sum, lap) => sum + lap.distanceMeters,
		0,
	);

	const creator = activity.Creator;
	const device = typeof creator?.Name === "string" ? creator.Name : undefined;

	const sourceIdMatch = basename(tcxPath).match(/(\d+)/);
	const sourceId = sourceIdMatch?.[1];

	return {
		sport,
		startedAt,
		laps,
		totalDurationSeconds,
		totalDistanceMeters,
		device,
		sourceId,
	};
}

function gpxTitle(gpxPath: string): string | undefined {
	const xml = readFileSync(gpxPath, "utf8");
	const doc = parser.parse(xml);
	const tracks = asArray(doc.gpx?.trk);
	const name = tracks[0]?.name;
	return typeof name === "string" && name.length > 0 ? name : undefined;
}

function sportToActivityType(sport: string): string {
	const normalized = sport.toLowerCase();
	if (normalized.includes("running")) return "run";
	if (normalized.includes("biking") || normalized.includes("cycling")) {
		return "bike";
	}
	if (normalized.includes("hiking")) return "hike";
	return normalized.replace(/\s+/g, "_");
}

function round1(n: number): number {
	return Math.round(n * 10) / 10;
}

const tcx = tcxActivity(tcxPath);
const title = gpxTitle(gpxPath) ?? `${tcx.sport} activity`;

const laps = tcx.laps.map((lap) => ({
	distanceMeters: Math.round(lap.distanceMeters),
	durationSeconds: Math.round(lap.durationSeconds),
	avgHeartRate: lap.avgHeartRate,
	maxHeartRate: lap.maxHeartRate,
	calories: lap.calories,
}));

const totalCalories = laps.reduce((sum, lap) => sum + (lap.calories ?? 0), 0);
const hrWeightedSum = laps.reduce(
	(sum, lap) => sum + (lap.avgHeartRate ?? 0) * lap.durationSeconds,
	0,
);
const avgHeartRate =
	tcx.totalDurationSeconds > 0
		? Math.round(hrWeightedSum / tcx.totalDurationSeconds)
		: undefined;

const distanceKm = round1(tcx.totalDistanceMeters / 1000);
const durationMinutes = Math.round(tcx.totalDurationSeconds / 60);
const paceMinPerKm =
	distanceKm > 0 ? round1(durationMinutes / distanceKm) : undefined;

const fixture = {
	content: {
		title,
		activityType: sportToActivityType(tcx.sport),
		distanceKm,
		durationMinutes,
		source: "garmin" as const,
		device: tcx.device,
		avgHeartRate,
		calories: totalCalories > 0 ? totalCalories : undefined,
		paceMinPerKm,
		startedAt: tcx.startedAt,
		mapImageUrl:
			"https://staticmap.openstreetmap.de/staticmap.php?center=47.57,-52.71&zoom=13&size=800x400&maptype=mapnik",
	},
	meta: {
		sourceId: tcx.sourceId,
		startedAt: tcx.startedAt,
		device: tcx.device,
		sport: tcx.sport,
		durationSeconds: Math.round(tcx.totalDurationSeconds),
		distanceMeters: Math.round(tcx.totalDistanceMeters),
		laps,
	},
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(fixture, null, "\t")}\n`, "utf8");
console.log(`Wrote ${outputPath}`);
console.log(JSON.stringify(fixture.content, null, 2));
