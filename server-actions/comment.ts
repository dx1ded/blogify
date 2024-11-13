"use server"

import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "~/providers/auth"
import prisma from "~/prisma"
import { commentSchema } from "~/schemas/comment-schema"

export async function createComment(data: z.output<typeof commentSchema>) {
  const validation = commentSchema.safeParse(data)

  if (!validation.success) {
    throw new Error("Provided data is not valid")
  }

  return prisma.comment.create({
    data,
    include: {
      author: true,
      likedBy: true,
      post: true,
    },
  })
}

export async function likeComment(commentId: number, value: boolean) {
  const session = await getServerSession(authOptions)

  if (!commentId || typeof value === "undefined" || !session?.user.id) {
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

  await prisma.comment.update({
    where: { id: commentId },
    data: {
      likedBy: {
        ...(value ? { connect: { id: session.user.id } } : { disconnect: { id: session.user.id } }),
      },
    },
  })
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
}
