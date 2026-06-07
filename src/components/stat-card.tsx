import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type StatCardProps = {
  label: string;
  value: number;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <Card className="w-1/2 p-2 md:w-1/4 md:p-5">
      <CardHeader>
        <CardTitle className="text-center">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-heading text-center text-6xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
