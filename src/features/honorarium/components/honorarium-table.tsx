import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useActivityCode } from '@/features/activity/hooks';
import { formatAmount, getFullName } from '@shared/utils';
import { useActiveHonoraria } from '../hooks';

export default function HonorariumTable() {
  const code = useActivityCode();
  const { data: honoraria } = useActiveHonoraria(code);

  // eslint-disable-next-line unicorn/no-null
  if (!honoraria) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">Payee</TableHead>
          <TableHead className="font-semibold">Role</TableHead>
          <TableHead className="text-right font-semibold">Gross Honorarium</TableHead>
          <TableHead className="text-right font-semibold">Hours Rendered</TableHead>
          <TableHead className="text-right font-semibold">Actual Honorarium</TableHead>
          <TableHead className="text-right font-semibold">Tax Rate</TableHead>
          <TableHead className="text-right font-semibold">Net Honorarium</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {honoraria && honoraria.length > 0 ? (
          honoraria.map(honorarium => (
            <TableRow key={honorarium.id}>
              <TableCell>{getFullName(honorarium)}</TableCell>
              <TableCell>{honorarium.role}</TableCell>
              <TableCell className="text-right">{formatAmount(honorarium.amount)}</TableCell>
              <TableCell className="text-right">{honorarium.hoursRendered}</TableCell>
              <TableCell className="text-right">{formatAmount(honorarium.actual)}</TableCell>
              <TableCell className="text-right">{honorarium.taxRate.toFixed(2)}%</TableCell>
              <TableCell className="text-right">{formatAmount(honorarium.net)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableCell className="text-muted-foreground">No records found.</TableCell>
        )}
      </TableBody>
    </Table>
  );
}
