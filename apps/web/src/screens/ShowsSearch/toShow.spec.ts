import searchShows from './__fixtures__/searchShows.json';
import { tvmazeShowSchema } from './showSchema';
import { toShow } from './toShow';

const [diagnosisMurder, unknownAnthology, diagnosisUnknown] = searchShows.map(
  (result) => tvmazeShowSchema.parse(result.show),
);

describe('toShow', () => {
  it('maps a complete TVmaze show to a Show', () => {
    expect(toShow(diagnosisMurder)).toEqual({
      id: 3307,
      name: 'Diagnosis: Murder',
      premiereYear: 1992,
      rating: 7.5,
      genres: ['Drama', 'Crime', 'Medical'],
      posterUrl:
        'https://static.tvmaze.com/uploads/images/medium_portrait/17/44006.jpg',
      summary: expect.stringMatching(/^Dr\. Mark Sloan is chief .* Steve\.$/),
    });
  });

  it('falls back to null for a missing premiere date, rating and poster', () => {
    expect(toShow(unknownAnthology)).toMatchObject({
      premiereYear: null,
      rating: null,
      posterUrl: null,
      genres: [],
    });
  });

  it('falls back to an empty summary when TVmaze has none', () => {
    expect(toShow(diagnosisUnknown).summary).toBe('');
  });

  it('strips HTML tags, decodes entities and collapses whitespace', () => {
    const summary =
      '<p><b>Law &amp; Order</b> is &quot;classic&quot;&nbsp;&#8212; really.</p>' +
      '<p>Second&#39;s\n   paragraph.<br>Last line.</p>';

    expect(toShow({ ...diagnosisMurder, summary }).summary).toBe(
      'Law & Order is "classic" — really. Second\'s paragraph. Last line.',
    );
  });

  it('takes the premiere year from the premiere date', () => {
    expect(
      toShow({ ...diagnosisMurder, premiered: '2012-08-26' }).premiereYear,
    ).toBe(2012);
  });
});
