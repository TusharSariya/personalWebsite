import type { MockAuthSession } from "@personalWebsite/api/mocks";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";
import {
	clearMockSession,
	isMockAuthEnabled,
	readMockSession,
	subscribeMockAuth,
} from "@/lib/mock-auth";

export function useAppSession() {
	const [mockSession, setMockSession] = useState<MockAuthSession | null>(null);
	const realSession = authClient.useSession();

	useEffect(() => {
		if (!isMockAuthEnabled()) {
			return;
		}

		readMockSession().then(setMockSession);
		return subscribeMockAuth(() => {
			readMockSession().then(setMockSession);
		});
	}, []);

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

export async function signOutAppSession() {
	if (isMockAuthEnabled() && (await readMockSession())) {
		await clearMockSession();
		return;
	}

	await authClient.signOut();
}
