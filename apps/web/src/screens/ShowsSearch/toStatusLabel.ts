import type { ShowsSearchResult } from './useShowsSearch';

export type StatusInput = {
  status: ShowsSearchResult['status'];
  isRefreshing: boolean;
  filteredCount: number;
  resultCount: number;
};

export function toStatusLabel({
  status,
  isRefreshing,
  filteredCount,
  resultCount,
}: StatusInput): string {
  if (status === 'loading' || isRefreshing) return 'Loading shows…';
  if (status !== 'success') return '';
  if (resultCount === 0) return 'No shows found';
  return `${filteredCount} of ${resultCount} shows`;
}

// ShowList already prints the empty-results message, so the status line only voices it to screen readers.
export function isStatusVisible({
  status,
  isRefreshing,
  resultCount,
}: StatusInput): boolean {
  return status !== 'success' || isRefreshing || resultCount > 0;
}
