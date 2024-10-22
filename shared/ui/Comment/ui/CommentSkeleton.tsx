import { Skeleton } from "~/shared/ui-kit/skeleton"

export function CommentSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-lg border pb-4 pl-3 pr-2 pt-3 shadow md:py-4">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="grid flex-1 gap-2.5">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  )
}
