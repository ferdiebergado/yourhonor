import { RiAddLargeLine } from '@remixicon/react';
import type { ComponentProps } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { paths } from '@client/app/routes';
import Spinner from '@client/components/spinner';
import { Button } from '@client/components/ui/button';
import { ButtonGroup } from '@client/components/ui/button-group';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card';
import { useActivityContext } from '@client/features/activity/hooks';
import {
  useGenCert,
  useGenComp,
  useGenORS,
  useGenPayroll,
} from '@client/features/honorarium/hooks';
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

export default function HonorariaCard() {
  const activity = useActivityContext();
  const navigate = useNavigate();

  const { isPending: isGeneratingCert, mutate: genCert } = useGenCert();
  const { isPending: isGeneratingComp, mutate: genComp } = useGenComp();
  const { isPending: isGeneratingORS, mutate: genORS } = useGenORS();
  const { isPending: isGeneratingPayroll, mutate: genPayroll } = useGenPayroll();

  // eslint-disable-next-line unicorn/no-null
  if (!activity) return null;

  const { code: activityCode, honoraria } = activity;

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
        <CardAction>
          <Button
            size="lg"
            onClick={() => navigate(paths.newHonorarium.replace(':code', activityCode))}
          >
            <RiAddLargeLine data-icon="inline-start" />
            New Honorarium
          </Button>
        </CardAction>
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
