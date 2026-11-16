import { renderHook } from '@testing-library/react';
import {
  ALL_GENRES,
  type GenreFilterProps,
  usePresenter,
} from './usePresenter';

function renderGenreFilter(overrides: Partial<GenreFilterProps> = {}) {
  const props: GenreFilterProps = {
    genres: [
      { genre: 'Comedy', count: 2 },
      { genre: 'Drama', count: 3 },
    ],
    genreFilter: null,
    onGenreFilterChange: vi.fn(),
    ...overrides,
  };
  return { props, ...renderHook(() => usePresenter(props)) };
}

describe('GenreFilter usePresenter', () => {
  it('labels "All" and each Genre with its count', () => {
    const { result } = renderGenreFilter();

    expect(result.current.chips.map((chip) => chip.label)).toEqual([
      'All',
      'Comedy · 2',
      'Drama · 3',
    ]);
    expect(result.current.isHidden).toBe(false);
  });

  it('names each chip the way it should be read aloud', () => {
    const { result } = renderGenreFilter({
      genres: [
        { genre: 'Comedy', count: 2 },
        { genre: 'Crime', count: 1 },
      ],
    });

    expect(result.current.chips.map((chip) => chip.ariaLabel)).toEqual([
      'All genres',
      'Comedy, 2 shows',
      'Crime, 1 show',
    ]);
  });

  it('is hidden without Genres', () => {
    const { result } = renderGenreFilter({ genres: [] });

    expect(result.current.isHidden).toBe(true);
  });

  it('selects the active Genre, or "All" without a Genre Filter', () => {
    const all = renderGenreFilter().result.current;
    const drama = renderGenreFilter({ genreFilter: 'Drama' }).result.current;

    expect(all.value).toBe(ALL_GENRES);
    expect(drama.value).toBe('Drama');
  });

  it.each([
    ['a Genre', 'Comedy', 'Comedy'],
    ['"All"', ALL_GENRES, null],
    ['a deselected chip', '', null],
  ])('passes %s up as the Genre Filter', (_, value, genre) => {
    const { result, props } = renderGenreFilter({ genreFilter: 'Drama' });

    result.current.onValueChange(value);

    expect(props.onGenreFilterChange).toHaveBeenCalledExactlyOnceWith(genre);
  });
});
