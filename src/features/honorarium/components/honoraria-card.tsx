import type { ComponentProps } from 'react';
import { toast } from 'sonner';

import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useGenCert, useGenComp, useGenORS, useGenPayroll } from '@/features/honorarium/hooks';
import type { HonorariumInfo } from '@shared/schemas/honorarium';
import HonorariaTable from './honoraria-table';

type GeneratorButtonProps = {
  title: string;
  isLoading: boolean;
  onClick: ComponentProps<'button'>['onClick'];
  disabled?: boolean;
};

function GeneratorButton({ title, isLoading, onClick, disabled = false }: GeneratorButtonProps) {
  return (
    <Button variant="outline" className="w-35" onClick={onClick} disabled={disabled || isLoading}>
      {isLoading ? <Spinner text="Generating..." /> : title}
    </Button>
  );
}

type HonorariaCardProps = {
  activityCode: string;
  honoraria: HonorariumInfo[];
};

export default function HonorariaCard({ activityCode, honoraria }: HonorariaCardProps) {
  const { isPending: isGeneratingCert, mutate: genCert } = useGenCert();
  const { isPending: isGeneratingComp, mutate: genComp } = useGenComp();
  const { isPending: isGeneratingORS, mutate: genORS } = useGenORS();
  const { isPending: isGeneratingPayroll, mutate: genPayroll } = useGenPayroll();

  const buttonData: GeneratorButtonProps[] = [
    {
      title: 'Certification',
      isLoading: isGeneratingCert,
      onClick: () =>
        genCert(activityCode, {
          onSuccess: () => toast.success('Certification generated.'),
        }),
    },
    {
      title: 'Computation',
      isLoading: isGeneratingComp,
      onClick: () =>
        genComp(activityCode, {
          onSuccess: () => toast.success('Computation generated.'),
        }),
    },
    {
      title: 'ORS/DV',
      isLoading: isGeneratingORS,
      onClick: () => genORS(activityCode, { onSuccess: () => toast.success('ORS/DV generated.') }),
    },
    {
      title: 'Payroll',
      isLoading: isGeneratingPayroll,
      onClick: () =>
        genPayroll(activityCode, { onSuccess: () => toast.success('Payroll generated.') }),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Honoraria</CardTitle>
        <CardDescription>Click on a button below to generate a document.</CardDescription>
      </CardHeader>
      <CardContent>
        <HonorariaTable honoraria={honoraria} />
      </CardContent>
      <CardFooter className="flex justify-center p-3">
        <ButtonGroup>
          {buttonData.map(({ title, isLoading, onClick }) => (
            <GeneratorButton
              key={title}
              title={title}
              isLoading={isLoading}
              onClick={onClick}
              disabled={honoraria.length === 0}
            />
          ))}
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
