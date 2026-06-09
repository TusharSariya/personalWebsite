import type { Post } from "@personalWebsite/api/schemas/posts";
import { Button } from "@personalWebsite/ui/components/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { MockFeedBanner } from "@/components/feed/mock-feed-banner";
import { PostCard } from "@/components/feed/post-card";
import {
	useFeedInfiniteQuery,
	useFeedUsesMock,
} from "@/hooks/use-feed-infinite-query";
import { orpc } from "@/utils/orpc";

const PAGE_SIZE = 5;

export function FeedList() {
	const parentRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();
	const usesMockFeed = useFeedUsesMock();
	const feedQuery = useFeedInfiniteQuery(PAGE_SIZE);

	const seedMutation = useMutation(
		orpc.posts.seedDemo.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.posts.key() });
			},
		}),
	);

	const posts = useMemo(
		() => feedQuery.data?.pages.flatMap((page) => page.items) ?? [],
		[feedQuery.data],
	);

	const rowVirtualizer = useVirtualizer({
		count: posts.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 480,
		overscan: 4,
	});

	const loadMore = useCallback(() => {
		if (feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) {
			feedQuery.fetchNextPage();
		}
	}, [feedQuery]);

	const virtualItems = rowVirtualizer.getVirtualItems();

	useEffect(() => {
		const lastItem = virtualItems.at(-1);
		if (!lastItem) {
			return;
		}

		if (lastItem.index >= posts.length - 2) {
			loadMore();
		}
	}, [virtualItems, posts.length, loadMore]);

	if (feedQuery.isLoading) {
		return <p className="px-4 py-6 text-muted-foreground">Loading feed...</p>;
	}

	if (feedQuery.isError) {
		return (
			<div className="space-y-3 px-4 py-6">
				<p>Could not load your feed.</p>
				{usesMockFeed ? null : (
					<p className="text-muted-foreground text-sm">
						Sign in and run{" "}
						<code className="rounded bg-muted px-1">bun run dev:server</code>,
						or set{" "}
						<code className="rounded bg-muted px-1">
							VITE_USE_MOCK_FEED=true
						</code>{" "}
						in apps/web/.env for demo posts.
					</p>
				)}
				<Button onClick={() => feedQuery.refetch()}>Retry</Button>
			</div>
		);
	}

	if (posts.length === 0) {
		return (
			<div className="rounded-xl border p-8 text-center">
				<h2 className="mb-2 font-semibold text-xl">Your feed is empty</h2>
				<p className="mb-4 text-muted-foreground">
					{usesMockFeed
						? "Mock feed returned no posts."
						: "Seed demo posts to preview mixed infinite scroll."}
				</p>
				{usesMockFeed ? null : (
					<Button
						disabled={seedMutation.isPending}
						onClick={() => seedMutation.mutate({})}
					>
						{seedMutation.isPending ? "Seeding..." : "Seed demo posts"}
					</Button>
				)}
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col">
			{usesMockFeed ? (
				<div className="shrink-0 px-4 pt-4">
					<MockFeedBanner />
				</div>
			) : null}

			<div ref={parentRef} className="min-h-0 flex-1 overflow-auto">
				<div
					style={{
						height: `${rowVirtualizer.getTotalSize()}px`,
						width: "100%",
						position: "relative",
					}}
				>
					{virtualItems.map((virtualRow) => {
						const item = posts[virtualRow.index] as Post;

						return (
							<div
								key={item.id}
								data-index={virtualRow.index}
								ref={rowVirtualizer.measureElement}
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								<PostCard post={item} />
							</div>
						);
					})}
				</div>
			</div>

			{feedQuery.isFetchingNextPage ? (
				<p className="shrink-0 py-3 text-center text-muted-foreground text-sm">
					Loading more...
				</p>
			) : null}
		</div>
	);
}
