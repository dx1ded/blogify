import { Slot } from "@radix-ui/react-slot"
import { forwardRef } from "react"
import { type WithAsChild, cn } from "~/shared/lib"

export const H2Classname = cn("scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0")

export const H2 = forwardRef<HTMLHeadingElement, WithAsChild<React.ComponentPropsWithoutRef<"h2">>>(function H2(
  { asChild, className, ...props },
  ref,
) {
  const Component = asChild ? Slot : "h2"

  return <Component ref={ref} {...props} className={cn(H2Classname, "text-2xl md:text-3xl", className)} />
})
