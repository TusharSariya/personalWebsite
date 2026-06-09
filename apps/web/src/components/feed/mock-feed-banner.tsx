export function MockFeedBanner() {
	return (
		<div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-950 text-sm dark:text-amber-100">
			Demo mode: showing mock feed data. No server or database required. Set{" "}
			<code className="rounded bg-black/10 px-1 py-0.5">
				VITE_USE_MOCK_FEED=false
			</code>{" "}
			to use the real API.
		</div>
	);
}
