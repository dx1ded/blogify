"use client"

import { EllipsisVerticalIcon, ThumbsUpIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { memo, startTransition, useOptimistic, useState } from "react"
import { toast } from "sonner"
import { removeComment, likeComment } from "~/server-actions/comment"
import { cn, type Comment as IComment, normalizeCommentDate } from "~/shared/lib"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/shared/ui-kit/dropdown-menu"
import { NewComment } from "~/shared/ui/NewComment"
import { Text } from "~/shared/ui/Typography"

interface CommentProps extends IComment {
  onAdd?: (comment: IComment) => void
  onRemove?: (commentId: number) => void
  onLike?: (commentId: number, value: boolean) => void
  removeOptimisticComment?: (commentId: number) => void
}

export const Comment = memo<CommentProps>(function Comment({
  id,
  postId,
  text,
  author,
  createdAt,
  subcomments,
  likeCount,
  isLiked,
  onAdd,
  onRemove,
  onLike,
  removeOptimisticComment,
}) {
  const { data } = useSession()
  const [likeState, setLikeState] = useOptimistic({ isLiked, likeCount }, (state, value: boolean) => ({
    isLiked: value,
    likeCount: state.likeCount + (value ? 1 : -1),
  }))
  const [likeDisabled, setLikeDisabled] = useState(false)
  const [removeDisabled, setRemoveDisabled] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)

  const like = async () => {
    setLikeDisabled(true)

    try {
      setLikeState(!isLiked)
      await likeComment(id, !isLiked)
      if (onLike) onLike(id, !isLiked)
    } catch (e) {
      toast.error((e as Error).message, { position: "top-right" })
    } finally {
      setLikeDisabled(false)
    }
  }

  const remove = async () => {
    setRemoveDisabled(true)

    try {
      if (removeOptimisticComment) removeOptimisticComment(id)
      await removeComment(id)
      if (onRemove) onRemove(id)
    } catch (e) {
      toast.error((e as Error).message, { position: "top-right" })
    } finally {
      setRemoveDisabled(false)
    }
  }

  const isCreator = author.id === data?.user.id

  return (
    <div className="grid gap-4 md:gap-6">
      <div className="flex items-start gap-3 rounded-lg border pb-4 pl-3 pr-2 pt-3 shadow md:py-4">
        <Image
          className="h-8 w-8 rounded-full object-cover"
          src={author.image}
          alt={author.name}
          width={32}
          height={32}
        />
        <div className="flex-1">
          <div className="mb-1 flex items-center">
            <div className="flex flex-1 items-center gap-2 sm:gap-3 md:gap-4">
              <Text className="truncate font-semibold">{author.name}</Text>
              <small className="text-nowrap font-medium text-gray-500">{normalizeCommentDate(createdAt)}</small>
            </div>
            {isCreator ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="flex h-4 w-4 items-center justify-center text-gray-500">
                    <EllipsisVerticalIcon className="h-full w-full" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="font-medium text-red-400 focus:text-red-400"
                    disabled={removeDisabled}
                    onClick={() => startTransition(remove)}>
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
          <p className="mb-3.5 line-clamp-3 pr-3 text-sm">{text}</p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-semibold"
              disabled={likeDisabled || !data?.user}
              onClick={() => startTransition(like)}>
              <ThumbsUpIcon className={cn("h-4 w-4", likeState.isLiked && "fill-blue-500")} />
              {likeState.likeCount}
            </button>
            <button
              type="button"
              className="text-sm font-semibold text-gray-500"
              disabled={!data?.user}
              onClick={() => setReplyOpen((value) => !value)}>
              Reply
            </button>
          </div>
        </div>
      </div>
      {replyOpen ? (
        <NewComment
          size="md"
          postId={postId}
          parentCommentId={id}
          onAdd={onAdd}
          postHandler={() => setReplyOpen(false)}
        />
      ) : null}
      {subcomments.length ? (
        <div className="grid gap-4 border-l pl-4 md:gap-6 md:pl-6 lg:pl-8">
          {subcomments.map((comment) => (
            <Comment
              key={comment.id}
              {...comment}
              onAdd={onAdd}
              onRemove={onRemove}
              onLike={onLike}
              removeOptimisticComment={removeOptimisticComment}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
})
