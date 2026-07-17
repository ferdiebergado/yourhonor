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

// Expose the queryClient on the window object for debugging purposes.
// Install the TanStack Query DevTools Chrome Extension to inspect queries, mutations, and cache state in real-time:
// https://chromewebstore.google.com/detail/tanstack-query-devtools/annajfchloimdhceglpgglpeepfghfai',
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: QueryClient;
  }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient;
