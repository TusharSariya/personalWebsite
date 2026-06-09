import { createFileRoute, Link } from "@tanstack/react-router";

import { FeedList } from "@/components/feed/feed-list";
import { isMockFeedEnabled } from "@/lib/mock-feed";

export const Route = createFileRoute("/feed")({
	component: FeedRoute,
});

function FeedRoute() {
	const usesMockFeed = isMockFeedEnabled();

	return (
		<div className="mx-auto flex h-full min-h-0 w-full max-w-[600px] flex-col">
			<header className="shrink-0 border-border border-b px-4 py-3">
				<h1 className="font-semibold text-lg">Home</h1>
				{usesMockFeed ? (
					<p className="text-muted-foreground text-xs">
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
