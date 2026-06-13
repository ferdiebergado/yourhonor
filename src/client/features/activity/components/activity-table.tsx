import type { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router';

import { DataTable } from '@client/components/data-table';
import SortButton from '@client/components/sort-button';
import type { ActivityInfo } from '@shared/schemas/activity';
import { useActivities } from '../hooks';

const columns: ColumnDef<ActivityInfo>[] = [
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
