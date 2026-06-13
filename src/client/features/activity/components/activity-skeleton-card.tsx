import { Card, CardAction, CardContent, CardFooter, CardHeader } from '@client/components/ui/card';
import { Item, ItemContent, ItemMedia } from '@client/components/ui/item';
import { Skeleton } from '@client/components/ui/skeleton';

const ItemSkeleton = () => (
  <Item className="p-0">
    <ItemMedia variant="icon">
      <Skeleton className="size-5" />
    </ItemMedia>
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
          <CardAction>
            <Skeleton className="size-10" />
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }, (_, i) => (
              <ItemSkeleton key={`item-${i}`} />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-5 w-36" />
          <CardAction>
            <Skeleton className="h-10 w-41" />
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            {['w-42', 'w-22', 'w-36', 'w-34', 'w-38', 'w-24', 'w-36'].map((width, i) => (
              <Skeleton key={`content-${i}`} className={`h-10 ${width}`} />
            ))}
          </div>
          <Skeleton className="h-7 w-32" />
        </CardContent>
        <CardFooter className="flex justify-center">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={`footer-${i}`} className="h-9 w-35" />
          ))}
        </CardFooter>
      </Card>
    </div>
  );
}
