import { act, renderHook } from '@testing-library/react';
import {
  makeShowsSearchResult,
  sevenShows,
} from './__fixtures__/makeShowsSearchResult';
import { usePresenter } from './usePresenter';
import { useShowsSearch } from './useShowsSearch';

vi.mock('./useShowsSearch');

const useShowsSearchMock = vi.mocked(useShowsSearch);

function renderWithSevenShows() {
  useShowsSearchMock.mockReturnValue(
    makeShowsSearchResult({ shows: sevenShows }),
  );
  return renderHook(() => usePresenter());
}

describe('ShowsSearch usePresenter results focus', () => {
  afterEach(() => {
    useShowsSearchMock.mockReset();
    vi.unstubAllGlobals();
    document.body.replaceChildren();
  });

  it('focuses the results list on every Page change, including the current Page', () => {
    const { result } = renderWithSevenShows();
    const list = document.createElement('ul');
    list.tabIndex = -1;
    list.scrollIntoView = vi.fn();
    document.body.append(list);
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    result.current.resultsRef.current = list;

    act(() => result.current.onPageChange(2));
    expect(document.activeElement).toBe(list);

    list.blur();
    act(() => result.current.onPageChange(2));
    expect(document.activeElement).toBe(list);
    expect(list.scrollIntoView).toHaveBeenCalledTimes(2);
  });

  it('leaves focus alone when the Search Query or Genre Filter resets the Page', () => {
    const { result } = renderWithSevenShows();
    const list = document.createElement('ul');
    list.focus = vi.fn();
    result.current.resultsRef.current = list;

    act(() => result.current.onGenreFilterChange('Drama'));
    act(() => result.current.onSearch('law'));

    expect(list.focus).not.toHaveBeenCalled();
  });
});
