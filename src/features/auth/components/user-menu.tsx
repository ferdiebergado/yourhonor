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

  const handleSignout = () =>
    signout(undefined, { onSuccess: () => toast.success('Successfully signed out!') });

  // eslint-disable-next-line unicorn/no-null
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            render={
              <Avatar>
                <AvatarImage src={user.picture} alt="user-avatar" />
                <AvatarFallback>
                  <RiUserLine className="size-8" />
                </AvatarFallback>
              </Avatar>
            }
          >
            <span className="sr-only">Toggle user menu</span>
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
