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
  title: string
  content: string
  tags: string[]
  thumbnailUrl: string
  author: User
  likedBy: string[]
  comments: Comment[]
}

export interface Comment {
  id: number
  text: string
  author: User
  createdAt: Date
  subcomments: Comment[] // Nested comments
  likedBy: string[]
}
