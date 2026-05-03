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
import ActivityForm from './activity-form';
import ActivityTable from './activity-table';

export default function Activities() {
  return (
    <>
      <div className="flex items-center justify-between gap-5 p-5">
        <div>
          <h1 className="font-heading text-2xl font-semibold">My Activities</h1>
          <p className="text-muted-foreground">View, create and update your activities</p>
        </div>
        <Dialog>
          <DialogTrigger
            render={
              <Button size="lg">
                <RiAddCircleFill data-icon="inline-start" /> New Activity
              </Button>
            }
          />
          <DialogContent className="bg-secondary">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">New Activity</DialogTitle>
              <DialogDescription>
                Create a new activity by filling out the form below.
              </DialogDescription>
            </DialogHeader>
            <ActivityForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="w-full">
        <CardContent>
          <Suspense fallback={<p>Loading...</p>}>
            <ActivityTable />
          </Suspense>
        </CardContent>
      </Card>
    </>
  );
}
