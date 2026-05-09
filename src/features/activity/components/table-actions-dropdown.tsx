import { Link } from 'react-router';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RiDeleteBinLine, RiFileCopyLine, RiInformationLine, RiMore2Fill } from '@remixicon/react';
import type { ActivityDetail } from '@shared/schemas/activity';

type TableActionsDropdownProps = {
  activity: ActivityDetail;
};

export default function TableActionsDropdown({ activity }: TableActionsDropdownProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(activity.title);
    toast.info('Copied activity title.');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <RiMore2Fill className="size-4" />
          </Button>
        }
      />

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleCopy}>
            <RiFileCopyLine data-icon="inline-start" /> Copy title
          </DropdownMenuItem>
          <DropdownMenuItem
            render={
              <Link to={`/activity/${activity.code}`}>
                <RiInformationLine data-icon="inline-start" /> View details
              </Link>
            }
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <RiDeleteBinLine data-icon="inline-start" /> Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
