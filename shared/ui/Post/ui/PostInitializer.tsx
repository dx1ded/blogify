"use client"

import { useEffect } from "react"
import type { Post } from "~/shared/lib"
import { usePostStore } from "~/store/post"

export function PostInitializer({ children, data }: { children: React.ReactNode; data: Post }) {
  const setPost = usePostStore((state) => state.setPost)
  const setIsLoading = usePostStore((state) => state.setIsLoading)

  useEffect(() => {
    setPost(data)
    setIsLoading(false)
  }, [data, setIsLoading, setPost])

  return children
}
