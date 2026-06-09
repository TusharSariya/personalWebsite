import { Ionicons } from "@expo/vector-icons";
import { MOCK_FEED_AUTHOR } from "@personalWebsite/api/mocks";
import type { Post } from "@personalWebsite/api/schemas/posts";
import { Image } from "expo-image";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { formatRelativeTime } from "./utils/format-relative-time";

function mockLikeCount(postId: string): number {
	let hash = 0;
	for (const char of postId) {
		hash = (hash * 31 + char.charCodeAt(0)) % 1000;
	}
	return 12 + (hash % 180);
}

function getPhotoCaption(post: Post): string | undefined {
	if (post.type !== "photo") return undefined;
	return (post.content as { caption?: string }).caption;
}

function getPhotoLocation(post: Post): string | undefined {
	if (post.type !== "photo") return undefined;
	return (post.content as { location?: string }).location;
}

export function SocialPost({
	post,
	children,
}: {
	post: Post;
	children: ReactNode;
}) {
	const caption = getPhotoCaption(post);
	const location = getPhotoLocation(post);
	const likes = mockLikeCount(post.id);
	const isPhoto = post.type === "photo";
	const isText = post.type === "text";

	return (
		<View className="border-border border-b py-4">
			<View className="mb-3 flex-row items-center gap-3 px-4">
				<Image
					source={{ uri: MOCK_FEED_AUTHOR.avatarUrl }}
					style={{ width: 36, height: 36, borderRadius: 18 }}
					contentFit="cover"
				/>
				<View className="min-w-0 flex-1">
					<Text className="font-semibold text-foreground text-sm">
						{MOCK_FEED_AUTHOR.username}
					</Text>
					{location ? (
						<Text className="text-muted text-xs" numberOfLines={1}>
							{location}
						</Text>
					) : (
						<Text className="text-muted text-xs">
							{formatRelativeTime(post.createdAt)}
						</Text>
					)}
				</View>
				<Pressable accessibilityLabel="More options">
					<Ionicons name="ellipsis-horizontal" size={20} color="#888" />
				</Pressable>
			</View>

			{isText ? <View className="px-4 pb-3">{children}</View> : null}
			{!isText ? (
				<View className={isPhoto ? "" : "px-4"}>{children}</View>
			) : null}

			<View className="px-4 pt-3">
				<View className="flex-row items-center justify-between">
					<View className="flex-row items-center gap-4">
						<Pressable accessibilityLabel="Like">
							<Ionicons name="heart-outline" size={24} color="#fff" />
						</Pressable>
						<Pressable accessibilityLabel="Comment">
							<Ionicons name="chatbubble-outline" size={24} color="#888" />
						</Pressable>
						<Pressable accessibilityLabel="Share">
							<Ionicons name="paper-plane-outline" size={24} color="#888" />
						</Pressable>
					</View>
					<Pressable accessibilityLabel="Save">
						<Ionicons name="bookmark-outline" size={24} color="#888" />
					</Pressable>
				</View>

				<Text className="mt-2 font-semibold text-foreground text-sm">
					{likes} likes
				</Text>

				{caption ? (
					<Text className="mt-1 text-foreground text-sm">
						<Text className="font-semibold">{MOCK_FEED_AUTHOR.username}</Text>{" "}
						{caption}
					</Text>
				) : null}

				{location ? (
					<Text className="mt-1 text-muted text-xs">
						{formatRelativeTime(post.createdAt)}
					</Text>
				) : null}
			</View>
		</View>
	);
}
