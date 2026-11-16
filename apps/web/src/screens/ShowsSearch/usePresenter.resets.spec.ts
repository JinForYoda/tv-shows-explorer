import { act, renderHook } from '@testing-library/react';
import {
  makeShowsSearchResult,
  sevenShows,
  showIds,
} from './__fixtures__/makeShowsSearchResult';
import type { Show } from './lib/show.types';
import { usePresenter } from './usePresenter';
import { useShowsSearch } from './useShowsSearch';

vi.mock('./useShowsSearch');

const useShowsSearchMock = vi.mocked(useShowsSearch);

function renderWithShows(shows: Show[]) {
  useShowsSearchMock.mockReturnValue(makeShowsSearchResult({ shows }));
  return renderHook(() => usePresenter());
}

describe('ShowsSearch usePresenter resets', () => {
  afterEach(() => {
    useShowsSearchMock.mockReset();
  });

  it('resets the Genre Filter and the Page on a new Search Query', () => {
    const { result } = renderWithShows(sevenShows);
    act(() => result.current.onSearch('murder'));
    act(() => result.current.onGenreFilterChange('Drama'));
    act(() => result.current.onPageChange(2));

    act(() => result.current.onSearch('law'));

    expect(result.current).toMatchObject({
      searchQuery: 'law',
      genreFilter: null,
      page: 1,
    });
  });

  it.each(['murder', '  murder '])(
    'keeps the Genre Filter for the same Search Query %j',
    (sameSearchQuery) => {
      const { result } = renderWithShows(sevenShows);
      act(() => result.current.onSearch('murder'));
      act(() => result.current.onGenreFilterChange('Drama'));

      act(() => result.current.onSearch(sameSearchQuery));

      expect(result.current).toMatchObject({
        searchQuery: 'murder',
        genreFilter: 'Drama',
      });
    },
  );

  it.each(['murder', ' murder'])(
    'keeps the Page for the same Search Query %j',
    (sameSearchQuery) => {
      const { result } = renderWithShows(sevenShows);
      act(() => result.current.onSearch('murder'));
      act(() => result.current.onPageChange(2));

      act(() => result.current.onSearch(sameSearchQuery));

      expect(result.current.page).toBe(2);
    },
  );

  it('narrows the results with the Genre Filter and resets the Page', () => {
    const { result } = renderWithShows(sevenShows);
    act(() => result.current.onPageChange(2));

    act(() => result.current.onGenreFilterChange('Drama'));

    expect(result.current).toMatchObject({
      genreFilter: 'Drama',
      page: 1,
      pageCount: 1,
      resultCount: 7,
      filteredCount: 3,
    });
    expect(showIds(result.current.shows)).toEqual([1, 3, 6]);
  });

  it('clears the Genre Filter when the active Genre is picked again', () => {
    const { result } = renderWithShows(sevenShows);
    act(() => result.current.onGenreFilterChange('Drama'));

    act(() => result.current.onGenreFilterChange('Drama'));

    expect(result.current.genreFilter).toBeNull();
    expect(result.current.filteredCount).toBe(7);
  });

  it('clears the Genre Filter with null', () => {
    const { result } = renderWithShows(sevenShows);
    act(() => result.current.onGenreFilterChange('Comedy'));

    act(() => result.current.onGenreFilterChange(null));

    expect(result.current).toMatchObject({
      genreFilter: null,
      filteredCount: 7,
    });
  });

  it('resets the Page when "All" is picked', () => {
    const { result } = renderWithShows(sevenShows);
    act(() => result.current.onPageChange(2));

    act(() => result.current.onGenreFilterChange(null));

    expect(result.current.page).toBe(1);
  });
});
