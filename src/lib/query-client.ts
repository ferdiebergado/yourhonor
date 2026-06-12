import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { handleAuthError } from './errors';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error(error);
      handleAuthError(error);
      if (query.state.data !== undefined) toast.error(error.message);
    },
  }),
  mutationCache: new MutationCache({
    onError: error => {
      console.error(error);
      handleAuthError(error);
      toast.error(error.message);
    },
  }),
});
