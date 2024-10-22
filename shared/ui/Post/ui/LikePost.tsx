"use client"

import { ThumbsUpIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { startTransition, useOptimistic } from "react"
import { toast } from "sonner"
import { likePost } from "~/server-actions/post"
import { cn } from "~/shared/lib"

interface LikePostProps {
  postId: string
  likeCount: number
  isLiked: boolean
}

export function LikePost({ postId, likeCount, isLiked }: LikePostProps) {
  const { data } = useSession()
  const [likeState, setLikeState] = useOptimistic({ isLiked, likeCount }, (state, value: boolean) => ({
    isLiked: value,
    likeCount: state.likeCount + (value ? 1 : -1),
  }))

  const like = async () => {
    if (!data?.user.id) return

    try {
      setLikeState(!likeState.isLiked)
      await likePost(postId, !likeState.isLiked)
    } catch (e) {
      toast.error((e as Error).message, { position: "top-right" })
    }
  }

  return (
    <button
      type="button"
      className="flex items-center gap-2 text-sm font-semibold lg:gap-3 lg:text-base"
      disabled={!data?.user}
      onClick={() => startTransition(like)}>
      <ThumbsUpIcon className={cn("h-4 w-4 lg:h-6 lg:w-6", likeState.isLiked && "fill-blue-500")} />
      {likeState.likeCount}
    </button>
  )
}
