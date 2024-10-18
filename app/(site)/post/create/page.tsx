"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type Tag, TagInput } from "emblor"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
import { postSchema } from "~/schemas/post-schema"
import { createPost } from "~/server-actions/post"
import { Button } from "~/shared/ui-kit/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/shared/ui-kit/form"
import { Input } from "~/shared/ui-kit/input"
import { Editor } from "~/shared/ui/Editor"
import { ThumbnailPicker } from "~/shared/ui/ThumbnailPicker"
import { H1 } from "~/shared/ui/Typography"

export default function CreatePost() {
  const form = useForm<z.output<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      thumbnail: undefined,
    },
  })
  const [tags, setTags] = useState<Tag[]>([])
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)

  const submitHandler: SubmitHandler<z.output<typeof postSchema>> = async (data) => {
    const formData = new FormData()

    formData.set("title", data.title)
    formData.set("content", data.content)
    // Using `.join` for `tags` because FormData doesn't allow to transport objects
    formData.set("tags", data.tags.join())
    formData.set("thumbnail", data.thumbnail)

    try {
      await createPost(formData)
    } catch (e) {
      toast.error((e as Error).message, { position: "top-right" })
    }
  }

  return (
    <div>
      <H1 className="mb-6">Create Post</H1>
      <Form {...form}>
        <form className="flex flex-col items-start gap-5" onSubmit={form.handleSubmit(submitHandler)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="text"
                    className="h-auto px-4 py-2.5 text-xl font-medium"
                    placeholder="Enter title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Editor {...field} onUpdate={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <TagInput
                    {...field}
                    placeholder="Tag"
                    tags={tags}
                    setTags={(tags) => {
                      setTags(tags)
                      form.setValue(
                        "tags",
                        (tags as Tag[]).map((tag) => tag.text),
                      )
                    }}
                    activeTagIndex={activeTagIndex}
                    setActiveTagIndex={setActiveTagIndex}
                    styleClasses={{
                      input: "shadow-none",
                      inlineTagsContainer: "gap-1 rounded-full border-none shadow",
                      tag: {
                        body: "bg-primary text-primary-foreground rounded-full hover:bg-primary hover:text-primary-foreground",
                        closeButton: "hover:text-primary-foreground",
                      },
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <ThumbnailPicker {...field} value="" onChange={(file) => form.setValue("thumbnail", file)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mt-2 w-full md:h-10 md:w-auto md:rounded-full md:px-8 md:text-base"
            disabled={form.formState.isSubmitting}>
            Post it
          </Button>
        </form>
      </Form>
    </div>
  )
}
