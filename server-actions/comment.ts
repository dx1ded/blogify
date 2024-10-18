"use server"

import { getRecursiveComments } from "@prisma/client/sql"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { authOptions } from "~/app/api/auth/[...nextauth]/route"
import prisma from "~/prisma"
import { commentSchema } from "~/schemas/comment-schema"
import type { Comment, NonNullableObject } from "~/shared/lib"

export async function fetchComments(postId: string) {
  const flatComments = (await prisma.$queryRawTyped(
    getRecursiveComments(postId),
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
      likedBy: comment.likedByUserIds || [],
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
}

export async function createComment(data: z.output<typeof commentSchema>) {
  const validation = commentSchema.safeParse(data)

  if (!validation.success) {
    throw new Error("Provided data is not valid")
  }

  const comment = await prisma.comment.create({
    data,
    include: {
      author: true,
      likedBy: true,
      post: true,
    },
  })

  revalidatePath(`/blog/${comment.post.slug}`)

  return comment
}

export async function toggleCommentLike(commentId: number) {
  const session = await getServerSession(authOptions)

  if (!commentId || !session?.user.id) {
    throw new Error("Provided data is not valid")
  }

  const comment = await prisma.comment.findFirst({
    where: { id: commentId },
    include: {
      likedBy: true,
      post: true,
    },
  })

  if (!comment) {
    throw new Error("Comment not found")
  }

  const isLiked = comment.likedBy.some((user) => user.id === session?.user.id)

  if (isLiked) {
    await prisma.comment.update({
      where: { id: commentId },
      data: {
        likedBy: {
          disconnect: { id: session.user.id },
        },
      },
    })
  } else {
    await prisma.comment.update({
      where: { id: commentId },
      data: {
        likedBy: {
          connect: { id: session.user.id },
        },
      },
    })
  }

  revalidatePath(`/blog/${comment.post.slug}`)
}

export async function removeComment(commentId: number) {
  const session = await getServerSession(authOptions)

  if (!commentId || !session?.user.id) {
    throw new Error("Provided data is not valid")
  }

  const comment = await prisma.comment.findFirst({
    where: { id: commentId },
    include: {
      post: true,
    },
  })

  if (!comment) {
    throw new Error("Comment not found")
  }

  if (comment.authorId !== session?.user.id) {
    throw new Error("Not allowed")
  }

  await prisma.comment.delete({
    where: { id: commentId },
  })

  revalidatePath(`/blog/${comment.post.slug}`)
}
