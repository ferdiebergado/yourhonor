import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.state.data !== undefined) handleError(error);
    },
  }),
  mutationCache: new MutationCache({
    onError: error => handleError(error),
  }),
});

function handleError(error: Error) {
  console.error(error);
  toast.error(error.message);
}
