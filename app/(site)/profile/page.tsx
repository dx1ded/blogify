import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import Image from "next/image"
import { Suspense } from "react"
import { authOptions } from "~/app/api/auth/[...nextauth]/route"
import { PostList, PostListSkeleton } from "~/shared/ui/PostList"
import { H2 } from "~/shared/ui/Typography"

export const metadata: Metadata = {
  title: "Profile",
}

export default async function Profile() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Not authorized")

  const { user } = session

  return (
    <div>
      <div className="mb-6 flex flex-col items-center gap-5 md:mb-8 lg:mb-10">
        <Image
          className="h-48 w-48 rounded-full shadow"
          src={user.image}
          alt={user.name}
          width={300}
          height={300}
          priority
        />
        <H2 className="md:mb-4">{user.name}</H2>
        <Suspense fallback={<PostListSkeleton />}>
          <PostList userId={user.id} />
        </Suspense>
      </div>
    </div>
  )
}
