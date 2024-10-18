import { Slot } from "@radix-ui/react-slot"
import { forwardRef } from "react"
import { type WithAsChild, cn } from "~/shared/lib"

export const TextClassname = cn("leading-7 [&:not(:first-child)]:mt-1")

export const Text = forwardRef<HTMLParagraphElement, WithAsChild<React.ComponentPropsWithoutRef<"p">>>(function Text(
  { asChild, className, ...props },
  ref,
) {
  const Component = asChild ? Slot : "p"

  return <Component ref={ref} {...props} className={cn(TextClassname, className)} />
})
