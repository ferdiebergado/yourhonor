import { RiAddLargeLine } from '@remixicon/react';
import type { ComponentProps } from 'react';
import { Button } from './ui/button';

export default function AddButton(props: ComponentProps<'button'>) {
  return (
    <Button variant="ghost" size="icon" className="size-8" {...props}>
      <RiAddLargeLine />
    </Button>
  );
}
