import Image from "next/image"
import Link from "next/link"
import { H2 } from "~/shared/ui/Typography"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image src="/logo.svg" alt="Blogify" width={36} height={36} />
      <H2 className="pb-0">
        Blog<span className="text-primary">ify</span>
      </H2>
    </Link>
  )
}
