import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-6xl">TV Shows Explorer</h1>
      </main>
    </QueryClientProvider>
  );
}
