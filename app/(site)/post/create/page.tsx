import type { Metadata } from "next"
import { createPost } from "~/server-actions/post"
import PostForm from "~/shared/ui/PostForm"

export const metadata: Metadata = {
  title: "Create",
}

export default async function CreatePost() {
  return <PostForm title="Create post" action={createPost} />
}
