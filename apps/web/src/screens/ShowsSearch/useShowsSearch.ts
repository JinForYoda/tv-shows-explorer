import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchShows } from './fetchShows';
import type { Show } from './lib/show.types';

const STALE_TIME_MS = 5 * 60 * 1000;

export type ShowsSearchResult = {
  status: 'idle' | 'loading' | 'error' | 'success';
  shows: Show[];
  isRefreshing: boolean;
  isRetrying: boolean;
  retry: () => void;
};

export function useShowsSearch(searchQuery: string): ShowsSearchResult {
  const trimmedSearchQuery = searchQuery.trim();
  const isIdle = trimmedSearchQuery === '';
  const query = useQuery({
    queryKey: ['shows', 'search', trimmedSearchQuery],
    queryFn: ({ signal }) => fetchShows(trimmedSearchQuery, signal),
    enabled: !isIdle,
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME_MS,
    retry: 1,
  });
  const retry = () => void query.refetch();
  const empty = { shows: [], isRefreshing: false, isRetrying: false, retry };

  // keepPreviousData would carry the last results into the disabled empty query, so idle is decided before it.
  if (isIdle) return { status: 'idle', ...empty };
  // Refetching a query that never got data resets it to 'pending', so a retry in flight is told by its last error.
  const hasFailed = query.isError || query.errorUpdatedAt > query.dataUpdatedAt;
  if (hasFailed) {
    return { status: 'error', ...empty, isRetrying: query.isFetching };
  }
  if (query.isPending) return { status: 'loading', ...empty };
  return {
    status: 'success',
    shows: query.data,
    isRefreshing: query.isPlaceholderData,
    isRetrying: false,
    retry,
  };
}
