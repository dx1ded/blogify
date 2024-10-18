import { Skeleton } from "~/shared/ui-kit/skeleton"

export function PostSkeleton() {
  return (
    <div className="grid gap-4 md:gap-6">
      <div className="flex gap-2">
        <Skeleton className="h-7 w-14 md:h-8 md:w-20" />
        <Skeleton className="h-7 w-14 md:h-8 md:w-20" />
      </div>
      <Skeleton className="h-10 w-full md:h-14 lg:h-16" />
      <div className="mb-2 flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-32 w-full rounded-xl md:h-44" />
      <Skeleton className="h-80 w-full rounded-xl md:h-96" />
    </div>
  )
}
