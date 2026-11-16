import { makeShow } from './__fixtures__/makeShow';
import { filterByGenre } from './filterByGenre';

const drama = makeShow({ id: 1, genres: ['Drama'] });
const comedy = makeShow({ id: 2, genres: ['Comedy'] });
const comedyDrama = makeShow({ id: 3, genres: ['Comedy', 'Drama'] });
const noGenre = makeShow({ id: 4, genres: [] });
const shows = [drama, comedy, comedyDrama, noGenre];

describe('filterByGenre', () => {
  it('keeps every Show when there is no Genre Filter', () => {
    expect(filterByGenre(shows, null)).toEqual(shows);
  });

  it('keeps only Shows of the Genre Filter, in their original order', () => {
    expect(filterByGenre(shows, 'Drama')).toEqual([drama, comedyDrama]);
  });

  it('returns no Shows for a Genre none of them has', () => {
    expect(filterByGenre(shows, 'Horror')).toEqual([]);
  });
});
