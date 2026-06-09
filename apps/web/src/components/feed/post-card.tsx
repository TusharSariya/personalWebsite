import type { Post } from "@personalWebsite/api/schemas/posts";

import { PostMedia } from "./cards/post-media";
import { SocialPost } from "./social-post";

export function PostCard({ post }: { post: Post }) {
	return (
		<SocialPost post={post}>
			<PostMedia post={post} />
		</SocialPost>
	);
}
