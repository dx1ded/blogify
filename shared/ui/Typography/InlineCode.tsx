import { Slot } from "@radix-ui/react-slot"
import { type WithAsChild, cn } from "~/shared/lib"

export function InlineCode({ asChild, className, ...props }: WithAsChild<React.ComponentPropsWithoutRef<"code">>) {
  const Component = asChild ? Slot : "code"

  return (
    <Component
      {...props}
      className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold", className)}
    />
  )
}
