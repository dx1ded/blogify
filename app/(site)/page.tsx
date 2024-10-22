import { PopularPosts } from "~/shared/ui/PopularPosts"
import { Search, SearchList } from "~/shared/ui/Search"

export default function Home({
  searchParams,
}: {
  searchParams: {
    search?: string
  }
}) {
  return (
    <div>
      <section className="mb-10 w-full lg:mb-12">
        <PopularPosts />
      </section>
      <section className="grid gap-5 md:gap-8 lg:gap-10">
        <Search />
        <SearchList searchParams={searchParams} />
      </section>
    </div>
  )
}
