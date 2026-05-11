import { Skeleton } from './ui/skeleton';

export default function SkeletonDatatable() {
  return (
    <>
      <div className="flex items-center justify-between py-4">
        <div>
          <Skeleton className="h-9 w-95.75" />
        </div>
        <div>
          <Skeleton className="h-9 w-47" />
        </div>
      </div>
      <div>
        <div>
          <Skeleton className="h-28.5 w-full" />
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div>
            <Skeleton className="h-8 w-28" />
          </div>
          <div className="flex gap-7">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="size-8" />
              <Skeleton className="size-8" />
              <Skeleton className="size-8" />
              <Skeleton className="size-8" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
