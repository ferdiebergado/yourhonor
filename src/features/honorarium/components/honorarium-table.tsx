import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useActivityCode } from '@/features/activity/hooks';
import { getFullName } from '@/lib/utils';
import { formatAmount } from '@shared/utils';
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
          <TableHead className="w-25">Payee</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Gross Honorarium</TableHead>
          <TableHead>Hours Rendered</TableHead>
          <TableHead className="text-right">Actual Honorarium</TableHead>
          <TableHead className="text-right">Tax Rate</TableHead>
          <TableHead className="text-right">Net Honorarium</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {honoraria.map(honorarium => (
          <TableRow key={honorarium.id}>
            <TableCell className="font-medium">{getFullName(honorarium)}</TableCell>
            <TableCell className="font-medium">{honorarium.role}</TableCell>
            <TableCell className="font-medium">{formatAmount(honorarium.amount)}</TableCell>
            <TableCell className="font-medium">{honorarium.hoursRendered.toFixed(2)}</TableCell>
            <TableCell className="font-medium">{formatAmount(honorarium.actual)}</TableCell>
            <TableCell className="font-medium">{honorarium.taxRate.toFixed(2)}%</TableCell>
            <TableCell className="font-medium">{formatAmount(honorarium.net)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
