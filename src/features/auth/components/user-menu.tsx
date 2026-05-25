import { RiLoader2Line, RiLogoutCircleLine, RiUserLine } from '@remixicon/react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMe, useSignout } from '../hooks';

export default function UserMenu() {
  const { data: user } = useMe();
  const { isPending, mutate: signout } = useSignout();

  const handleSignout = () => signout(undefined, { onSuccess: () => toast.info('Signed out.') });

  // eslint-disable-next-line unicorn/no-null
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="rounded-full">
            <span className="sr-only">Toggle user menu</span>
            <Avatar>
              <AvatarImage src={user.picture} alt="user-avatar" />
              <AvatarFallback>
                <RiUserLine className="size-6" />
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSignout}>
          {isPending ? (
            <>
              <RiLoader2Line className="animate-spin" data-icon="inline-start" />
              Signing out...
            </>
          ) : (
            <>
              <RiLogoutCircleLine data-icon="inline-start" /> Sign Out
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
