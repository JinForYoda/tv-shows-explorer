import { makeShow } from './__fixtures__/makeShow';
import { paginate, SHOWS_PER_PAGE } from './paginate';

function makeShows(count: number) {
  return Array.from({ length: count }, (_, index) =>
    makeShow({ id: index + 1 }),
  );
}

function ids(shows: { id: number }[]) {
  return shows.map((show) => show.id);
}

describe('paginate', () => {
  const sevenShows = makeShows(7);

  it('puts three Shows on a Page', () => {
    expect(SHOWS_PER_PAGE).toBe(3);
  });

  it('returns the first Page', () => {
    const result = paginate(sevenShows, 1);

    expect(ids(result.shows)).toEqual([1, 2, 3]);
    expect(result).toMatchObject({ page: 1, pageCount: 3 });
  });

  it('returns a middle Page', () => {
    expect(ids(paginate(sevenShows, 2).shows)).toEqual([4, 5, 6]);
  });

  it('returns a partial last Page', () => {
    const result = paginate(sevenShows, 3);

    expect(ids(result.shows)).toEqual([7]);
    expect(result.page).toBe(3);
  });

  it('fits exactly three Shows on one Page', () => {
    const result = paginate(makeShows(3), 1);

    expect(ids(result.shows)).toEqual([1, 2, 3]);
    expect(result.pageCount).toBe(1);
  });

  it('has no Pages and stays on Page 1 when there are no Shows', () => {
    expect(paginate([], 1)).toEqual({ shows: [], page: 1, pageCount: 0 });
    expect(paginate([], 4)).toEqual({ shows: [], page: 1, pageCount: 0 });
  });

  it.each([0, -2, Number.NaN, 1.5])(
    'falls back to Page 1 for page %s',
    (page) => {
      const result = paginate(sevenShows, page);

      expect(result.page).toBe(1);
      expect(ids(result.shows)).toEqual([1, 2, 3]);
    },
  );

  it('clamps a Page beyond the last one to the last Page', () => {
    const result = paginate(sevenShows, 10);

    expect(result.page).toBe(3);
    expect(ids(result.shows)).toEqual([7]);
  });
});
