import "server-only"

import { cache } from "react"
import { getRecursiveComments } from "@prisma/client/sql"
import prisma from "~/prisma"
import type { Comment, NonNullableObject } from "~/shared/lib"

export const fetchComments = cache(async (postId: string, userId?: string) => {
  const flatComments = (await prisma.$queryRawTyped(
    // Casting `userId` as string even if it's a null because Prisma TypedSQL doesn't support optional arguments
    getRecursiveComments(postId, userId as string),
  )) as NonNullableObject<getRecursiveComments.Result>[]

  const commentMap = new Map<number, Comment>()

  // First pass: create all comment objects
  flatComments.forEach((comment) => {
    commentMap.set(comment.id, {
      ...comment,
      author: {
        id: comment.authorId,
        name: comment.authorName,
        image: comment.authorImage,
      },
      subcomments: [],
    })
  })

  // Second pass: build the tree structure
  const rootComments: Comment[] = []
  flatComments.forEach((comment) => {
    if (comment.parentCommentId === null) {
      rootComments.push(commentMap.get(comment.id)!)
    } else {
      const parentComment = commentMap.get(comment.parentCommentId)
      if (parentComment) {
        parentComment.subcomments.push(commentMap.get(comment.id)!)
      }
    }
  })

  return rootComments
})
