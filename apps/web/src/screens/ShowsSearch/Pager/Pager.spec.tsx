import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Pager } from './index';

function renderPager(page: number, pageCount: number) {
  const onPageChange = vi.fn();
  const { container } = render(
    <Pager page={page} pageCount={pageCount} onPageChange={onPageChange} />,
  );
  return { container, onPageChange };
}

describe('Pager', () => {
  it.each([0, 1])('is hidden with %i Pages', (pageCount) => {
    const { container } = renderPager(1, pageCount);

    expect(container.innerHTML).toBe('');
  });

  it('marks the current Page and disables previous on the first Page', () => {
    renderPager(1, 3);

    const current = screen.getByRole('button', { name: 'Page 1' });
    expect(current.getAttribute('aria-current')).toBe('page');
    expect(
      screen
        .getByRole('button', { name: 'Page 2' })
        .hasAttribute('aria-current'),
    ).toBe(false);
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toHaveProperty('disabled', true);
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveProperty(
      'disabled',
      false,
    );
  });

  it('asks for the picked, previous and next Page', async () => {
    const { onPageChange } = renderPager(2, 3);

    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    await userEvent.click(
      screen.getByRole('button', { name: 'Previous page' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));

    expect(onPageChange.mock.calls).toEqual([[3], [1], [3]]);
  });

  it('renders buttons, not links', () => {
    renderPager(1, 2);

    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
