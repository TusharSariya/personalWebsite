const UNITS: {
	limit: number;
	divisor: number;
	unit: Intl.RelativeTimeFormatUnit;
}[] = [
	{ limit: 60, divisor: 1, unit: "second" },
	{ limit: 3600, divisor: 60, unit: "minute" },
	{ limit: 86400, divisor: 3600, unit: "hour" },
	{ limit: 604800, divisor: 86400, unit: "day" },
	{ limit: 2629800, divisor: 604800, unit: "week" },
	{ limit: 31557600, divisor: 2629800, unit: "month" },
	{ limit: Number.POSITIVE_INFINITY, divisor: 31557600, unit: "year" },
];

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function formatRelativeTime(isoDate: string): string {
	const deltaSeconds = Math.round(
		(new Date(isoDate).getTime() - Date.now()) / 1000,
	);
	const absSeconds = Math.abs(deltaSeconds);

	for (const { limit, divisor, unit } of UNITS) {
		if (absSeconds < limit) {
			const value = Math.round(deltaSeconds / divisor);
			return rtf.format(value, unit);
		}
	}

	return rtf.format(0, "second");
}
