"use client"

import { SearchIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export function Search() {
  const router = useRouter()
  const pathname = usePathname()

  const changeHandler = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    if (!value) {
      // Deleting the previous `?search=` query param
      router.push(pathname)
    } else {
      router.push(`${pathname}?search=${value}`)
    }
  }, 1000)

  return (
    <div className="relative mx-auto w-full max-w-[38.25rem]">
      <input
        placeholder="Search ..."
        className="w-full rounded-3xl border-2 border-primary bg-[#F4F4F5] p-2 pl-5 pr-10 font-serif text-sm font-medium outline-none placeholder:text-[#A1A1AA] md:text-base lg:py-2.5 lg:pr-14 lg:text-[1.125rem]"
        onChange={changeHandler}
      />
      <SearchIcon className="absolute bottom-0 right-3 top-1/2 h-6 w-6 -translate-y-1/2 text-primary lg:right-5 lg:h-7 lg:w-7" />
    </div>
  )
}
