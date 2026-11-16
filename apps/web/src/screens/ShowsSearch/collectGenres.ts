import type { Genre, Show } from './lib/show.types';

export type GenreCount = { genre: Genre; count: number };

const byName = new Intl.Collator('en', { sensitivity: 'base' });

export function collectGenres(shows: Show[]): GenreCount[] {
  const counts = new Map<Genre, number>();
  for (const show of shows) {
    for (const genre of new Set(show.genres)) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    }
  }
  return Array.from(counts, ([genre, count]) => ({ genre, count })).sort(
    (a, b) => byName.compare(a.genre, b.genre),
  );
}
