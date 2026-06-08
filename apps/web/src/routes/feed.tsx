import { createFileRoute, Link } from "@tanstack/react-router";

import { FeedList } from "@/components/feed/feed-list";
import { isMockFeedEnabled } from "@/lib/mock-feed";

export const Route = createFileRoute("/feed")({
	component: FeedRoute,
});

function FeedRoute() {
	const usesMockFeed = isMockFeedEnabled();

	return (
		<div className="container mx-auto max-w-2xl px-4 py-6">
			<div className="mb-6">
				<h1 className="font-bold text-3xl">Feed</h1>
				<p className="mt-1 text-muted-foreground">
					Chronological life log with photos, runs, books, and articles.
				</p>
				{usesMockFeed ? (
					<p className="mt-2 text-muted-foreground text-sm">
						Launch instantly with mock data.{" "}
						<Link to="/login" className="underline">
							Sign in
						</Link>{" "}
						when you are ready to use the real API.
					</p>
				) : null}
			</div>
			<FeedList />
		</div>
	);
}
