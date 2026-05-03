import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RiAddCircleFill } from '@remixicon/react';
import { Suspense } from 'react';
import { useParams } from 'react-router';
import Activity from './activity';

export default function ActivityPage() {
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between gap-5 px-7 py-5">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Activity Details</h1>
          <p className="text-muted-foreground">View and update your activity</p>
        </div>
        <Dialog>
          <DialogTrigger
            render={
              <Button size="lg">
                <RiAddCircleFill data-icon="inline-start" /> Add Honorarium
              </Button>
            }
          />
          <DialogContent className="bg-secondary">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">New Honorarium</DialogTitle>
              <DialogDescription>
                Add a new honorarium by filling out the form below.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="w-full">
        <CardContent>
          <Suspense fallback={<p>Loading...</p>}>
            <Activity id={Number(params.id)} />
          </Suspense>
        </CardContent>
      </Card>
    </>
  );
}
