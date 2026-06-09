import { MOCK_USER_ID } from "./feed-posts";

/** Dev-only mock credentials — never use in production. */
export const MOCK_DEV_USERNAME = "admin";
export const MOCK_DEV_PASSWORD = "admin";
export const MOCK_DEV_EMAIL = "admin@dev.local";
export const MOCK_DEV_USER_ID = MOCK_USER_ID;

export type MockAuthSession = {
	data: {
		session: {
			id: string;
			userId: string;
			expiresAt: Date;
			token: string;
			createdAt: Date;
			updatedAt: Date;
		};
		user: {
			id: string;
			name: string;
			email: string;
			emailVerified: boolean;
			image: string | null;
			createdAt: Date;
			updatedAt: Date;
		};
	};
};

export function normalizeMockDevIdentifier(identifier: string) {
	const trimmed = identifier.trim().toLowerCase();
	if (trimmed === MOCK_DEV_USERNAME) {
		return MOCK_DEV_EMAIL;
	}
	return trimmed;
}

export function isMockDevCredentials(identifier: string, password: string) {
	const email = normalizeMockDevIdentifier(identifier);
	return email === MOCK_DEV_EMAIL && password === MOCK_DEV_PASSWORD;
}

export function createMockDevSession(): MockAuthSession {
	const now = new Date();
	return {
		data: {
			session: {
				id: "mock-dev-session",
				userId: MOCK_DEV_USER_ID,
				expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
				token: "mock-dev-token",
				createdAt: now,
				updatedAt: now,
			},
			user: {
				id: MOCK_DEV_USER_ID,
				name: "Admin",
				email: MOCK_DEV_EMAIL,
				emailVerified: true,
				image: null,
				createdAt: now,
				updatedAt: now,
			},
		},
	};
}
