import { Slot } from "@radix-ui/react-slot"
import { type WithAsChild, cn } from "~/shared/lib"

export function H4({ asChild, className, ...props }: WithAsChild<React.ComponentPropsWithoutRef<"h4">>) {
  const Component = asChild ? Slot : "h4"

  return <Component {...props} className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)} />
}
