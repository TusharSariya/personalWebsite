import type { Post } from "@personalWebsite/api/schemas/posts";
import { Image } from "expo-image";
import { Card } from "heroui-native";
import { Text, View } from "react-native";

function VisibilityBadge({ visibility }: { visibility: Post["visibility"] }) {
	return (
		<View className="rounded-full bg-muted px-2 py-0.5">
			<Text className="text-muted text-xs capitalize">{visibility}</Text>
		</View>
	);
}

function TypeBadge({ type }: { type: Post["type"] }) {
	return (
		<View className="rounded-full bg-accent px-2 py-0.5">
			<Text className="text-accent-foreground text-xs capitalize">{type}</Text>
		</View>
	);
}

function TextCard({ post }: { post: Post }) {
	const content = post.content as { body: string };
	return (
		<Text className="text-base text-foreground leading-6">{content.body}</Text>
	);
}

function PhotoCard({ post }: { post: Post }) {
	const content = post.content as {
		caption?: string;
		imageUrl: string;
	};

	return (
		<View className="gap-3">
			<Image
				source={{ uri: content.imageUrl }}
				style={{ width: "100%", height: 220, borderRadius: 12 }}
				contentFit="cover"
			/>
			{content.caption ? (
				<Text className="text-base text-foreground">{content.caption}</Text>
			) : null}
		</View>
	);
}

function ActivityCard({ post }: { post: Post }) {
	const content = post.content as {
		title: string;
		activityType: string;
		distanceKm?: number;
		durationMinutes?: number;
		mapImageUrl?: string;
	};

	return (
		<View className="gap-3">
			{content.mapImageUrl ? (
				<Image
					source={{ uri: content.mapImageUrl }}
					style={{ width: "100%", height: 160, borderRadius: 12 }}
					contentFit="cover"
				/>
			) : null}
			<Text className="font-semibold text-foreground text-lg">
				{content.title}
			</Text>
			<Text className="text-muted text-sm capitalize">
				{content.activityType}
			</Text>
			<View className="flex-row gap-4">
				{content.distanceKm != null ? (
					<Text className="text-foreground text-sm">
						{content.distanceKm} km
					</Text>
				) : null}
				{content.durationMinutes != null ? (
					<Text className="text-foreground text-sm">
						{content.durationMinutes} min
					</Text>
				) : null}
			</View>
		</View>
	);
}

function BookCard({ post }: { post: Post }) {
	const content = post.content as {
		title: string;
		author: string;
		coverUrl?: string;
		rating?: number;
		status: string;
		review?: string;
	};

	return (
		<View className="flex-row gap-4">
			{content.coverUrl ? (
				<Image
					source={{ uri: content.coverUrl }}
					style={{ width: 72, height: 108, borderRadius: 8 }}
					contentFit="cover"
				/>
			) : null}
			<View className="flex-1 gap-1">
				<Text className="font-semibold text-foreground text-lg">
					{content.title}
				</Text>
				<Text className="text-muted text-sm">{content.author}</Text>
				<Text className="text-muted text-xs capitalize">
					{content.status.replaceAll("_", " ")}
				</Text>
				{content.rating != null ? (
					<Text className="text-foreground text-sm">{content.rating}/5</Text>
				) : null}
				{content.review ? (
					<Text className="text-foreground text-sm">{content.review}</Text>
				) : null}
			</View>
		</View>
	);
}

function ArticleCard({ post }: { post: Post }) {
	const content = post.content as {
		title: string;
		slug: string;
		excerpt: string;
		body?: string;
	};

	return (
		<View className="gap-2">
			<Text className="font-semibold text-foreground text-lg">
				{content.title}
			</Text>
			<Text className="text-muted text-sm">{content.excerpt}</Text>
			<Text className="text-muted text-xs">/{content.slug}</Text>
		</View>
	);
}

export function PostCard({ post }: { post: Post }) {
	return (
		<Card variant="secondary" className="mb-4 p-4">
			<View className="mb-3 flex-row items-center justify-between">
				<TypeBadge type={post.type} />
				<VisibilityBadge visibility={post.visibility} />
			</View>
			{post.type === "text" ? <TextCard post={post} /> : null}
			{post.type === "photo" ? <PhotoCard post={post} /> : null}
			{post.type === "activity" ? <ActivityCard post={post} /> : null}
			{post.type === "book" ? <BookCard post={post} /> : null}
			{post.type === "article" ? <ArticleCard post={post} /> : null}
			<Text className="mt-3 text-muted text-xs">
				{new Date(post.createdAt).toLocaleString()}
			</Text>
		</Card>
	);
}
