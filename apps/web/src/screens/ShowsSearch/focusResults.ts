const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function focusResults(results: HTMLElement | null) {
  if (!results) return;
  // focus() alone jumps to the element instantly; preventScroll hands the scroll to scrollIntoView, which can be smooth.
  results.focus({ preventScroll: true });
  const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  results.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  });
}
