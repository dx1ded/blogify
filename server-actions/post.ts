"use server"

import { put } from "@vercel/blob"
import { nanoid } from "nanoid"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { z } from "zod"
import { authOptions } from "~/app/api/auth/[...nextauth]/route"
import prisma from "~/prisma"
import { postSchema } from "~/schemas/post-schema"
import { mb, sluggify } from "~/shared/lib"

export async function createPost(formData: FormData) {
  const data = Object.fromEntries(formData.entries()) as unknown as z.output<typeof postSchema>
  const session = await getServerSession(authOptions)

  // If tags are `string` as it was stringified before sending formData, we normalize it back
  const tags = formData.get("tags")

  if (typeof tags === "string") {
    data.tags = tags.split(",")
  }

  const validation = postSchema.safeParse(data)

  if (!validation.success || !session?.user.id) {
    throw new Error("Provided data is invalid")
  }

  const { thumbnail, ...postData } = data

  if (thumbnail.size > mb(2)) throw new Error("File cannot be larger than 2 MB")

  const id = nanoid()
  const blob = await put(`${id}_thumbnail`, thumbnail, {
    access: "public",
  })

  const post = await prisma.post.create({
    data: {
      ...postData,
      id,
      authorId: session.user.id,
      thumbnailUrl: blob.downloadUrl,
      slug: sluggify(data.title),
    },
  })

  redirect(`/post/${post.slug}`)
}

export async function togglePostLike(postId: string) {
  const session = await getServerSession(authOptions)

  if (!postId || !session?.user.id) {
    throw new Error("Provided data is not valid")
  }

  const post = await prisma.post.findFirst({
    where: { id: postId },
    include: {
      likedBy: true,
    },
  })

  if (!post) {
    throw new Error("Post not found")
  }

  const isLiked = post.likedBy.some((user) => user.id === session?.user.id)

  if (isLiked) {
    await prisma.post.update({
      where: { id: postId },
      data: {
        likedBy: {
          disconnect: { id: session.user.id },
        },
      },
    })
  } else {
    await prisma.post.update({
      where: { id: postId },
      data: {
        likedBy: {
          connect: { id: session.user.id },
        },
      },
    })
  }

  revalidatePath(`/blog/${post.slug}`)
}
