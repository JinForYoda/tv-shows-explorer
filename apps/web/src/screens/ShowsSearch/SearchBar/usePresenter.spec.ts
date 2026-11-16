import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, FormEvent } from 'react';
import { SEARCH_DEBOUNCE_MS, usePresenter } from './usePresenter';

function typed(value: string) {
  return { target: { value } } as unknown as ChangeEvent<HTMLInputElement>;
}

const submitEvent = {
  preventDefault: () => undefined,
} as FormEvent<HTMLFormElement>;

function renderSearchBar() {
  const onSearch = vi.fn();
  const hook = renderHook(() => usePresenter({ onSearch }));
  return { onSearch, ...hook };
}

describe('SearchBar usePresenter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('searches once with the latest draft after the debounce', () => {
    const { result, onSearch } = renderSearchBar();

    act(() => result.current.onDraftChange(typed('mu')));
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 1));
    act(() => result.current.onDraftChange(typed('murder')));
    act(() => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 1));
    expect(onSearch).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));

    expect(result.current.draft).toBe('murder');
    expect(onSearch).toHaveBeenCalledExactlyOnceWith('murder');
  });

  it('searches at once on submit and drops the pending debounce', () => {
    const { result, onSearch } = renderSearchBar();
    act(() => result.current.onDraftChange(typed('murder')));

    act(() => result.current.onSubmit(submitEvent));
    act(() => vi.runAllTimers());

    expect(onSearch).toHaveBeenCalledExactlyOnceWith('murder');
  });

  it('empties the draft and searches for nothing on clear', () => {
    const { result, onSearch } = renderSearchBar();
    act(() => result.current.onDraftChange(typed('murder')));
    expect(result.current.canClear).toBe(true);

    act(() => result.current.onClear());
    act(() => vi.runAllTimers());

    expect(result.current).toMatchObject({ draft: '', canClear: false });
    expect(onSearch).toHaveBeenCalledExactlyOnceWith('');
  });

  it('drops the pending debounce on unmount', () => {
    const { result, onSearch, unmount } = renderSearchBar();
    act(() => result.current.onDraftChange(typed('murder')));

    unmount();

    expect(vi.getTimerCount()).toBe(0);
    vi.runAllTimers();
    expect(onSearch).not.toHaveBeenCalled();
  });
});
