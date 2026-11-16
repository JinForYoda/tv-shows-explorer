import { focusResults } from './focusResults';

function makeResults() {
  const results = document.createElement('ul');
  results.tabIndex = -1;
  results.scrollIntoView = vi.fn();
  document.body.append(results);
  return results;
}

function preferReducedMotion(matches: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: matches && query === '(prefers-reduced-motion: reduce)',
  }));
}

describe('focusResults', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.replaceChildren();
  });

  it('focuses the results and scrolls them into view smoothly', () => {
    preferReducedMotion(false);
    const results = makeResults();

    focusResults(results);

    expect(document.activeElement).toBe(results);
    expect(results.scrollIntoView).toHaveBeenCalledExactlyOnceWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('jumps without smooth scrolling when reduced motion is preferred', () => {
    preferReducedMotion(true);
    const results = makeResults();

    focusResults(results);

    expect(results.scrollIntoView).toHaveBeenCalledExactlyOnceWith({
      behavior: 'auto',
      block: 'start',
    });
  });

  it('does nothing without results on screen', () => {
    expect(() => focusResults(null)).not.toThrow();
  });
});
