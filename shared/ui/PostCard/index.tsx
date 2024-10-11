import Image from "next/image"
import { Author } from "~/shared/ui/Author"
import { Tag } from "~/shared/ui/Tag"
import { H4 } from "~/shared/ui/Typography"
import { normalizeTimestamp } from "~/shared/lib"

interface PostCardProps {
  title: string
  tag: string
  thumbnailUrl: string
  date: number
  author: {
    name: string
    imageUrl: string
  }
}

export function PostCard({ title, tag, thumbnailUrl, date, author }: PostCardProps) {
  return (
    <div className="rounded-lg border border-[#E8E8EA] p-3.5 shadow">
      <Image src={thumbnailUrl} className="mb-4 w-full rounded-lg object-cover" alt={title} width={200} height={200} />
      <Tag name={tag} variant="secondary" className="mb-2 inline-block rounded-lg" />
      <H4 className="mb-5 line-clamp-2">{title}</H4>
      <div className="flex items-center justify-between gap-2">
        <Author name={author.name} imageUrl={author.imageUrl} nameVariant="dark" />
        <p className="text-nowrap font-sans text-grayish">{normalizeTimestamp(date)}</p>
      </div>
    </div>
  )
}
