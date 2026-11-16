import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders the ShowsSearch Screen with its masthead', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'TV Shows Explorer' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('searchbox', { name: 'Search shows' }),
    ).toBeTruthy();
  });
});
