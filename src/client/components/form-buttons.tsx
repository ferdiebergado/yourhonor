import { type FieldValues, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { Button } from './ui/button';

type SubmitButtonProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  title?: string;
  isPending: boolean;
  isPendingText?: string;
  onClose?: () => void;
};

export default function FormButtons<T extends FieldValues>({
  form,
  onSubmit,
  title = 'Submit',
  isPending,
  isPendingText = 'Please wait...',
  onClose,
}: SubmitButtonProps<T>) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between space-x-2">
      <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
        {isPending ? isPendingText : title}
      </Button>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isPending}>
          Reset
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => (onClose ? onClose() : navigate(-1))}
          disabled={isPending}
        >
          Close
        </Button>
      </div>
    </div>
  );
}
