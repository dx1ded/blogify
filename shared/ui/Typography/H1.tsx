import { Slot } from "@radix-ui/react-slot"
import { forwardRef } from "react"
import { type WithAsChild, cn } from "~/shared/lib"

export const H1Classname = cn("scroll-m-20 text-4xl font-extrabold tracking-tight")

export const H1 = forwardRef<HTMLHeadingElement, WithAsChild<React.ComponentPropsWithoutRef<"h1">>>(function H1(
  { asChild, className, ...props },
  ref,
) {
  const Component = asChild ? Slot : "h1"

  return <Component ref={ref} {...props} className={cn(H1Classname, "lg:text-5xl", className)} />
})
