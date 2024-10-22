import { fetchComments } from "~/data/post"
import { Comments } from "./Comments"

export async function CommentList({ postId, userId }: { postId: string; userId?: string }) {
  const comments = await fetchComments(postId, userId)

  return <Comments postId={postId} initialComments={comments} />
}
