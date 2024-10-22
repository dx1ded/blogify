"use client"

import { EllipsisVerticalIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { startTransition } from "react"
import { toast } from "sonner"
import { removePost } from "~/server-actions/post"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/shared/ui-kit/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/shared/ui-kit/dropdown-menu"
import { Author } from "~/shared/ui/Author"
import { Tag } from "~/shared/ui/Tag"
import { H4 } from "~/shared/ui/Typography"
import { normalizeTimestamp, type Post } from "~/shared/lib"

interface PostCardProps extends Omit<Post, "likedBy" | "comments"> {
  onRemove?: (postId: string) => void
  removeOptimistic?: (postId: string) => void
  withControls?: boolean
}

export function PostCard({
  id,
  slug,
  title,
  tags,
  thumbnailUrl,
  createdAt,
  author,
  onRemove,
  removeOptimistic,
  withControls = false,
}: PostCardProps) {
  const router = useRouter()

  const remove = async () => {
    try {
      if (removeOptimistic) removeOptimistic(id)
      await removePost(id)
      if (onRemove) onRemove(id)
      toast.success("Post has been successfully removed", { position: "top-right" })
    } catch (e) {
      toast.error((e as Error).message, { position: "top-right" })
    }
  }

  return (
    <Link className="min-w-0 rounded-lg border border-[#E8E8EA] p-3.5 shadow" href={`/post/${slug}`}>
      <Image
        src={thumbnailUrl}
        className="mb-4 h-[12rem] w-full rounded-lg object-cover"
        alt={title}
        width={200}
        height={200}
      />
      <div className="mb-2 flex items-center justify-between">
        <Tag name={tags[0]} variant="secondary" className="inline-block rounded-lg" />
        {withControls ? (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex h-4 w-4 items-center justify-center text-grayish">
                  <EllipsisVerticalIcon className="h-full w-full" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem className="font-medium" onClick={() => router.push(`/post/edit/${id}`)}>
                  Edit
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="font-medium text-red-500 focus:text-red-500">Delete</DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your post and remove its data from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => startTransition(remove)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>
      <H4 className="mb-5 truncate">{title}</H4>
      <div className="flex items-center justify-between gap-2">
        <Author name={author.name} imageUrl={author.image} nameVariant="dark" />
        <p className="text-nowrap font-sans text-grayish">{normalizeTimestamp(createdAt)}</p>
      </div>
    </Link>
  )
}
