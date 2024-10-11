import Image from "next/image"
import { cn } from "~/shared/lib"

interface AuthorProps {
  name: string
  imageUrl: string
  nameVariant?: "white" | "dark"
}

export function Author({ name, imageUrl, nameVariant = "white" }: AuthorProps) {
  return (
    <div className="flex items-center gap-2.5">
      <Image className="h-6 w-6 rounded-full" src={imageUrl} alt={name} width={24} height={24} />
      <p className={cn("truncate font-sans font-medium", nameVariant === "white" ? "text-white" : "text-foreground")}>
        {name}
      </p>
    </div>
  )
}
