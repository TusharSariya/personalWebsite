export type FeedCursor = {
	createdAt: string;
	id: string;
};

function encodeBase64Url(value: string): string {
	if (typeof Buffer !== "undefined") {
		return Buffer.from(value).toString("base64url");
	}

	const bytes = new TextEncoder().encode(value);
	let binary = "";
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/g, "");
}

function decodeBase64Url(cursor: string): string {
	if (typeof Buffer !== "undefined") {
		return Buffer.from(cursor, "base64url").toString("utf8");
	}

	const padded = cursor.padEnd(
		cursor.length + ((4 - (cursor.length % 4)) % 4),
		"=",
	);
	const binary = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
	const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
	return new TextDecoder().decode(bytes);
}

export function encodeCursor(cursor: FeedCursor): string {
	return encodeBase64Url(JSON.stringify(cursor));
}

export function decodeCursor(cursor: string): FeedCursor {
	const parsed = JSON.parse(decodeBase64Url(cursor)) as FeedCursor;

	if (!parsed.createdAt || !parsed.id) {
		throw new Error("Invalid cursor");
	}

	return parsed;
}
