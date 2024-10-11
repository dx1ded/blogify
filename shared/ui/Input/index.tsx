import { Slot } from "@radix-ui/react-slot"
import { type WithAsChild, cn } from "~/shared/lib"

export function Input({ asChild, className, ...props }: WithAsChild<React.ComponentPropsWithoutRef<"input">>) {
  const Component = asChild ? Slot : "input"

  return (
    <Component
      {...props}
      className={cn(
        "rounded-[4px] bg-[#F4F4F5] p-2 font-mono text-sm placeholder:text-[#A1A1AA] md:text-base",
        className,
      )}
    />
  )
}
