import { Slot } from "@radix-ui/react-slot"
import { forwardRef } from "react"
import { type WithAsChild, cn } from "~/shared/lib"

export const H4Classname = cn("scroll-m-20 text-xl font-semibold tracking-tight")

export const H4 = forwardRef<HTMLHeadingElement, WithAsChild<React.ComponentPropsWithoutRef<"h4">>>(function H4(
  { asChild, className, ...props },
  ref,
) {
  const Component = asChild ? Slot : "h4"

  return <Component ref={ref} {...props} className={cn(H4Classname, className)} />
})
