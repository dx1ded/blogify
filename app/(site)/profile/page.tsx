import { getServerSession } from "next-auth"
import Image from "next/image"
import { authOptions } from "~/app/api/auth/[...nextauth]/route"
import prisma from "~/prisma"
import { PostCard } from "~/shared/ui/PostCard"
import { H2 } from "~/shared/ui/Typography"

export default async function Profile() {
  const session = await getServerSession(authOptions)

  const user = session?.user
  if (!user) throw new Error("No session found")

  const posts = await prisma.post.findMany({
    where: {
      authorId: user.id,
    },
  })

  return (
    <div>
      <div className="mb-6 flex flex-col items-center gap-5 md:mb-8 lg:mb-10">
        <Image className="h-48 w-48 rounded-full shadow" src={user.image} alt={user.name} width={300} height={300} />
        <H2>{user.name}</H2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            slug={post.slug}
            title={post.title}
            tag={post.tags[0]}
            thumbnailUrl={post.thumbnailUrl}
            createdAt={post.createdAt}
            author={user}
            withControls
          />
        ))}
      </div>
    </div>
  )
}
