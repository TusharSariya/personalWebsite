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
		estimateSize: () => 320,
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
		return <p className="text-muted-foreground">Loading feed...</p>;
	}

	if (feedQuery.isError) {
		return (
			<div className="space-y-3">
				<p>Could not load your feed.</p>
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
		<div className="space-y-4">
			{usesMockFeed ? <MockFeedBanner /> : null}

			<div className="flex items-center justify-between">
				<p className="text-muted-foreground text-sm">
					{posts.length} posts loaded
					{usesMockFeed ? " (mock)" : ""}
				</p>
				<Button variant="outline" size="sm" onClick={() => feedQuery.refetch()}>
					Refresh
				</Button>
			</div>

			<div ref={parentRef} className="h-[70vh] overflow-auto rounded-xl border">
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
								className="px-4 pt-4"
							>
								<PostCard post={item} />
							</div>
						);
					})}
				</div>
			</div>

			{feedQuery.isFetchingNextPage ? (
				<p className="text-center text-muted-foreground text-sm">
					Loading more...
				</p>
			) : null}
		</div>
	);
}
