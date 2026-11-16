import type { Show } from './lib/show.types';

export const SHOWS_PER_PAGE = 3;

export type ShowsPage = { shows: Show[]; page: number; pageCount: number };

function clampPage(page: number, pageCount: number): number {
  if (!Number.isInteger(page) || page < 1) return 1;
  return Math.min(page, Math.max(pageCount, 1));
}

export function paginate(shows: Show[], page: number): ShowsPage {
  const pageCount = Math.ceil(shows.length / SHOWS_PER_PAGE);
  const current = clampPage(page, pageCount);
  const start = (current - 1) * SHOWS_PER_PAGE;
  return {
    shows: shows.slice(start, start + SHOWS_PER_PAGE),
    page: current,
    pageCount,
  };
}
