import type { Post } from "@personalWebsite/api/schemas/posts";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card } from "heroui-native";
import { useCallback, useMemo } from "react";
import { ActivityIndicator, RefreshControl, Text, View } from "react-native";

import { MockFeedBanner } from "@/components/feed/mock-feed-banner";
import { PostCard } from "@/components/feed/post-card";
import {
	useFeedInfiniteQuery,
	useFeedUsesMock,
} from "@/hooks/use-feed-infinite-query";
import { orpc } from "@/utils/orpc";

const PAGE_SIZE = 5;

export function FeedList() {
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

	const handleEndReached = useCallback(() => {
		if (feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) {
			feedQuery.fetchNextPage();
		}
	}, [feedQuery]);

	const renderItem = useCallback(({ item }: { item: Post }) => {
		return <PostCard post={item} />;
	}, []);

	if (feedQuery.isLoading) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator />
			</View>
		);
	}

	if (feedQuery.isError) {
		return (
			<View className="flex-1 items-center justify-center p-6">
				<Text className="mb-2 text-center text-foreground">
					Could not load your feed.
				</Text>
				<Button onPress={() => feedQuery.refetch()}>Retry</Button>
			</View>
		);
	}

	if (posts.length === 0) {
		return (
			<View className="flex-1 justify-center p-6">
				<Card variant="secondary" className="items-center p-6">
					<Card.Title className="mb-2">Your feed is empty</Card.Title>
					<Card.Description className="mb-4 text-center">
						{usesMockFeed
							? "Mock feed returned no posts."
							: "Seed demo posts to preview mixed infinite scroll."}
					</Card.Description>
					{usesMockFeed ? null : (
						<Button
							onPress={() => seedMutation.mutate({})}
							isDisabled={seedMutation.isPending}
						>
							{seedMutation.isPending ? "Seeding..." : "Seed demo posts"}
						</Button>
					)}
				</Card>
			</View>
		);
	}

	return (
		<View className="flex-1">
			<FlashList
				data={posts}
				renderItem={renderItem}
				estimatedItemSize={480}
				keyExtractor={(item) => item.id}
				onEndReached={handleEndReached}
				onEndReachedThreshold={0.5}
				refreshControl={
					<RefreshControl
						refreshing={feedQuery.isRefetching}
						onRefresh={() => feedQuery.refetch()}
					/>
				}
				ListHeaderComponent={
					usesMockFeed ? (
						<View className="px-4 pt-4">
							<MockFeedBanner />
						</View>
					) : null
				}
				ListFooterComponent={
					feedQuery.isFetchingNextPage ? (
						<View className="py-4">
							<ActivityIndicator />
						</View>
					) : null
				}
			/>
		</View>
	);
}
