import { listMockPosts } from "@personalWebsite/api/mocks";
import type { ListPostsOutput } from "@personalWebsite/api/schemas/posts";
import { useInfiniteQuery } from "@tanstack/react-query";

import { isMockFeedEnabled } from "@/lib/mock-feed";
import { orpc } from "@/utils/orpc";

const MOCK_FEED_QUERY_KEY = ["mock-feed"] as const;
const MOCK_NETWORK_DELAY_MS = 250;

export function useFeedInfiniteQuery(pageSize: number) {
	const useMockFeed = isMockFeedEnabled();

	return useInfiniteQuery({
		...(useMockFeed
			? {
					queryKey: MOCK_FEED_QUERY_KEY,
					queryFn: async ({
						pageParam,
					}: {
						pageParam: string | undefined;
					}): Promise<ListPostsOutput> => {
						await new Promise((resolve) =>
							setTimeout(resolve, MOCK_NETWORK_DELAY_MS),
						);
						return listMockPosts(pageParam, pageSize);
					},
					initialPageParam: undefined as string | undefined,
					getNextPageParam: (lastPage: ListPostsOutput) =>
						lastPage.nextCursor ?? undefined,
				}
			: orpc.posts.list.infiniteOptions({
					input: (pageParam: string | undefined) => ({
						cursor: pageParam,
						limit: pageSize,
					}),
					initialPageParam: undefined,
					getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
				})),
	});
}

export function useFeedUsesMock() {
	return isMockFeedEnabled();
}
