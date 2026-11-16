import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { makeShow } from './__fixtures__/makeShow';
import { sevenShows } from './__fixtures__/makeShowsSearchResult';
import { fetchShows } from './fetchShows';
import { ShowsSearch } from './index';

vi.mock('./fetchShows');

const fetchShowsMock = vi.mocked(fetchShows);

const murderShows = sevenShows.map((show) => ({
  ...show,
  name: `Murder ${show.id}`,
}));

function renderScreen() {
  const queryClient = new QueryClient({
    // The hook's own retry: 1 still applies; only the backoff between attempts is removed.
    defaultOptions: { queries: { retryDelay: 0 } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <ShowsSearch />
    </QueryClientProvider>,
  );
  return userEvent.setup();
}

function shownTitles() {
  const list = screen.getByRole('list', { name: 'Shows' });
  return within(list)
    .getAllByRole('heading')
    .map((heading) => heading.textContent);
}

function shownList() {
  return screen.getByRole('list', { name: 'Shows' });
}

function currentPage() {
  return screen
    .getByRole('navigation', { name: 'Pages' })
    .querySelector('[aria-current="page"]')?.textContent;
}

describe('ShowsSearch', () => {
  beforeEach(() => {
    // jsdom implements neither, and a Page change scrolls the results into view.
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    fetchShowsMock.mockReset();
    vi.unstubAllGlobals();
    Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
  });

  it('searches, filters by Genre, pages and retries', async () => {
    fetchShowsMock.mockResolvedValue(murderShows);
    const user = renderScreen();
    expect(
      screen.getByText('Type a title to search the listings.'),
    ).toBeTruthy();

    await user.type(
      screen.getByRole('searchbox', { name: 'Search shows' }),
      'murder',
    );

    expect(await screen.findByText('7 of 7 shows')).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe('7 of 7 shows');
    expect(fetchShowsMock).toHaveBeenCalledExactlyOnceWith(
      'murder',
      expect.any(AbortSignal),
    );
    expect(shownTitles()).toEqual(['Murder 1', 'Murder 2', 'Murder 3']);

    await user.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(shownTitles()).toEqual(['Murder 4', 'Murder 5', 'Murder 6']);
    expect(document.activeElement).toBe(shownList());

    await user.click(screen.getByRole('radio', { name: 'Drama, 3 shows' }));
    expect(screen.getByText('3 of 7 shows')).toBeTruthy();
    expect(shownTitles()).toEqual(['Murder 1', 'Murder 3', 'Murder 6']);
    expect(screen.queryByRole('navigation', { name: 'Pages' })).toBeNull();

    await user.click(screen.getByRole('radio', { name: 'All genres' }));
    expect(currentPage()).toBe('1');

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(currentPage()).toBe('2');
    expect(document.activeElement).toBe(shownList());
    expect(shownTitles()).toEqual(['Murder 4', 'Murder 5', 'Murder 6']);

    fetchShowsMock.mockReset();
    fetchShowsMock.mockRejectedValue(new Error('TVmaze is down'));
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(
      screen.getByText('Type a title to search the listings.'),
    ).toBeTruthy();
    await user.type(
      screen.getByRole('searchbox', { name: 'Search shows' }),
      'law{Enter}',
    );
    expect(await screen.findByRole('alert')).toBeTruthy();

    fetchShowsMock.mockResolvedValue([
      makeShow({ id: 8, name: 'Law & Order' }),
    ]);
    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('1 of 1 shows')).toBeTruthy();
    expect(shownTitles()).toEqual(['Law & Order']);
  });
});
