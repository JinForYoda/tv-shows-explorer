import type { Show } from '../../lib/show.types';

export type ShowCardProps = {
  show: Show;
};

function toInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word.match(/[\p{L}\p{N}]/u)?.[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function usePresenter({ show }: ShowCardProps) {
  return {
    yearLabel: show.premiereYear === null ? '—' : String(show.premiereYear),
    ratingLabel:
      show.rating === null ? 'no rating' : `★ ${show.rating.toFixed(1)}`,
    posterAlt: `Poster of ${show.name}`,
    posterInitials: toInitials(show.name),
  };
}
