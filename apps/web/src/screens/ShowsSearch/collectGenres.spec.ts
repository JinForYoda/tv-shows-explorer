import { makeShow } from './__fixtures__/makeShow';
import { collectGenres } from './collectGenres';

describe('collectGenres', () => {
  it('returns no Genres for no Shows', () => {
    expect(collectGenres([])).toEqual([]);
  });

  it('counts how many Shows have each Genre', () => {
    const shows = [
      makeShow({ id: 1, genres: ['Drama', 'Crime'] }),
      makeShow({ id: 2, genres: ['Drama'] }),
      makeShow({ id: 3, genres: ['Crime', 'Drama'] }),
    ];

    expect(collectGenres(shows)).toEqual([
      { genre: 'Crime', count: 2 },
      { genre: 'Drama', count: 3 },
    ]);
  });

  it('counts a Show once even if it lists a Genre twice', () => {
    const shows = [makeShow({ genres: ['Drama', 'Drama'] })];

    expect(collectGenres(shows)).toEqual([{ genre: 'Drama', count: 1 }]);
  });

  it('sorts Genres alphabetically regardless of case', () => {
    const shows = [
      makeShow({ genres: ['thriller', 'Comedy', 'anime', 'Drama'] }),
    ];

    expect(collectGenres(shows).map(({ genre }) => genre)).toEqual([
      'anime',
      'Comedy',
      'Drama',
      'thriller',
    ]);
  });

  it('ignores Shows without Genres', () => {
    const shows = [
      makeShow({ id: 1, genres: [] }),
      makeShow({ id: 2, genres: ['Comedy'] }),
    ];

    expect(collectGenres(shows)).toEqual([{ genre: 'Comedy', count: 1 }]);
  });

  it('returns no Genres when no Show has one', () => {
    expect(collectGenres([makeShow(), makeShow({ id: 2 })])).toEqual([]);
  });
});
