import { cn } from "~/shared/lib"

export function Container({ children, className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div {...props} className={cn("mx-auto max-w-[80rem] px-4 md:px-5", className)}>
      {children}
    </div>
  )
}
