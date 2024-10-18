import { Slot } from "@radix-ui/react-slot"
import { forwardRef } from "react"
import { type WithAsChild, cn } from "~/shared/lib"

export const H3Classname = cn("scroll-m-20 text-2xl font-semibold tracking-tight")

export const H3 = forwardRef<HTMLHeadingElement, WithAsChild<React.ComponentPropsWithoutRef<"h3">>>(function H3(
  { asChild, className, ...props },
  ref,
) {
  const Component = asChild ? Slot : "h3"

  return <Component ref={ref} {...props} className={cn(H3Classname, className)} />
})
