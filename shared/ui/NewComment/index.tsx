"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { SendIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
import { commentSchema } from "~/schemas/comment-schema"
import { createComment } from "~/server-actions/comment"
import { cn, type Comment } from "~/shared/lib"
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/shared/ui-kit/form"
import { Skeleton } from "~/shared/ui-kit/skeleton"

interface NewCommentProps {
  size?: "md" | "lg"
  className?: string
  parentCommentId?: number
  postHandler?: () => void
  postId: string
  onAdd?: (comment: Comment) => void
}

const newCommentSchema = commentSchema.pick({ text: true })

export function NewComment({ postId, className, parentCommentId, postHandler, onAdd, size = "lg" }: NewCommentProps) {
  const { data, status } = useSession()
  const form = useForm<z.output<typeof newCommentSchema>>({
    resolver: zodResolver(newCommentSchema),
    defaultValues: {
      text: "",
    },
  })

  const submitHandler: SubmitHandler<z.output<typeof newCommentSchema>> = async ({ text }) => {
    if (!data?.user.id) return

    try {
      const comment = await createComment({
        text,
        postId,
        authorId: data.user.id,
        parentCommentId,
      })

      if (!comment) return

      if (onAdd) onAdd({ ...comment, likeCount: 0, isLiked: false, subcomments: [] })
      if (postHandler) postHandler()

      form.reset()
    } catch (e) {
      toast.error((e as Error).message, { position: "top-right" })
    }
  }

  if (status === "loading") return <Skeleton className="h-20 w-full" />

  return data?.user ? (
    <Form {...form}>
      <form
        className={cn("flex gap-2", size === "md" ? "items-center" : "items-end", className)}
        onSubmit={form.handleSubmit(submitHandler)}>
        <FormField
          name="text"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <textarea
                  className={cn(
                    "block w-full resize-none rounded-md border border-input text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    size === "md"
                      ? "h-10 px-3 py-2 shadow-sm sm:h-14 sm:p-3 lg:h-16"
                      : "h-20 p-3 shadow md:text-base lg:p-4",
                  )}
                  placeholder="Write a comment ..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          type="submit"
          className={cn(
            "flex flex-shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50",
            size === "md" ? "h-8 w-8 md:h-9 md:w-9" : "h-9 w-9",
          )}
          disabled={form.formState.isSubmitting}>
          <SendIcon className="h-1/2 w-1/2" />
        </button>
      </form>
    </Form>
  ) : (
    <Link href="/login" className="inline-block font-medium text-blue-400">
      Login to comment
    </Link>
  )
}
