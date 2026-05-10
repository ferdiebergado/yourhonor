import { type FieldValues, type UseFormReturn } from 'react-hook-form';
import { Button } from './ui/button';
import { Field } from './ui/field';

type SubmitButtonProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  isPending: boolean;
  onSubmit: (values: T) => void;
  title?: string;
  isPendingText?: string;
};

export default function SubmitButton<T extends FieldValues>({
  form,
  isPending,
  onSubmit,
  title = 'Submit',
  isPendingText = 'Please wait...',
}: SubmitButtonProps<T>) {
  return (
    <Field>
      <Button
        type="button"
        className="w-full"
        onClick={form.handleSubmit(onSubmit)}
        disabled={isPending}
      >
        {isPending ? isPendingText : title}
      </Button>
    </Field>
  );
}
