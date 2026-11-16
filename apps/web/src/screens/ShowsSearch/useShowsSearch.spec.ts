import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { makeShow } from './__fixtures__/makeShow';
import { fetchShows } from './fetchShows';
import type { Show } from './lib/show.types';
import { useShowsSearch } from './useShowsSearch';

vi.mock('./fetchShows');

const fetchShowsMock = vi.mocked(fetchShows);

function renderShowsSearch(initialSearchQuery: string) {
  const queryClient = new QueryClient({
    // The hook's own retry: 1 still applies; only the backoff between attempts is removed.
    defaultOptions: { queries: { retryDelay: 0 } },
  });
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
  return renderHook(({ searchQuery }) => useShowsSearch(searchQuery), {
    wrapper,
    initialProps: { searchQuery: initialSearchQuery },
  });
}

function pendingForever(): Promise<Show[]> {
  return new Promise(() => undefined);
}

describe('useShowsSearch', () => {
  afterEach(() => {
    fetchShowsMock.mockReset();
  });

  it.each(['', '   '])('is idle for the Search Query %j', (searchQuery) => {
    const { result } = renderShowsSearch(searchQuery);

    expect(result.current).toMatchObject({ status: 'idle', shows: [] });
    expect(fetchShowsMock).not.toHaveBeenCalled();
  });

  it('loads, then returns the Shows for the trimmed Search Query', async () => {
    const shows = [makeShow({ name: 'Diagnosis: Murder' })];
    fetchShowsMock.mockResolvedValue(shows);

    const { result } = renderShowsSearch('  murder ');

    expect(result.current).toMatchObject({ status: 'loading', shows: [] });
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current).toMatchObject({ shows, isRefreshing: false });
    expect(fetchShowsMock).toHaveBeenCalledWith(
      'murder',
      expect.any(AbortSignal),
    );
  });

  it('cancels the stale request when the Search Query changes', async () => {
    fetchShowsMock.mockImplementation(pendingForever);
    const { rerender } = renderShowsSearch('murder');
    await waitFor(() => expect(fetchShowsMock).toHaveBeenCalledTimes(1));
    const staleSignal = fetchShowsMock.mock.calls[0][1];

    rerender({ searchQuery: 'law' });

    await waitFor(() => expect(staleSignal?.aborted).toBe(true));
  });

  it('keeps the previous Shows while the next Search Query loads', async () => {
    const shows = [makeShow({ name: 'Diagnosis: Murder' })];
    fetchShowsMock
      .mockResolvedValueOnce(shows)
      .mockImplementation(pendingForever);
    const { result, rerender } = renderShowsSearch('murder');
    await waitFor(() => expect(result.current.status).toBe('success'));

    rerender({ searchQuery: 'law' });

    expect(result.current).toMatchObject({
      status: 'success',
      shows,
      isRefreshing: true,
    });
  });

  it('drops the previous Shows when the Search Query is cleared', async () => {
    fetchShowsMock.mockResolvedValue([makeShow()]);
    const { result, rerender } = renderShowsSearch('murder');
    await waitFor(() => expect(result.current.status).toBe('success'));

    rerender({ searchQuery: ' ' });

    expect(result.current).toMatchObject({
      status: 'idle',
      shows: [],
      isRefreshing: false,
    });
  });

  it('fails after a single retry, then recovers on retry()', async () => {
    fetchShowsMock.mockRejectedValue(new Error('TVmaze is down'));
    const { result } = renderShowsSearch('murder');

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(fetchShowsMock).toHaveBeenCalledTimes(2);
    expect(result.current.shows).toEqual([]);

    const shows = [makeShow()];
    fetchShowsMock.mockResolvedValue(shows);
    act(() => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.shows).toEqual(shows);
  });

  it('reports isRetrying while a retry of a failed search is in flight', async () => {
    fetchShowsMock.mockRejectedValue(new Error('TVmaze is down'));
    const { result } = renderShowsSearch('murder');
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.isRetrying).toBe(false);

    let resolveRetry: (shows: Show[]) => void = () => undefined;
    fetchShowsMock.mockImplementation(
      () => new Promise((resolve) => (resolveRetry = resolve)),
    );
    act(() => result.current.retry());

    await waitFor(() => expect(result.current.isRetrying).toBe(true));
    expect(result.current.status).toBe('error');

    act(() => resolveRetry([makeShow()]));
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.isRetrying).toBe(false);
  });
});
