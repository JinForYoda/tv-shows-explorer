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

describe('ShowsSearch usePresenter', () => {
  afterEach(() => {
    useShowsSearchMock.mockReset();
  });

  it('starts with no Search Query, no Genre Filter, Page 1 and passes idle through', () => {
    useShowsSearchMock.mockReturnValue(
      makeShowsSearchResult({ status: 'idle' }),
    );

    const { result } = renderHook(() => usePresenter());

    expect(result.current).toMatchObject({
      searchQuery: '',
      genreFilter: null,
      page: 1,
      pageCount: 0,
      status: 'idle',
      shows: [],
      genres: [],
      resultCount: 0,
      filteredCount: 0,
      statusLabel: '',
    });
    expect(useShowsSearchMock).toHaveBeenLastCalledWith('');
  });

  it('passes status, isRefreshing, isRetrying and retry through', () => {
    const retry = vi.fn();
    useShowsSearchMock.mockReturnValue(
      makeShowsSearchResult({
        status: 'error',
        isRefreshing: true,
        isRetrying: true,
        retry,
      }),
    );

    const { result } = renderHook(() => usePresenter());
    result.current.retry();

    expect(result.current).toMatchObject({
      status: 'error',
      isRefreshing: true,
      isRetrying: true,
    });
    expect(retry).toHaveBeenCalledOnce();
  });

  it('searches with the committed Search Query', () => {
    const { result } = renderWithShows([]);

    act(() => result.current.onSearch('murder'));

    expect(result.current.searchQuery).toBe('murder');
    expect(useShowsSearchMock).toHaveBeenLastCalledWith('murder');
  });

  it('slices the results into Pages of three and clamps to the last Page', () => {
    const { result } = renderWithShows(sevenShows);

    expect(showIds(result.current.shows)).toEqual([1, 2, 3]);
    expect(result.current).toMatchObject({ page: 1, pageCount: 3 });

    act(() => result.current.onPageChange(3));
    expect(showIds(result.current.shows)).toEqual([7]);
    expect(result.current.page).toBe(3);

    act(() => result.current.onPageChange(9));
    expect(result.current.page).toBe(3);
  });

  it('collects Genres from all results even with a Genre Filter', () => {
    const { result } = renderWithShows(sevenShows);

    act(() => result.current.onGenreFilterChange('Crime'));

    expect(result.current.genres).toEqual([
      { genre: 'Comedy', count: 2 },
      { genre: 'Crime', count: 2 },
      { genre: 'Drama', count: 3 },
    ]);
  });

  it('clamps the Page when the results shrink under it', () => {
    useShowsSearchMock.mockReturnValue(
      makeShowsSearchResult({ shows: sevenShows }),
    );
    const { result, rerender } = renderHook(() => usePresenter());
    act(() => result.current.onPageChange(3));

    useShowsSearchMock.mockReturnValue(
      makeShowsSearchResult({ shows: sevenShows.slice(0, 4) }),
    );
    rerender();

    expect(result.current).toMatchObject({ page: 2, pageCount: 2 });
    expect(showIds(result.current.shows)).toEqual([4]);
  });

  it('labels the filtered count against all results', () => {
    const { result } = renderWithShows(sevenShows);

    act(() => result.current.onGenreFilterChange('Drama'));

    expect(result.current.statusLabel).toBe('3 of 7 shows');
  });
});
