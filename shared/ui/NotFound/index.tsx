"use client"

import { useRouter } from "next/navigation"
import { Button } from "~/shared/ui-kit/button"
import { H1 } from "~/shared/ui/Typography"

export function NotFound() {
  const router = useRouter()

  return (
    <div className="absolute left-0 top-0 -z-10 flex h-screen w-full flex-col items-center justify-center gap-6">
      <H1 className="text-primary">
        <span className="text-black">Not</span> found
      </H1>
      <Button className="font-semibold" onClick={() => router.back()}>
        Go back
      </Button>
    </div>
  )
}
