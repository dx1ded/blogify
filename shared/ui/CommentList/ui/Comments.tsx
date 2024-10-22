"use client"

import { useOptimistic, useState } from "react"
import { produce } from "immer"
import type { Comment as IComment } from "~/shared/lib"
import { Comment } from "~/shared/ui/Comment"
import { NewComment } from "~/shared/ui/NewComment"

const removeComment = (comments: IComment[], commentId: number) => {
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id === commentId) {
      comments.splice(i, 1)
      return true
    }
    if (comments[i].subcomments.length > 0) {
      if (removeComment(comments[i].subcomments, commentId)) {
        return true
      }
    }
  }
  return false
}

export function Comments({ postId, initialComments }: { postId: string; initialComments: IComment[] }) {
  const [comments, setComments] = useState(initialComments)
  const [optimisticComments, removeOptimisticComment] = useOptimistic<IComment[], number>(
    comments,
    (state, commentId) =>
      produce(state, (draft) => {
        removeComment(draft, commentId)
      }),
  )

  const onAdd = (newComment: IComment) => {
    setComments(
      produce((draft) => {
        const addSubcomment = (comments: IComment[]) => {
          for (const comment of comments) {
            if (comment.id === newComment.parentCommentId) {
              comment.subcomments.push(newComment)
              return true
            }
            if (comment.subcomments.length > 0) {
              return addSubcomment(comment.subcomments)
            }
          }
          return false
        }

        if (!newComment.parentCommentId) {
          draft.push(newComment)
        } else if (!addSubcomment(draft)) {
          console.error("Parent comment not found")
        }
      }),
    )
  }

  const onRemove = (commentId: number) => {
    setComments(
      produce((draft) => {
        removeComment(draft, commentId)
      }),
    )
  }

  const onLike = (commentId: number, value: boolean) => {
    setComments(
      produce((draft) => {
        const updateLike = (comments: IComment[]): boolean => {
          for (const comment of comments) {
            if (comment.id === commentId) {
              comment.isLiked = value
              comment.likeCount += value ? 1 : -1
              return true
            }
            if (updateLike(comment.subcomments)) {
              return true
            }
          }
          return false
        }

        if (!updateLike(draft)) {
          console.error("Comment not found")
        }
      }),
    )
  }

  return (
    <div className="grid gap-4 md:gap-6">
      <div className="mb-2">
        <NewComment postId={postId} onAdd={onAdd} />
      </div>
      {optimisticComments.map((comment) => (
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
  )
}
