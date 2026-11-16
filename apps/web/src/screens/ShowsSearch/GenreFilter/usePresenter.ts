import type { GenreCount } from '../collectGenres';
import type { Genre } from '../lib/show.types';

// Radix reports a deselected single toggle group as '', so "All" needs a value of its own.
export const ALL_GENRES = 'all-genres';

export type GenreFilterProps = {
  genres: GenreCount[];
  genreFilter: Genre | null;
  onGenreFilterChange: (genre: Genre | null) => void;
};

export type GenreChip = { value: string; label: string; ariaLabel: string };

export function usePresenter({
  genres,
  genreFilter,
  onGenreFilterChange,
}: GenreFilterProps) {
  const chips: GenreChip[] = [
    { value: ALL_GENRES, label: 'All', ariaLabel: 'All genres' },
    ...genres.map(({ genre, count }) => ({
      value: genre,
      label: `${genre} · ${count}`,
      ariaLabel: `${genre}, ${count} ${count === 1 ? 'show' : 'shows'}`,
    })),
  ];

  const onValueChange = (value: string) =>
    onGenreFilterChange(value === ALL_GENRES || value === '' ? null : value);

  return {
    isHidden: genres.length === 0,
    chips,
    value: genreFilter ?? ALL_GENRES,
    onValueChange,
  };
}
