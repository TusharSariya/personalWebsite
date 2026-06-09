import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { FeedList } from "@/components/feed/feed-list";
import { SignIn } from "@/components/sign-in";
import { useAppSession } from "@/lib/app-session";
import { isMockFeedEnabled } from "@/lib/mock-feed";

export default function FeedScreen() {
	const { data: session } = useAppSession();
	const usesMockFeed = isMockFeedEnabled();

	if (!usesMockFeed && !session?.user) {
		return (
			<Container className="p-6">
				<View className="mb-6">
					<Text className="font-bold text-3xl text-foreground">Life Log</Text>
					<Text className="mt-2 text-muted">
						Sign in to browse your feed, or enable mock mode in .env.
					</Text>
				</View>
				<SignIn />
			</Container>
		);
	}

	return (
		<Container className="flex-1">
			<View className="border-border border-b px-4 py-3">
				<Text className="font-bold text-2xl text-foreground">Feed</Text>
				{usesMockFeed ? (
					<Text className="mt-1 text-muted text-sm">
						Demo mode — scroll to load more mock posts
					</Text>
				) : null}
			</View>
			<FeedList />
		</Container>
	);
}
