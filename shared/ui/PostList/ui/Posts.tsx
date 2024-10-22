// This is a client-side PostList

"use client"

import { useOptimistic, useState } from "react"
import { PostCard } from "~/shared/ui/PostCard"
import type { PostListItem } from "~/shared/ui/PostList"

export function Posts({ initialPosts }: { initialPosts: PostListItem[] }) {
  const [posts, setPosts] = useState<PostListItem[]>(initialPosts)
  const [optimisticPosts, removeOptimistic] = useOptimistic<PostListItem[], string>(posts, (state, postId) =>
    state.filter((post) => post.id !== postId),
  )

  const onRemove = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId))
  }

  return optimisticPosts.map((post) => (
    <PostCard {...post} key={post.id} onRemove={onRemove} removeOptimistic={removeOptimistic} withControls />
  ))
}
