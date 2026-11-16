import { ZodError } from 'zod';
import searchShows from './__fixtures__/searchShows.json';
import { fetchShows } from './fetchShows';

function stubFetch(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('fetchShows', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the found Shows in API order', async () => {
    stubFetch(Response.json(searchShows));

    const shows = await fetchShows('murder');

    expect(shows.map((show) => show.name)).toEqual([
      'Diagnosis: Murder',
      'Unknown',
      'Diagnosis: Unknown',
    ]);
    expect(shows[0]).toMatchObject({ id: 3307, premiereYear: 1992 });
  });

  it('URL-encodes the Search Query', async () => {
    const fetchMock = stubFetch(Response.json([]));

    await fetchShows('law & order');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.tvmaze.com/search/shows?q=law%20%26%20order',
      expect.anything(),
    );
  });

  it('forwards the abort signal to fetch', async () => {
    const fetchMock = stubFetch(Response.json([]));
    const { signal } = new AbortController();

    await fetchShows('murder', signal);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal }),
    );
  });

  it('throws with the HTTP status when TVmaze responds with an error', async () => {
    stubFetch(new Response('Too Many Requests', { status: 429 }));

    await expect(fetchShows('murder')).rejects.toThrow('429');
  });

  it('throws when the response does not match the schema', async () => {
    stubFetch(Response.json([{ score: 1, show: { id: 'not-a-number' } }]));

    await expect(fetchShows('murder')).rejects.toBeInstanceOf(ZodError);
  });
});
