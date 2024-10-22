import type { Comment as IComment } from "@prisma/client"

export type WithAsChild<T> = { asChild?: boolean } & T

export type NonNullableObject<T> = {
  [K in keyof T]: NonNullable<T[K]>
}

export interface User {
  id: string
  name: string
  image: string
}

export interface Post {
  id: string
  slug: string
  title: string
  content: string
  tags: string[]
  thumbnailUrl: string
  createdAt: Date
  author: User
  likedBy: string[]
  comments: Comment[]
}

export interface Comment extends IComment {
  author: User
  subcomments: Comment[]
  likeCount: number
  isLiked: boolean
}
