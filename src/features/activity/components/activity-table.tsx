import type { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/data-table';
import SortButton from '@/components/sort-button';
import type { ActivityDetail } from '@shared/schemas/activity';
import { useDetailedActivities } from '../hooks';
import TableActionsDropdown from './table-actions-dropdown';

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
    cell: ({ row }) => <TableActionsDropdown activity={row.original} />,
  },
];

export default function ActivityTable() {
  const { data } = useDetailedActivities();

  return <DataTable columns={columns} data={data ?? []} filteredColumn="title" />;
}
