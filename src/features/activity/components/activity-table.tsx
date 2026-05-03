import { DataTable } from '@/components/data-table';
import SortButton from '@/components/sort-button';
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
import { RiMore2Fill } from '@remixicon/react';
import type { ActivityDetail } from '@shared/schemas/activity';
import type { ColumnDef } from '@tanstack/react-table';
import { useDetailedActivities } from '../hooks';

const columns: ColumnDef<ActivityDetail>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => <SortButton column={column}>Title</SortButton>,
  },
  {
    accessorKey: 'venue',
    header: ({ column }) => <SortButton column={column}>Venue</SortButton>,
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => <SortButton column={column}>Start Date</SortButton>,
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => <SortButton column={column}>End Date</SortButton>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const activity = row.original;

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
                Copy activity title
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View activity details</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function ActivityTable() {
  const { data } = useDetailedActivities();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data ?? []} filteredColumn="title" />
    </div>
  );
}
