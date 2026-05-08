import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';

const ItemSkeleton = () => (
  <Item>
    <ItemContent className="space-y-1">
      <Skeleton className="h-5 w-30" />
      <Skeleton className="h-5 w-60" />
    </ItemContent>
  </Item>
);

export default function ActivitySkeletonCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-5 w-28" />
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }, (_, i) => (
            <ItemSkeleton key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
