import { cn } from "~/shared/lib"

interface TagProps {
  name: string
  variant?: "primary" | "secondary"
  className?: string
}

export function Tag({ name, className, variant = "primary" }: TagProps) {
  return (
    <span
      className={cn(
        "rounded px-2.5 py-1 text-sm font-semibold md:rounded-lg md:text-base",
        variant === "primary" ? "bg-primary text-white" : "bg-[rgba(75,107,251,0.05)] text-primary",
        className,
      )}>
      {name}
    </span>
  )
}
