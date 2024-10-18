import { zodResolver } from "@hookform/resolvers/zod"
import { useCurrentEditor } from "@tiptap/react"
import { LinkIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "~/shared/ui-kit/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui-kit/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/shared/ui-kit/form"
import { Input } from "~/shared/ui-kit/input"
import { ToolbarButton } from "./ToolbarButton"

const linkSchema = z.object({
  url: z.string().url("Enter a correct url"),
})

export function LinkButton() {
  const { editor } = useCurrentEditor()
  const [open, setIsOpen] = useState(false)
  const form = useForm<z.output<typeof linkSchema>>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      url: "",
    },
  })

  const isActive = Boolean(editor?.isActive("link"))

  const submitHandler = (data: z.output<typeof linkSchema>) => {
    editor?.chain().focus().toggleLink({ href: data.url }).run()
    setIsOpen(false)
  }

  const toggleLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Preventing default <DialogTrigger> behaviour
    e.preventDefault()
    if (isActive) {
      editor?.chain().focus().unsetLink().run()
      return
    }

    setIsOpen(true)
  }

  const onSubmit = (e: React.FormEvent) => {
    // Fixing page reload
    e.preventDefault()
    // Fixing propagating validation for forms above
    e.stopPropagation()
    // Submitting with react-hook-form
    form.handleSubmit(submitHandler)()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setIsOpen(value)
      }}>
      <DialogTrigger asChild>
        <ToolbarButton name="Link" isActive={isActive} Icon={LinkIcon} onClick={toggleLink} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter URL for the link</DialogTitle>
          <DialogDescription hidden>
            In this window, set the link url which is going to be used when a person click on the selected area
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form className="flex gap-2" onSubmit={onSubmit}>
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="http:// or https://" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="basis-24">
                Apply
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
