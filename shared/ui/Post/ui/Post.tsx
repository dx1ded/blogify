import Image from "next/image"
import type { Prisma } from "@prisma/client"
import { Author } from "~/shared/ui/Author"
import { Tag } from "~/shared/ui/Tag"
import { H1 } from "~/shared/ui/Typography"
import { LikePost } from "./LikePost"

export interface IPost
  extends Prisma.PostGetPayload<{
    include: {
      author: {
        select: {
          id: true
          name: true
          image: true
        }
      }
    }
  }> {
  likeCount: number
  isLiked: boolean
}

export function Post({ post }: { post: IPost }) {
  return (
    <div className="grid gap-4 md:gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {post.tags.map((tag, i) => (
          <Tag key={i} name={tag} />
        ))}
      </div>
      <H1 className="min-w-0 max-w-full break-words font-semibold">{post.title}</H1>
      <Author className="mb-2" size="lg" nameVariant="dark" name={post.author.name} imageUrl={post.author.image} />
      <Image
        className="max-h-[30rem] w-full rounded-xl object-cover"
        src={post.thumbnailUrl}
        alt="Post"
        width={600}
        height={600}
        priority
      />
      <div className="font-serif" dangerouslySetInnerHTML={{ __html: post.content }} />
      <div className="mt-2 flex items-center gap-4 lg:gap-6">
        <LikePost postId={post.id} likeCount={post.likeCount} isLiked={post.isLiked} />
      </div>
    </div>
  )
}
