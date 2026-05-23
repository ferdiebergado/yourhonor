import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SplashScreen from '@/components/splash-screen';
import Page from './page';
import Fallback from './pages/fallback';
import Provider from './provider';

export default function App() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary FallbackComponent={Fallback} onReset={reset}>
      <Provider>
        <Suspense fallback={<SplashScreen />}>
          <Page />
        </Suspense>
      </Provider>
    </ErrorBoundary>
  );
}
