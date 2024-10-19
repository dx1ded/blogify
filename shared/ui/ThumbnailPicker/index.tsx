import Image from "next/image"
import { FileIcon } from "lucide-react"
import { forwardRef, useState } from "react"
import { toast } from "sonner"
import { cn, fileToDataURL, mb } from "~/shared/lib"
import { H4 } from "~/shared/ui/Typography"

interface ThumbnailPickerProps extends Omit<React.ComponentPropsWithoutRef<"input">, "onChange" | "defaultValue"> {
  defaultValue?: string
  onChange(file: File): void
}

export const ThumbnailPicker = forwardRef<HTMLInputElement, ThumbnailPickerProps>(function ThumbnailPicker(
  { className, defaultValue, onChange, ...props },
  ref,
) {
  const [dataUrl, setDataUrl] = useState<string | null>(defaultValue || null)

  const changeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.[0]) return

    try {
      const file = files[0]
      if (file.size > mb(2)) throw new Error("File cannot be larger than 2 MB")

      const dataUrl = await fileToDataURL(file)

      setDataUrl(dataUrl)
      if (onChange) onChange(file)
    } catch (e) {
      toast.error((e as Error).message, { position: "top-right" })
    }
  }

  return (
    <div className="relative h-64 max-w-96 rounded-md border border-dashed bg-white">
      {Boolean(dataUrl) && (
        <Image
          src={dataUrl as string}
          className="absolute left-0 right-0 h-full w-full rounded-md object-cover"
          alt="Thumbnail"
          width={384}
          height={384}
        />
      )}
      <label
        className="absolute left-0 top-0 z-10 flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-md bg-[rgba(0,0,0,0.07)] underline"
        htmlFor="thumbnail-file">
        <FileIcon className="mx-auto mb-2 h-16 w-16" />
        <H4 asChild>
          <span>Choose file</span>
        </H4>
      </label>
      <input
        {...props}
        ref={ref}
        className={cn("sr-only", className)}
        type="file"
        id="thumbnail-file"
        accept="image/*"
        onChange={changeHandler}
      />
    </div>
  )
})
