import { ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { cn, fileToDataURL, mb } from "~/shared/lib"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/shared/ui-kit/tooltip"
import { useEditorContext } from "../model/context"

export function ImageButton() {
  const editor = useEditorContext()

  const isActive = Boolean(editor?.isActive("image"))

  const changeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!editor || !files?.[0]) return

    try {
      const file = files[0]
      if (file.size > mb(2)) throw new Error("File cannot be larger than 2 MB")

      const dataUrl = await fileToDataURL(file)

      editor.chain().focus().setImage({ src: dataUrl }).run()
    } catch (e) {
      toast.error((e as Error).message, { position: "top-right" })
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <label
            htmlFor="image-upload"
            className={cn(
              "flex h-5 w-5 cursor-pointer items-center justify-center rounded p-0.5 transition-colors duration-100 hover:bg-gray-100",
              isActive && "bg-gray-200",
            )}>
            <ImageIcon className="h-full w-full" />
          </label>
          <input type="file" className="sr-only" id="image-upload" accept="image/*" onChange={changeHandler} />
        </div>
      </TooltipTrigger>
      <TooltipContent>Image</TooltipContent>
    </Tooltip>
  )
}
