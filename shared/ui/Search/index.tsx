import { SearchIcon } from "lucide-react"

export function Search() {
  return (
    <div className="relative mx-auto max-w-[38.25rem]">
      <input
        placeholder="Search ..."
        className="w-full rounded-3xl border-2 border-primary bg-[#F4F4F5] p-2 pl-5 pr-10 font-serif text-sm font-medium outline-none placeholder:text-[#A1A1AA] md:text-base lg:py-2.5 lg:pr-14 lg:text-[1.125rem]"
      />
      <SearchIcon className="absolute bottom-0 right-3 top-1/2 h-6 w-6 -translate-y-1/2 text-primary lg:right-5 lg:h-7 lg:w-7" />
    </div>
  )
}
