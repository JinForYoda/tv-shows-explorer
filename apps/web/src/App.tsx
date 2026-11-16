import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShowsSearch } from './screens/ShowsSearch';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ShowsSearch />
    </QueryClientProvider>
  );
}
