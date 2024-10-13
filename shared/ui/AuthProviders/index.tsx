"use client"

import type { BuiltInProviderType } from "next-auth/providers/index"
import { signIn } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "~/shared/ui-kit/button"

export function AuthProviders({ strategy }: { strategy: "login" | "register" }) {
  const router = useRouter()
  const actionText = `Sign ${strategy === "login" ? "in" : "up"}`

  const clickHandler = async (provider: BuiltInProviderType) => {
    const response = await signIn(provider, { redirect: false, callbackUrl: "/" })
    console.log(response)
    if (!response) return

    if (!response.error && response.ok) {
      router.push("/")
      return
    }

    toast.error(response.error, { position: "top-right" })
  }

  return (
    <div className="grid gap-2">
      <Button variant="outline" size="icon" className="w-full" onClick={() => clickHandler("google")}>
        <Image className="mr-2 h-5 w-5" src="/icons8-google.svg" alt="Google" width={20} height={20} />
        {actionText} with Google
      </Button>
      <Button variant="outline" size="icon" className="w-full" onClick={() => clickHandler("facebook")}>
        <Image className="mr-2 h-5 w-5" src="/icons8-facebook.svg" alt="Google" width={20} height={20} />
        {actionText} with Facebook
      </Button>
      <Button variant="outline" size="icon" className="w-full" onClick={() => clickHandler("github")}>
        <Image className="mr-2 h-5 w-5" src="/icons8-github.svg" alt="Google" width={20} height={20} />
        {actionText} with Github
      </Button>
    </div>
  )
}
