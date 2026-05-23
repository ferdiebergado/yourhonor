import type { ReactElement } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { ActivityFormValues } from '@shared/schemas/activity';
import ActivityForm from './activity-form';

type ActivityDialogProps<T extends FieldValues = ActivityFormValues> = {
  title: string;
  description: string;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  trigger: ReactElement;
  isPending: boolean;
};

export default function ActivityDialog({
  title,
  description,
  form,
  trigger,
  isPending,
  onSubmit,
}: ActivityDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="bg-secondary">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ActivityForm form={form} onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
