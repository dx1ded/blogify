import prisma from "~/prisma"
import { H4 } from "~/shared/ui/Typography"
import { Posts } from "./Posts"

export async function PostList({ userId }: { userId: string }) {
  const posts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    include: {
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {!posts.length ? (
        <div className="col-span-4 flex h-[40vh] items-center justify-center">
          <H4 className="text-gray-700">No posts</H4>
        </div>
      ) : (
        <Posts initialPosts={posts} />
      )}
    </div>
  )
}
