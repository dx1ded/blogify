import { Slot } from "@radix-ui/react-slot"
import { type WithAsChild, cn } from "~/shared/lib"

export function H2({ asChild, className, ...props }: WithAsChild<React.ComponentPropsWithoutRef<"h2">>) {
  const Component = asChild ? Slot : "h2"

  return (
    <Component
      {...props}
      className={cn("scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0 md:text-3xl", className)}
    />
  )
}
