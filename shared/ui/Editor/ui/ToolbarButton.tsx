import type { LucideIcon } from "lucide-react"
import { type MouseEvent, forwardRef } from "react"
import { cn } from "~/shared/lib"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"

interface ToolbarButtonProps {
  name: string
  isActive: boolean
  Icon: LucideIcon
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(function ToolbarButton(
  { name, isActive, Icon, onClick },
  ref,
) {
  const clickHandler = (e: MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={ref}
          type="button"
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded p-0.5 transition-colors duration-100 hover:bg-gray-100",
            isActive && "bg-gray-200",
          )}
          onClick={clickHandler}>
          <Icon className="h-full w-full" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  )
})
