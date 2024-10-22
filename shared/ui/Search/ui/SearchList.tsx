// A server component to fetch all the data and render SearchList

import { fetchPosts } from "~/server-actions/post"
import { SearchResult } from "./SearchResult"

export async function SearchList({
  searchParams,
}: {
  searchParams: {
    search?: string
  }
}) {
  const posts = await fetchPosts({ search: searchParams.search })

  return <SearchResult initialPosts={posts} />
}
