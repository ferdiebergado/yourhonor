import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ActivitySkeletonCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-30" />
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Skeleton className="h-5 w-15" />
            <Skeleton className="h-5 w-15" />
          </div>

          <div>
            <Skeleton className="h-8 w-34" />
            <Skeleton className="h-6 w-10" />
          </div>

          <div>
            <Skeleton className="h-8 w-34" />
            <Skeleton className="h-6 w-10" />
          </div>

          <div>
            <Skeleton className="h-8 w-34" />
            <Skeleton className="h-6 w-10" />
          </div>

          <div>
            <Skeleton className="h-8 w-34" />
            <Skeleton className="h-6 w-10" />
          </div>

          <div>
            <Skeleton className="h-8 w-34" />
            <Skeleton className="h-6 w-10" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
