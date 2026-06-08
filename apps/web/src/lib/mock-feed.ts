export function isMockFeedEnabled() {
	return import.meta.env.VITE_USE_MOCK_FEED === "true";
}
