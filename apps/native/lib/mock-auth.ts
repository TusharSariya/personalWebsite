import {
	createMockDevSession,
	isMockDevCredentials,
	type MockAuthSession,
} from "@personalWebsite/api/mocks";
import * as SecureStore from "expo-secure-store";

const STORAGE_KEY = "personalWebsite:mock-auth-session";

let cachedSession: MockAuthSession | null | undefined;
const listeners = new Set<() => void>();

export function isMockAuthEnabled() {
	return process.env.EXPO_PUBLIC_USE_MOCK_AUTH === "true";
}

function notifyListeners() {
	for (const listener of listeners) {
		listener();
	}
}

export function subscribeMockAuth(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function parseStoredSession(raw: string | null): MockAuthSession | null {
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

export async function readMockSession(): Promise<MockAuthSession | null> {
	if (cachedSession !== undefined) {
		return cachedSession;
	}

	const raw = await SecureStore.getItemAsync(STORAGE_KEY);
	cachedSession = parseStoredSession(raw);
	return cachedSession;
}

export async function writeMockSession(session: MockAuthSession) {
	cachedSession = session;
	await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(session));
	notifyListeners();
}

export async function clearMockSession() {
	cachedSession = null;
	await SecureStore.deleteItemAsync(STORAGE_KEY);
	notifyListeners();
}

export async function signInWithMockDevCredentials(
	identifier: string,
	password: string,
): Promise<MockAuthSession | null> {
	if (!isMockAuthEnabled() || !isMockDevCredentials(identifier, password)) {
		return null;
	}

	const session = createMockDevSession();
	await writeMockSession(session);
	return session;
}
