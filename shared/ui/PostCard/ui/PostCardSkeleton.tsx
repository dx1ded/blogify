import { Skeleton } from "~/shared/ui-kit/skeleton"

export function PostCardSkeleton() {
  return (
    <div className="rounded-lg border border-[#E8E8EA] p-3.5 shadow">
      <Skeleton className="mb-4 h-[12rem] w-full rounded-lg" />
      <Skeleton className="mb-2 h-7 w-14 rounded-lg" />
      <Skeleton className="mb-5 h-7 w-full" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
  )
}
