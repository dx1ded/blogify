"use client"

import { EllipsisVerticalIcon, ThumbsUpIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import { toggleCommentLike, removeComment } from "~/server-actions/comment"
import { cn, type Comment as IComment, normalizeCommentDate } from "~/shared/lib"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/shared/ui-kit/dropdown-menu"
import { NewComment } from "~/shared/ui/NewComment"
import { Text } from "~/shared/ui/Typography"
import { usePostStore } from "~/store/post"

export function Comment({ id, text, author, createdAt, likedBy, subcomments }: IComment) {
  const { data } = useSession()
  const stateToggleCommentLike = usePostStore((state) => state.toggleCommentLike)
  const stateRemoveComment = usePostStore((state) => state.removeComment)
  const [replyOpen, setReplyOpen] = useState(false)
  const [likeDisabled, setLikeDisabled] = useState(false)
  const [removeDisabled, setRemovedDisabled] = useState(false)

  const like = async () => {
    if (!data?.user.id) return

    setLikeDisabled(true)

    try {
      // Optimistic approach
      stateToggleCommentLike(id, data.user.id)
      await toggleCommentLike(id)
    } catch (e) {
      toast.error((e as Error).message, { position: "top-right" })
      // Toggling it back if there was an error
      stateToggleCommentLike(id, data.user.id)
    } finally {
      setLikeDisabled(false)
    }
  }

  const remove = async () => {
    setRemovedDisabled(true)

    try {
      await removeComment(id)
      stateRemoveComment(id)
    } catch (e) {
      toast.error((e as Error).message, { position: "top-right" })
    } finally {
      setRemovedDisabled(false)
    }
  }

  const isCreator = author.id === data?.user.id
  const isLiked = likedBy.some((userId) => userId === data?.user.id)

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
        <div className="w-full">
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
                    onClick={remove}>
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
              onClick={like}>
              <ThumbsUpIcon className={cn("h-4 w-4", isLiked && "fill-blue-500")} />
              {likedBy.length}
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
      {replyOpen ? <NewComment size="md" parentCommentId={id} postHandler={() => setReplyOpen(false)} /> : null}
      {subcomments.length ? (
        <div className="grid gap-4 border-l pl-4 md:gap-6 md:pl-6 lg:pl-8">
          {subcomments.map((comment) => (
            <Comment key={comment.id} {...comment} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
