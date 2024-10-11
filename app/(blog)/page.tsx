import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem } from "~/shared/ui-kit/carousel"
import { Author } from "~/shared/ui/Author"
import { PostCard } from "~/shared/ui/PostCard"
import { Search } from "~/shared/ui/Search"
import { Tag } from "~/shared/ui/Tag"
import { H1 } from "~/shared/ui/Typography"

export default function Home() {
  return (
    <main className="py-8">
      <section className="mb-10 w-full lg:mb-12">
        <Carousel className="w-full" opts={{ loop: true, duration: 20 }}>
          <CarouselContent className="h-[20rem] lg:h-[28rem]">
            <CarouselItem>
              <div className="relative h-full">
                <div className="after:absolute after:left-0 after:top-0 after:h-full after:w-full after:rounded-xl after:bg-[rgba(20,22,36,0.4)]">
                  <Image
                    src="/m-post-card-overlay.png"
                    className="absolute left-0 top-0 h-full w-full rounded-xl object-cover"
                    alt="post_name"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="relative z-50 flex h-full flex-col items-start justify-end p-5 lg:p-7">
                  <Tag name="Technology" />
                  <H1 className="mb-7 mt-3 line-clamp-3 max-w-[50rem] font-bold text-white md:mt-5">
                    The Impact of Technology on the Workplace: How Technology is Changing
                  </H1>
                  <Author name="Tracey Dash" imageUrl="/logo.svg" />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="relative h-full">
                <div className="after:absolute after:left-0 after:top-0 after:h-full after:w-full after:rounded-xl after:bg-[rgba(20,22,36,0.4)]">
                  <Image
                    src="/m-post-card-overlay.png"
                    className="absolute left-0 top-0 h-full w-full rounded-xl object-cover"
                    alt="post_name"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="relative z-50 flex h-full flex-col items-start justify-end p-5 lg:p-7">
                  <Tag name="Technology" />
                  <H1 className="mb-7 mt-3 line-clamp-3 max-w-[50rem] font-bold text-white md:mt-5">
                    The Impact of Technology on the Workplace: How Technology is Changing
                  </H1>
                  <Author name="Tracey Dash" imageUrl="/logo.svg" />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="relative h-full">
                <div className="after:absolute after:left-0 after:top-0 after:h-full after:w-full after:rounded-xl after:bg-[rgba(20,22,36,0.4)]">
                  <Image
                    src="/m-post-card-overlay.png"
                    className="absolute left-0 top-0 h-full w-full rounded-xl object-cover"
                    alt="post_name"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="relative z-50 flex h-full flex-col items-start justify-end p-5 lg:p-7">
                  <Tag name="Technology" />
                  <H1 className="mb-7 mt-3 line-clamp-3 max-w-[50rem] font-bold text-white md:mt-5">
                    The Impact of Technology on the Workplace: How Technology is Changing
                  </H1>
                  <Author name="Tracey Dash" imageUrl="/logo.svg" />
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </section>
      <section>
        <Search />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 xl:grid-cols-4">
          <PostCard
            title="The Impact of Technology on the Workplace: How Technology is Changing"
            tag="Technology"
            thumbnailUrl="/post-image.png"
            date={Date.now()}
            author={{
              name: "Tracey Wilson",
              imageUrl: "/logo.svg",
            }}
          />
          <PostCard
            title="The Impact of Technology on the Workplace: How Technology is Changing"
            tag="Technology"
            thumbnailUrl="/post-image.png"
            date={Date.now()}
            author={{
              name: "Tracey Wilson",
              imageUrl: "/logo.svg",
            }}
          />
          <PostCard
            title="The Impact of Technology on the Workplace: How Technology is Changing"
            tag="Technology"
            thumbnailUrl="/post-image.png"
            date={Date.now()}
            author={{
              name: "Tracey Wilson",
              imageUrl: "/logo.svg",
            }}
          />
          <PostCard
            title="The Impact of Technology on the Workplace: How Technology is Changing"
            tag="Technology"
            thumbnailUrl="/post-image.png"
            date={Date.now()}
            author={{
              name: "Tracey Wilson",
              imageUrl: "/logo.svg",
            }}
          />
          <PostCard
            title="The Impact of Technology on the Workplace: How Technology is Changing"
            tag="Technology"
            thumbnailUrl="/post-image.png"
            date={Date.now()}
            author={{
              name: "Tracey Wilson",
              imageUrl: "/logo.svg",
            }}
          />
        </div>
      </section>
    </main>
  )
}
