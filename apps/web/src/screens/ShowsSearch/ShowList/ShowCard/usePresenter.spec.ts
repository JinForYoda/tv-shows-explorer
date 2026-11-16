import { renderHook } from '@testing-library/react';
import { makeShow } from '../../__fixtures__/makeShow';
import { usePresenter } from './usePresenter';

describe('ShowCard usePresenter', () => {
  it('labels the premiere year, rating and poster', () => {
    const show = makeShow({
      name: 'Murder, She Wrote',
      premiereYear: 1984,
      rating: 8,
    });

    const { result } = renderHook(() => usePresenter({ show }));

    expect(result.current).toEqual({
      yearLabel: '1984',
      ratingLabel: '★ 8.0',
      posterAlt: 'Poster of Murder, She Wrote',
      posterInitials: 'MS',
    });
  });

  it.each([
    ['Law & Order', 'LO'],
    ['Dexter', 'D'],
    ['the office', 'TO'],
    ['Gomorra: La serie', 'GL'],
  ])(
    'takes the initials of %s for the poster placeholder',
    (name, initials) => {
      const show = makeShow({ name });

      const { result } = renderHook(() => usePresenter({ show }));

      expect(result.current.posterInitials).toBe(initials);
    },
  );

  it('falls back when the year and rating are unknown', () => {
    const show = makeShow({ premiereYear: null, rating: null });

    const { result } = renderHook(() => usePresenter({ show }));

    expect(result.current).toMatchObject({
      yearLabel: '—',
      ratingLabel: 'no rating',
    });
  });
});
