import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { makeShow } from '../__fixtures__/makeShow';
import { ShowList } from './index';
import type { ShowListProps } from './usePresenter';

const shows = [
  makeShow({ id: 1, name: 'Midsomer Murders' }),
  makeShow({ id: 2, name: 'Murder, She Wrote' }),
];

function renderShowList(overrides: Partial<ShowListProps> = {}) {
  const props: ShowListProps = {
    status: 'success',
    isRefreshing: false,
    isRetrying: false,
    shows,
    searchQuery: 'murder',
    genreFilter: null,
    onRetry: vi.fn(),
    resultsRef: createRef(),
    ...overrides,
  };
  render(<ShowList {...props} />);
  return props;
}

describe('ShowList', () => {
  it('invites a search when idle', () => {
    renderShowList({ status: 'idle', shows: [] });

    expect(
      screen.getByText('Type a title to search the listings.'),
    ).toBeTruthy();
  });

  it('shows three skeleton rows while loading', () => {
    renderShowList({ status: 'loading', shows: [] });

    const list = screen.getByRole('list', { name: 'Loading shows' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  });

  it('offers a retry on error', async () => {
    const props = renderShowList({ status: 'error', shows: [] });

    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(props.onRetry).toHaveBeenCalledOnce();
  });

  it('marks the retry button busy while retrying', () => {
    renderShowList({ status: 'error', shows: [], isRetrying: true });

    const retry = screen.getByRole('button', { name: 'Retry' });
    expect(retry.getAttribute('aria-busy')).toBe('true');
    expect(retry).toHaveProperty('disabled', true);
  });

  it.each([
    [null, 'No shows match “murder”.'],
    ['Comedy', 'No shows match “murder” in Comedy.'],
  ])('says nothing matched with Genre Filter %s', (genreFilter, message) => {
    renderShowList({ shows: [], genreFilter });

    expect(screen.getByText(message)).toBeTruthy();
  });

  it('lists the Shows of the current Page', () => {
    renderShowList();

    const list = screen.getByRole('list', { name: 'Shows' });
    expect(list.getAttribute('aria-busy')).toBe('false');
    expect(
      within(list)
        .getAllByRole('heading')
        .map((heading) => heading.textContent),
    ).toEqual(['Midsomer Murders', 'Murder, She Wrote']);
  });

  it('hands the results list to resultsRef as a programmatic focus target', () => {
    const resultsRef = createRef<HTMLUListElement>();
    renderShowList({ resultsRef });

    const list = screen.getByRole('list', { name: 'Shows' });
    expect(resultsRef.current).toBe(list);
    expect(list.getAttribute('tabindex')).toBe('-1');
  });

  it('keeps the rows but marks them busy while refreshing', () => {
    renderShowList({ isRefreshing: true });

    const list = screen.getByRole('list', { name: 'Shows' });
    expect(list.getAttribute('aria-busy')).toBe('true');
    expect(within(list).getAllByRole('article')).toHaveLength(2);
  });

  it('shows skeletons rather than an old empty result while refreshing', () => {
    renderShowList({ shows: [], isRefreshing: true });

    expect(screen.getByRole('list', { name: 'Loading shows' })).toBeTruthy();
  });
});
