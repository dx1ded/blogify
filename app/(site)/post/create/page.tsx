import { createPost } from "~/server-actions/post"
import PostForm from "~/shared/ui/PostForm"

export default async function CreatePost() {
  return <PostForm title="Create post" action={createPost} />
}
