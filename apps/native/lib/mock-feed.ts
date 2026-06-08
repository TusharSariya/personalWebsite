export function isMockFeedEnabled() {
	return process.env.EXPO_PUBLIC_USE_MOCK_FEED === "true";
}
