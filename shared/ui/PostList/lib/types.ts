import type { Post } from "~/shared/lib"

export type PostListItem = Omit<Post, "likedBy" | "comments">
