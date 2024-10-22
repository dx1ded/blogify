"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { toast } from "sonner"
import { fetchPosts } from "~/server-actions/post"
import type { Post } from "~/shared/lib"
import { PostCard } from "~/shared/ui/PostCard"
import { Spinner } from "~/shared/ui/Spinner"

type IPost = Omit<Post, "likedBy" | "comments">

export function SearchResult({ initialPosts }: { initialPosts: IPost[] }) {
  const [posts, setPosts] = useState<IPost[]>(initialPosts)
  const [page, setPage] = useState(1)
  const [isMore, setIsMore] = useState(initialPosts.length === 8)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  const { ref } = useInView({
    rootMargin: "-100% 0px",
    threshold: 0,
    async onChange(inView) {
      if (inView || !isMore || posts.length < 8) return

      try {
        setIsLoading(true)

        const search = searchParams.get("search")
        const nextPosts = await fetchPosts({ search, page: page + 1 })

        if (nextPosts.length < 8) {
          setIsMore(false)
        }

        setPosts((prev) => [...prev, ...nextPosts])
        setPage((prev) => prev + 1)
      } catch (e) {
        toast.error((e as Error).message, { position: "top-right" })
      } finally {
        setIsLoading(false)
      }
    },
  })

  // Every time there's new initialPosts (meaning search param has changed) we reset everything
  useEffect(() => {
    setPosts(initialPosts)
    setPage(1)
    setIsMore(initialPosts.length === 8)
    setIsLoading(false)
  }, [initialPosts])

  return (
    <>
      <div ref={ref} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
      {isLoading ? <Spinner className="mx-auto" /> : null}
    </>
  )
}
