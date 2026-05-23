import { RiInformationLine } from '@remixicon/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Link, useNavigate } from 'react-router';

import { DataTable } from '@/components/data-table';
import SortButton from '@/components/sort-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { ActivityDetail } from '@shared/schemas/activity';
import { useActivities } from '../hooks';

const columns: ColumnDef<ActivityDetail>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => <SortButton column={column}>Title</SortButton>,
    cell: ({ row }) => <div className="line-clamp-2 text-pretty">{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'venue',
    header: ({ column }) => <SortButton column={column}>Venue</SortButton>,
    cell: ({ row }) => <div className="text-pretty">{row.getValue('venue')}</div>,
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
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger
          render={
            <Link to={`/activity/${encodeURIComponent(row.original.code)}`}>
              <RiInformationLine className="size-5" data-icon="inline-start" />
            </Link>
          }
        />
        <TooltipContent>View activity details</TooltipContent>
      </Tooltip>
    ),
  },
];

export default function ActivityTable() {
  const { data } = useActivities();
  const navigate = useNavigate();

  return (
    <DataTable
      columns={columns}
      data={data ?? []}
      filteredColumn="title"
      onRowClick={row => navigate('/activity/' + encodeURIComponent(row.original.code))}
    />
  );
}
