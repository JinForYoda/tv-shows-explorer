import type { Show } from './lib/show.types';
import { searchShowsResponseSchema } from './showSchema';

const SEARCH_SHOWS_URL = 'https://api.tvmaze.com/search/shows';

export async function fetchShows(
  searchQuery: string,
  signal?: AbortSignal,
): Promise<Show[]> {
  const response = await fetch(
    `${SEARCH_SHOWS_URL}?q=${encodeURIComponent(searchQuery)}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(`TVmaze search failed with HTTP ${response.status}`);
  }
  const results = searchShowsResponseSchema.parse(await response.json());
  return results.map((result) => result.show);
}
