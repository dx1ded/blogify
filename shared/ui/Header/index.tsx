import Link from "next/link"
import { Avatar, AvatarImage } from "~/shared/ui-kit/avatar"
import { Button } from "~/shared/ui-kit/button"
import { Logo } from "~/shared/ui/Logo"

export async function Header() {
  return (
    <header className="flex items-center justify-between gap-5 py-3 md:py-4">
      <Logo />
      <div className="flex items-center gap-3.5 sm:gap-4">
        <Button className="rounded-full" asChild>
          <Link className="sm:text-base md:px-7" href="/post/create">
            Create
          </Link>
        </Button>
        <Link href="/profile">
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
            <AvatarImage src="/logo.svg" alt="User name" width={32} height={32} />
          </Avatar>
        </Link>
      </div>
    </header>
  )
}
