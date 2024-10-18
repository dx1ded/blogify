"use client"

import { MessageSquareIcon, ThumbsUpIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { togglePostLike } from "~/server-actions/post"
import { cn, type Comment as IComment } from "~/shared/lib"
import { Author } from "~/shared/ui/Author"
import { Comment } from "~/shared/ui/Comment"
import { Editor } from "~/shared/ui/Editor"
import { NewComment } from "~/shared/ui/NewComment"
import { Tag } from "~/shared/ui/Tag"
import { H1 } from "~/shared/ui/Typography"
import { usePostStore } from "~/store/post"
import { PostSkeleton } from "./PostSkeleton"

export function Post() {
  const { data } = useSession()
  const post = usePostStore((state) => state.post)
  const isLoading = usePostStore((state) => state.isLoading)
  const stateTogglePostLike = usePostStore((state) => state.togglePostLike)
  const [likeDisabled, setLikeDisabled] = useState(false)

  if (isLoading) return <PostSkeleton />

  const like = async () => {
    if (!data?.user.id) return

    setLikeDisabled(true)

    try {
      // Optimistic approach
      stateTogglePostLike(data.user.id)
      await togglePostLike(post.id)
    } catch (e) {
      toast.error((e as Error).message, { position: "top-right" })
      // Toggling it back if there was an error
      stateTogglePostLike(data.user.id)
    } finally {
      setLikeDisabled(false)
    }
  }

  const getCommentsCount = (comments: IComment[]): number => {
    return comments.reduce(
      (acc, comment) => acc + 1 + (comment.subcomments.length ? getCommentsCount(comment.subcomments) : 0),
      0,
    )
  }

  const isLiked = post.likedBy.some((userId) => userId === data?.user.id)

  return (
    <div className="grid gap-4 md:gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {post.tags.map((tag, i) => (
          <Tag key={i} name={tag} />
        ))}
      </div>
      <H1 className="min-w-0 max-w-full break-words font-semibold">{post.title}</H1>
      <Author className="mb-2" size="lg" nameVariant="dark" name={post.author.name} imageUrl={post.author.image} />
      <Image
        className="max-h-[30rem] w-full rounded-xl object-cover"
        src={post.thumbnailUrl}
        alt="Post"
        width={600}
        height={600}
        priority
      />
      <Editor value={post.content} editable={false} />
      <div className="mt-2 flex items-center gap-4 lg:gap-6">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-semibold lg:gap-3 lg:text-base"
          disabled={likeDisabled || !data?.user}
          onClick={like}>
          <ThumbsUpIcon className={cn("h-4 w-4 lg:h-6 lg:w-6", isLiked && "fill-blue-500")} />
          {post.likedBy.length}
        </button>
        <div className="flex items-center gap-2 text-sm font-semibold lg:gap-3 lg:text-base">
          <MessageSquareIcon className="h-4 w-4 lg:h-6 lg:w-6" />
          {getCommentsCount(post.comments)}
        </div>
      </div>
      <div className="mt-6 lg:mt-8">
        {data?.user ? (
          <NewComment className="mb-6 md:mb-8" />
        ) : (
          <Link href="/login" className="mb-4 inline-block font-medium text-blue-400 md:mb-6">
            Login to comment
          </Link>
        )}
        <div className="grid gap-4 md:gap-6">
          {post.comments.map((comment) => (
            <Comment key={comment.id} {...comment} />
          ))}
        </div>
      </div>
    </div>
  )
}
