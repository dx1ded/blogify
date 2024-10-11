import { Slot } from "@radix-ui/react-slot"
import { type WithAsChild, cn } from "~/shared/lib"

export function H3({ asChild, className, ...props }: WithAsChild<React.ComponentPropsWithoutRef<"h3">>) {
  const Component = asChild ? Slot : "h3"

  return <Component {...props} className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} />
}
