import { Slot } from "@radix-ui/react-slot"
import { type WithAsChild, cn } from "~/shared/lib"

export function Blockquote({
  asChild,
  className,
  ...props
}: WithAsChild<React.ComponentPropsWithoutRef<"blockquote">>) {
  const Component = asChild ? Slot : "blockquote"

  return <Component {...props} className={cn("mt-6 border-l-2 pl-6 italic", className)} />
}
