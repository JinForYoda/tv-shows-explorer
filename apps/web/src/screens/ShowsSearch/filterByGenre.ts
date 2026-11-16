import type { Genre, Show } from './lib/show.types';

export function filterByGenre(
  shows: Show[],
  genreFilter: Genre | null,
): Show[] {
  if (genreFilter === null) return shows;
  return shows.filter((show) => show.genres.includes(genreFilter));
}
