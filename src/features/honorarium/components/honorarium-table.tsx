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

// TODO: Extract table header and row data
type HonorariumTableProps = {
  honoraria: HonorariumDetail[];
};

export default function HonorariumTable({ honoraria }: HonorariumTableProps) {
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
              <TableCell>
                {getFullName({
                  firstname: honorarium.firstname,
                  mi: honorarium.mi,
                  lastname: honorarium.lastname,
                })}
              </TableCell>
              <TableCell>{honorarium.role}</TableCell>
              <TableCell className="text-right">{formatAmount(honorarium.amount)}</TableCell>
              <TableCell className="text-right">{honorarium.hoursRendered}</TableCell>
              <TableCell className="text-right">{formatAmount(honorarium.actual)}</TableCell>
              <TableCell className="text-right">{honorarium.taxRate.toFixed(2)}%</TableCell>
              <TableCell className="text-right">{formatAmount(honorarium.net)}</TableCell>
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
