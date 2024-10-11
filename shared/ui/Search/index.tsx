import { SearchIcon } from "lucide-react"
import { Input } from "~/shared/ui/Input"

export function Search() {
  return (
    <div className="relative mx-auto max-w-[38.25rem]">
      <Input
        placeholder="Search ..."
        className="w-full rounded-3xl border-2 border-primary pl-5 pr-10 font-serif text-base font-medium outline-none lg:py-2.5 lg:pr-14 lg:text-[1.125rem]"
      />
      <SearchIcon className="absolute bottom-0 right-3 top-1/2 h-6 w-6 -translate-y-1/2 text-primary lg:right-5 lg:h-7 lg:w-7" />
    </div>
  )
}
