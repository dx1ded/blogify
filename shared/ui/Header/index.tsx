"use client"

import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Avatar, AvatarImage } from "~/shared/ui-kit/avatar"
import { Button } from "~/shared/ui-kit/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/shared/ui-kit/dropdown-menu"
import { Skeleton } from "~/shared/ui-kit/skeleton"
import { Logo } from "~/shared/ui/Logo"

export function Header() {
  const { data, status } = useSession()

  return (
    <header className="flex items-center justify-between gap-5 py-3 md:py-4">
      <Logo />
      {status === "loading" && <Skeleton className="h-9 w-28 md:w-36" />}
      {status === "unauthenticated" && (
        <Button className="rounded-full" asChild>
          <Link className="sm:text-base md:px-7" href="/login">
            Login
          </Link>
        </Button>
      )}
      {status === "authenticated" && (
        <div className="flex items-center gap-3.5 sm:gap-4">
          <Button className="rounded-full" asChild>
            <Link className="sm:text-base md:px-7" href="/post/create">
              Create
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer sm:h-9 sm:w-9">
                <AvatarImage src={data.user.image} alt="User name" width={32} height={32} />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="font-medium">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="font-medium !text-red-400"
                onClick={() => void signOut({ callbackUrl: "/" })}>
                Sign out
              </DropdownMenuItem>
              <DropdownMenuArrow className="fill-gray-300" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  )
}
