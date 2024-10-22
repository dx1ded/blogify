import { CommentSkeleton } from "~/shared/ui/Comment"

export function CommentListSkeleton() {
  return (
    <div className="grid gap-4 md:gap-6">
      <CommentSkeleton />
      <CommentSkeleton />
      <CommentSkeleton />
    </div>
  )
}
