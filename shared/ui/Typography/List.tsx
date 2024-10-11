import { Slot } from "@radix-ui/react-slot"
import { type WithAsChild, cn } from "~/shared/lib"

export function List({ asChild, className, ...props }: WithAsChild<React.ComponentPropsWithoutRef<"ul">>) {
  const Component = asChild ? Slot : "ul"

  return <Component {...props} className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} />
}
