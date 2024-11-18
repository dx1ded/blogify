import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { authOptions } from "~/providers/auth"
import prisma from "~/prisma"
import { CommentList, CommentListSkeleton } from "~/shared/ui/CommentList"
import { Post } from "~/shared/ui/Post"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.post.findFirst({
    where: { slug: params?.slug },
    select: { title: true },
  })

  if (!post) {
    return { title: "Not found" }
  }

  return { title: post.title }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)

  const post = await prisma.post.findFirst({
    where: {
      slug: params.slug,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: { likedBy: true },
      },
      likedBy: {
        where: {
          id: session?.user.id,
        },
        select: {
          id: true,
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="grid gap-10 lg:gap-14">
      <Post post={{ ...post, likeCount: post._count.likedBy, isLiked: post.likedBy.length > 0 }} />
      <Suspense fallback={<CommentListSkeleton />}>
        <CommentList postId={post.id} userId={session?.user.id} />
      </Suspense>
    </div>
  )
}
