import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

import { paths } from '@/app/routes';
import SplashScreen from '@/components/splash-screen';
import { validateState } from '..';
import { useSignin } from '../hooks';

export default function OauthCallback() {
  const [searchParams] = useSearchParams();
  const { isPending, isError, error, mutate: signin } = useSignin();
  const { state } = useLocation();
  const navigate = useNavigate();

  const code = searchParams.get('code');
  const stateFromUrl = searchParams.get('state');

  useEffect(() => {
    if (!code || !stateFromUrl) return;

    const isValidState = validateState(stateFromUrl);
    if (!isValidState) return;

    signin(code, {
      onSuccess: () => {
        toast.success('Successfully signed in!');
        const to = state?.from ?? paths.home;
        navigate(to, { replace: true });
      },
    });
  }, [code, navigate, signin, state?.from, stateFromUrl]);

  if (isPending) return <SplashScreen />;

  if (isError)
    return (
      <p className="text-destructive text-xl font-semibold">
        {error instanceof Error ? error.message : String(error)}
      </p>
    );

  // eslint-disable-next-line unicorn/no-null
  return null;
}
