import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { BrowserRouter } from 'react-router';

import { Toaster } from '@client/components/ui/sonner';
import { TooltipProvider } from '@client/components/ui/tooltip';
import ThemeProvider from '@client/features/theme/theme-provider';
import { queryClient } from '@client/lib/query-client';

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>{children}</TooltipProvider>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
