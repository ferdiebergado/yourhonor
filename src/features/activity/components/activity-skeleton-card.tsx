import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';

const ItemSkeleton = () => (
  <Item className="p-0">
    <ItemContent>
      <Skeleton className="h-5 w-30" />
      <Skeleton className="h-5 w-60" />
    </ItemContent>
  </Item>
);

export default function ActivitySkeletonCard() {
  return (
    <div className="space-y-7">
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-5 w-60" />
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }, (_, i) => (
              <ItemSkeleton key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-42" />
            <Skeleton className="h-10 w-22" />
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-34" />
            <Skeleton className="h-10 w-38" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-36" />
          </div>
          <Skeleton className="h-7 w-32" />
        </CardContent>
      </Card>
    </div>
  );
}
