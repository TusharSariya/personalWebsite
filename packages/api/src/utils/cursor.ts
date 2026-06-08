export type FeedCursor = {
	createdAt: string;
	id: string;
};

export function encodeCursor(cursor: FeedCursor): string {
	return Buffer.from(JSON.stringify(cursor)).toString("base64url");
}

export function decodeCursor(cursor: string): FeedCursor {
	const parsed = JSON.parse(
		Buffer.from(cursor, "base64url").toString("utf8"),
	) as FeedCursor;

	if (!parsed.createdAt || !parsed.id) {
		throw new Error("Invalid cursor");
	}

	return parsed;
}
