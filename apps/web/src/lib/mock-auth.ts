import {
	createMockDevSession,
	isMockDevCredentials,
	type MockAuthSession,
} from "@personalWebsite/api/mocks";

const STORAGE_KEY = "personalWebsite:mock-auth-session";

export function isMockAuthEnabled() {
	return import.meta.env.VITE_USE_MOCK_AUTH === "true";
}

export function readMockSession(): MockAuthSession | null {
	if (typeof window === "undefined") {
		return null;
	}

	const raw = window.localStorage.getItem(STORAGE_KEY);
	if (!raw) {
		return null;
	}

	try {
		const parsed = JSON.parse(raw) as MockAuthSession;
		if (!parsed?.data?.user) {
			return null;
		}
		return {
			data: {
				session: {
					...parsed.data.session,
					expiresAt: new Date(parsed.data.session.expiresAt),
					createdAt: new Date(parsed.data.session.createdAt),
					updatedAt: new Date(parsed.data.session.updatedAt),
				},
				user: {
					...parsed.data.user,
					createdAt: new Date(parsed.data.user.createdAt),
					updatedAt: new Date(parsed.data.user.updatedAt),
				},
			},
		};
	} catch {
		return null;
	}
}

export function writeMockSession(session: MockAuthSession) {
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
	window.dispatchEvent(new Event("mock-auth-changed"));
}

export function clearMockSession() {
	window.localStorage.removeItem(STORAGE_KEY);
	window.dispatchEvent(new Event("mock-auth-changed"));
}

export function signInWithMockDevCredentials(
	identifier: string,
	password: string,
): MockAuthSession | null {
	if (!isMockAuthEnabled() || !isMockDevCredentials(identifier, password)) {
		return null;
	}

	const session = createMockDevSession();
	writeMockSession(session);
	return session;
}
