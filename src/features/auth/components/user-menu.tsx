import { RiUserLine } from '@remixicon/react';

import SignoutButton from '@/components/signout-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMe } from '../hooks';

export default function UserMenu() {
  const { data: user } = useMe();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-lg"
            render={
              <Avatar>
                <AvatarImage src={user?.picture} alt="user-avatar"></AvatarImage>
                <AvatarFallback>
                  <RiUserLine className="size-8" />
                </AvatarFallback>
              </Avatar>
            }
          >
            <span className="sr-only">User menu</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <SignoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
