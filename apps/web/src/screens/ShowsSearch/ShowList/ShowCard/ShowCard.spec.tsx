import { render, screen } from '@testing-library/react';
import { makeShow } from '../../__fixtures__/makeShow';
import { ShowCard } from './index';

describe('ShowCard', () => {
  it('shows the poster with its alt text', () => {
    render(
      <ShowCard
        show={makeShow({
          name: 'Murder, She Wrote',
          posterUrl: 'https://static.tvmaze.com/poster.jpg',
        })}
      />,
    );

    expect(
      screen.getByRole('img', { name: 'Poster of Murder, She Wrote' }),
    ).toBeTruthy();
  });

  it('keeps the initials placeholder out of the accessibility tree', () => {
    render(<ShowCard show={makeShow({ name: 'Murder, She Wrote' })} />);

    const placeholder = screen.getByText('MS');
    expect(placeholder.getAttribute('aria-hidden')).toBe('true');
    expect(screen.queryByRole('img')).toBeNull();
  });
});
