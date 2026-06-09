export function formatPace(minPerKm: number): string {
	const minutes = Math.floor(minPerKm);
	const seconds = Math.round((minPerKm - minutes) * 60);
	return `${minutes}:${seconds.toString().padStart(2, "0")} /km`;
}
