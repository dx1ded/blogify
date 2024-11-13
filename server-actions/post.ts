"use server"

import { put } from "@vercel/blob"
import { nanoid } from "nanoid"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { z } from "zod"
import { authOptions } from "~/providers/auth"
import prisma from "~/prisma"
import { postSchema } from "~/schemas/post-schema"
import { generateSlug, mb } from "~/shared/lib"

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
      slug: generateSlug(data.title),
    },
  })

  redirect(`/post/${post.slug}`)
}

export async function likePost(postId: string, value: boolean) {
  const session = await getServerSession(authOptions)

  if (!postId || typeof value === "undefined" || !session?.user.id) {
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

  await prisma.post.update({
    where: { id: postId },
    data: {
      likedBy: {
        ...(value ? { connect: { id: session.user.id } } : { disconnect: { id: session.user.id } }),
      },
    },
  })

  revalidatePath(`/post/${post.slug}`)
}

export async function editPost(formData: FormData, postId: string) {
  const data = Object.fromEntries(formData.entries()) as unknown as z.output<typeof postSchema>
  const session = await getServerSession(authOptions)

  // If tags are `string` as it was stringified before sending formData, we normalize it back
  const tags = formData.get("tags")

  if (typeof tags === "string") {
    data.tags = tags.split(",")
  }

  const validation = postSchema.safeParse(data)

  if (!validation.success || !session?.user.id || !postId) {
    throw new Error("Provided data is invalid")
  }

  const post = await prisma.post.findFirst({
    where: { id: postId },
  })

  if (!post) {
    throw new Error("Post not found")
  }

  if (post.authorId !== session.user.id) {
    throw new Error("Not allowed")
  }

  const { thumbnail, ...postData } = data

  if (thumbnail.size > mb(2)) throw new Error("File cannot be larger than 2 MB")

  const id = nanoid()
  const blob = await put(`${id}_thumbnail`, thumbnail, {
    access: "public",
  })

  const updatedSlug = post.title !== postData.title ? generateSlug(postData.title) : post.slug

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      ...postData,
      thumbnailUrl: blob.downloadUrl,
      slug: updatedSlug,
    },
  })

  // Deleting previous slug path if it got changed
  if (post.slug !== updatedPost.slug) {
    revalidatePath(`/post/${post.slug}`)
  }

  revalidatePath(`/post/${updatedPost.slug}`)
}

export async function removePost(postId: string) {
  const session = await getServerSession(authOptions)

  if (!postId || !session?.user.id) {
    throw new Error("Provided data is not valid")
  }

  const post = await prisma.post.findFirst({
    where: { id: postId },
  })

  if (!post) {
    throw new Error("Post not found")
  }

  if (post.authorId !== session.user.id) {
    throw new Error("Not allowed")
  }

  await prisma.post.delete({
    where: { id: postId },
  })

  revalidatePath(`/post/${post.slug}`)
}

export async function fetchPosts({ search, page = 1 }: { search?: string | null; page?: number }) {
  return prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      content: true,
      tags: true,
      thumbnailUrl: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    skip: (page - 1) * 8,
    take: page * 8,
    ...(search
      ? {
          where: {
            title: {
              startsWith: search,
              mode: "insensitive",
            },
          },
        }
      : {}),
  })
}
