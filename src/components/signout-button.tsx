import { RiLoader2Line } from '@remixicon/react';
import { toast } from 'sonner';

import { useSignout } from '@/features/auth/hooks';
import { Button } from './ui/button';

export default function SignoutButton() {
  const { isPending, mutate: signout } = useSignout();

  const handleSignout = () =>
    signout(undefined, { onSuccess: () => toast.success('Successfully signed out!') });

  return (
    <Button variant="ghost" onClick={handleSignout} disabled={isPending}>
      {isPending ? (
        <>
          <RiLoader2Line className="animate-spin" data-icon="inline-start" />
          Signing out...
        </>
      ) : (
        <>Sign Out</>
      )}
    </Button>
  );
}
