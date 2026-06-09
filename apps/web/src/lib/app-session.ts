import { useSyncExternalStore } from "react";

import { authClient } from "@/lib/auth-client";
import {
	clearMockSession,
	isMockAuthEnabled,
	readMockSession,
} from "@/lib/mock-auth";

function subscribeMockAuth(onStoreChange: () => void) {
	window.addEventListener("mock-auth-changed", onStoreChange);
	return () => window.removeEventListener("mock-auth-changed", onStoreChange);
}

export function getAppSession() {
	if (isMockAuthEnabled()) {
		const mockSession = readMockSession();
		if (mockSession) {
			return mockSession;
		}
	}

	return authClient.getSession();
}

export function useAppSession() {
	const mockSession = useSyncExternalStore(
		subscribeMockAuth,
		() => (isMockAuthEnabled() ? readMockSession() : null),
		() => null,
	);
	const realSession = authClient.useSession();

	if (isMockAuthEnabled() && mockSession) {
		return {
			data: mockSession.data,
			isPending: false,
			isRefetching: false,
			error: null,
			refetch: async () => mockSession,
		};
	}

	return realSession;
}

export function signOutAppSession() {
	if (isMockAuthEnabled() && readMockSession()) {
		clearMockSession();
		return;
	}

	authClient.signOut();
}
