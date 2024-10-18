"use client"

import Link from "next/link"
import { Button } from "~/shared/ui-kit/button"
import { H1 } from "~/shared/ui/Typography"

export default function Error() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8">
      <H1 className="text-primary">
        <span className="text-black">Not</span> found
      </H1>
      <Button asChild>
        <Link className="font-medium" href="/">
          Go back
        </Link>
      </Button>
    </div>
  )
}
