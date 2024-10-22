import prisma from "~/prisma"
import { PostCarousel } from "./PostCarousel"

// Revalidate very 24 hours
export const revalidate = 86400

export async function PopularPosts() {
  const popularPosts = await prisma.post.findMany({
    take: 3,
    orderBy: {
      likedBy: {
        _count: "desc",
      },
    },
    select: {
      id: true,
      tags: true,
      title: true,
      slug: true,
      thumbnailUrl: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  })

  return <PostCarousel posts={popularPosts} />
}
