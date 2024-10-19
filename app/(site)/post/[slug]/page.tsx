import prisma from "~/prisma"
import { fetchComments } from "~/server-actions/comment"
import type { Post as IPost } from "~/shared/lib"
import { PostInitializer, Post } from "~/shared/ui/Post"

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findFirst({
    where: {
      slug: params.slug,
    },
    include: {
      author: true,
      likedBy: true,
    },
  })

  if (!post) throw new Error("Not found")

  const comments = await fetchComments(post.id)
  const normalizedPost: IPost = {
    ...post,
    comments,
    likedBy: post.likedBy.map((user) => user.id),
  }

  return (
    <PostInitializer data={normalizedPost}>
      <Post />
    </PostInitializer>
  )
}
