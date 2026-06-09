import { createFileRoute, Link } from "@tanstack/react-router";

import { FeedList } from "@/components/feed/feed-list";
import { isMockFeedEnabled } from "@/lib/mock-feed";

export const Route = createFileRoute("/feed")({
	component: FeedRoute,
});

function FeedRoute() {
	const usesMockFeed = isMockFeedEnabled();

	return (
		<div className="mx-auto flex h-full min-h-0 w-full max-w-[600px] flex-col border-border border-x-2">
			<header className="shrink-0 border-border border-b-2 px-4 py-3">
				<h1 className="font-semibold text-lg uppercase tracking-wide">Home</h1>
				{usesMockFeed ? (
					<p className="retro-label mt-1">
						Demo feed —{" "}
						<Link to="/login" className="underline">
							sign in
						</Link>{" "}
						for the real API
					</p>
				) : null}
			</header>
			<FeedList />
		</div>
	);
}
