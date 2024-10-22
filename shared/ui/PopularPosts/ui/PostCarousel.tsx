"use client"

import type { Prisma } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem } from "~/shared/ui-kit/carousel"
import { Author } from "~/shared/ui/Author"
import { Tag } from "~/shared/ui/Tag"
import { H1 } from "~/shared/ui/Typography"

interface PostCarouselProps {
  posts: Prisma.PostGetPayload<{
    select: {
      id: true
      tags: true
      title: true
      slug: true
      thumbnailUrl: true
      author: {
        select: {
          name: true
          image: true
        }
      }
    }
  }>[]
}

export function PostCarousel({ posts }: PostCarouselProps) {
  return (
    <Carousel className="w-full" opts={{ loop: true, duration: 20 }}>
      <CarouselContent className="h-[20rem] lg:h-[28rem]">
        {posts.map((post) => (
          <CarouselItem key={post.id}>
            <Link href={`/post/${post.slug}`} className="relative block h-full">
              <div className="after:absolute after:left-0 after:top-0 after:h-full after:w-full after:rounded-xl after:bg-[rgba(20,22,36,0.4)]">
                <Image
                  src={post.thumbnailUrl}
                  className="absolute left-0 top-0 h-full w-full rounded-xl object-cover"
                  alt={post.title}
                  width={500}
                  height={500}
                  priority
                />
              </div>
              <div className="relative z-50 flex h-full flex-col items-start justify-end p-5 lg:p-7">
                <Tag name={post.tags[0]} />
                <H1 className="mb-7 mt-3 line-clamp-3 max-w-[50rem] font-bold text-white md:mt-5">{post.title}</H1>
                <Author size="lg" name={post.author.name} imageUrl={post.author.image} />
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
