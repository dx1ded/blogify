import { Slot } from "@radix-ui/react-slot"
import { type WithAsChild, cn } from "~/shared/lib"

export function Text({ asChild, className, ...props }: WithAsChild<React.ComponentPropsWithoutRef<"p">>) {
  const Component = asChild ? Slot : "p"

  return <Component {...props} className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} />
}
