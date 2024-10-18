import { Slot } from "@radix-ui/react-slot"
import { type WithAsChild, cn } from "~/shared/lib"

export const BulletListClassname = cn("my-6 ml-6 list-disc [&>li]:mt-2")

export function BulletList({ asChild, className, ...props }: WithAsChild<React.ComponentPropsWithoutRef<"ul">>) {
  const Component = asChild ? Slot : "ul"

  return <Component {...props} className={cn(BulletListClassname, className)} />
}

export const OrderedListClassname = cn("my-6 ml-6 list-decimal [&>li]:mt-2")

export function OrderedList({ asChild, className, ...props }: WithAsChild<React.ComponentPropsWithoutRef<"ol">>) {
  const Component = asChild ? Slot : "ol"

  return <Component {...props} className={cn(OrderedListClassname, className)} />
}
