import type { Show } from '../lib/show.types';

export function makeShow(overrides: Partial<Show> = {}): Show {
  return {
    id: 1,
    name: 'Show',
    premiereYear: null,
    rating: null,
    genres: [],
    posterUrl: null,
    summary: '',
    ...overrides,
  };
}
