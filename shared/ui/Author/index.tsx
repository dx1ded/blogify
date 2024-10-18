import Image from "next/image"
import { cn } from "~/shared/lib"

interface AuthorProps {
  name: string
  imageUrl: string
  className?: string
  nameVariant?: "white" | "dark"
  size?: "md" | "lg"
}

export function Author({ name, imageUrl, className, nameVariant = "white", size = "md" }: AuthorProps) {
  return (
    <div className={cn("flex items-center", className, size === "md" ? "gap-2.5" : "gap-3")}>
      <Image
        className={cn("rounded-full", size === "md" ? "h-6 w-6" : "h-8 w-8")}
        src={imageUrl}
        alt={name}
        width={24}
        height={24}
      />
      <p className={cn("truncate font-sans font-medium", nameVariant === "white" ? "text-white" : "text-foreground")}>
        {name}
      </p>
    </div>
  )
}
