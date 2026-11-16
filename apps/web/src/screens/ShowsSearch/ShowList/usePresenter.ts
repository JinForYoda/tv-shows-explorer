import type { RefObject } from 'react';
import type { Genre, Show } from '../lib/show.types';
import type { ShowsSearchResult } from '../useShowsSearch';

export type ShowListProps = {
  status: ShowsSearchResult['status'];
  isRefreshing: boolean;
  isRetrying: boolean;
  shows: Show[];
  searchQuery: string;
  genreFilter: Genre | null;
  onRetry: () => void;
  resultsRef: RefObject<HTMLUListElement | null>;
};

type ShowListState = 'idle' | 'loading' | 'error' | 'empty' | 'results';

function toState({
  status,
  shows,
  isRefreshing,
}: ShowListProps): ShowListState {
  if (status !== 'success') return status;
  if (shows.length > 0) return 'results';
  // The previous Search Query's empty results must not claim the next Search Query matched nothing.
  return isRefreshing ? 'loading' : 'empty';
}

function toEmptyMessage({ searchQuery, genreFilter }: ShowListProps): string {
  const inGenre = genreFilter === null ? '' : ` in ${genreFilter}`;
  return `No shows match “${searchQuery}”${inGenre}.`;
}

export function usePresenter(props: ShowListProps) {
  return {
    state: toState(props),
    emptyMessage: toEmptyMessage(props),
  };
}
