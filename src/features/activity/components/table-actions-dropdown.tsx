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
import { Link } from 'react-router';

type TableActionsDropdownProps = {
  activity: ActivityDetail;
};

export default function TableActionsDropdown({ activity }: TableActionsDropdownProps) {
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(activity.title)}>
            <RiFileCopyLine data-icon="inline-start" /> Copy activity title
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            render={
              <Link to={`/activity/${activity.code}`}>
                <RiInformationLine data-icon="inline-start" /> View activity details
              </Link>
            }
          />
          <DropdownMenuItem className="text-destructive">
            <RiDeleteBinLine data-icon="inline-start" /> Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
