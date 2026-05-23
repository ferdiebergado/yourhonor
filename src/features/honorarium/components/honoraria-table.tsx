import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { HonorariumDetail } from '@shared/schemas/honorarium';
import { formatAmount, getFullName } from '@shared/utils';

type RowHeader = {
  label: string;
  style: string;
};

const headers: RowHeader[] = [
  { label: 'Payee', style: 'font-semibold' },
  { label: 'Role', style: 'font-semibold' },
  { label: 'Gross Honorarium', style: 'text-right font-semibold' },
  { label: 'Hours Rendered', style: 'text-right font-semibold' },
  { label: 'Computed Honorarium', style: 'text-right font-semibold' },
  { label: 'Tax Rate', style: 'text-right font-semibold' },
  { label: 'Net Honorarium', style: 'text-right font-semibold' },
];

type Cell = {
  style?: string;
  value: string;
};

const formatCells = (honorarium: HonorariumDetail): Cell[] => [
  {
    value: getFullName({
      firstname: honorarium.firstname,
      mi: honorarium.mi,
      lastname: honorarium.lastname,
    }),
  },
  {
    value: honorarium.role,
  },
  {
    style: 'text-right',
    value: formatAmount(honorarium.amount),
  },
  {
    style: 'text-right',
    value: honorarium.hoursRendered.toString(),
  },
  {
    style: 'text-right',
    value: formatAmount(honorarium.actual),
  },
  {
    style: 'text-right',
    value: honorarium.taxRate.toFixed(2) + '%',
  },
  {
    style: 'text-right',
    value: formatAmount(honorarium.net),
  },
];

type HonorariumTableProps = {
  honoraria: HonorariumDetail[];
};

export default function HonorariaTable({ honoraria }: HonorariumTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map(({ label, style }) => (
            <TableHead className={style}>{label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {honoraria.length > 0 ? (
          honoraria.map(honorarium => (
            <TableRow key={honorarium.id}>
              {formatCells(honorarium).map(({ style, value }) => (
                <TableCell className={style}>{value}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell className="text-muted-foreground">No records found.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
