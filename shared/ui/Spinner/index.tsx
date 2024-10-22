import "./index.css"
import { cn } from "~/shared/lib"

export function Spinner({ className }: { className?: string }) {
  return <div className={cn("spinner", className)} />
}
