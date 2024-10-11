import { Slot } from "@radix-ui/react-slot"
import { type WithAsChild, cn } from "~/shared/lib"

export function H1({ asChild, className, ...props }: WithAsChild<React.ComponentPropsWithoutRef<"h1">>) {
  const Component = asChild ? Slot : "h1"

  return (
    <Component {...props} className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)} />
  )
}
