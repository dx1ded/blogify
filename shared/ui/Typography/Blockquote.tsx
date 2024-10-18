import { Slot } from "@radix-ui/react-slot"
import { type WithAsChild, cn } from "~/shared/lib"

export const BlockquoteClassname = "mt-6 border-l-2 pl-6 italic"

export function Blockquote({
  asChild,
  className,
  ...props
}: WithAsChild<React.ComponentPropsWithoutRef<"blockquote">>) {
  const Component = asChild ? Slot : "blockquote"

  return <Component {...props} className={cn(BlockquoteClassname, className)} />
}
