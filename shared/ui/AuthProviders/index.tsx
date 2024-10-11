import Image from "next/image"
import { Button } from "~/shared/ui-kit/button"

export function AuthProviders({ strategy }: { strategy: "login" | "sign-up" }) {
  const actionText = `Sign ${strategy === "login" ? "in" : "up"}`

  return (
    <div className="grid gap-2">
      <Button variant="outline" size="icon" className="w-full">
        <Image className="mr-2 h-5 w-5" src="/icons8-google.svg" alt="Google" width={20} height={20} />
        {actionText} with Google
      </Button>
      <Button variant="outline" size="icon" className="w-full">
        <Image className="mr-2 h-5 w-5" src="/icons8-facebook.svg" alt="Google" width={20} height={20} />
        {actionText} with Facebook
      </Button>
      <Button variant="outline" size="icon" className="w-full">
        <Image className="mr-2 h-5 w-5" src="/icons8-github.svg" alt="Google" width={20} height={20} />
        {actionText} with Github
      </Button>
    </div>
  )
}
