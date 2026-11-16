import type { Show } from '../lib/show.types';
import type { ShowsSearchResult } from '../useShowsSearch';
import { makeShow } from './makeShow';

export function makeShowsSearchResult(
  overrides: Partial<ShowsSearchResult> = {},
): ShowsSearchResult {
  return {
    status: 'success',
    shows: [],
    isRefreshing: false,
    isRetrying: false,
    retry: () => undefined,
    ...overrides,
  };
}

export const sevenShows: Show[] = [
  makeShow({ id: 1, genres: ['Drama'] }),
  makeShow({ id: 2, genres: ['Comedy'] }),
  makeShow({ id: 3, genres: ['Drama', 'Crime'] }),
  makeShow({ id: 4, genres: ['Comedy'] }),
  makeShow({ id: 5, genres: [] }),
  makeShow({ id: 6, genres: ['Drama'] }),
  makeShow({ id: 7, genres: ['Crime'] }),
];

export function showIds(shows: Show[]): number[] {
  return shows.map((show) => show.id);
}
