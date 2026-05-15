import type { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/data-table';
import SortButton from '@/components/sort-button';
import type { ActivityDetail } from '@shared/schemas/activity';
import { useActivities } from '../hooks';
import TableActionsDropdown from './table-actions-dropdown';

const columns: ColumnDef<ActivityDetail>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => <SortButton column={column}>Title</SortButton>,
    cell: ({ row }) => (
      <div className="line-clamp-2 max-w-100 text-pretty">{row.getValue('title')}</div>
    ),
  },
  {
    accessorKey: 'venue',
    header: ({ column }) => <SortButton column={column}>Venue</SortButton>,
    cell: ({ row }) => <div className="max-w-53.5 text-pretty">{row.getValue('venue')}</div>,
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
    cell: ({ row }) => <TableActionsDropdown activity={row.original} />,
  },
];

export default function ActivityTable() {
  const { data } = useActivities();

  return <DataTable columns={columns} data={data ?? []} filteredColumn="title" />;
}
