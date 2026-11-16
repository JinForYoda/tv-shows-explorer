import type { TvmazeShow } from './showSchema';

const BLOCK_END = /<\/(p|div|li|h[1-6])>|<br\s*\/?>/gi;

function toPremiereYear(premiered: string | null): number | null {
  const year = premiered?.match(/^\d{4}/)?.[0];
  return year ? Number(year) : null;
}

function toPlainText(html: string | null): string {
  if (html === null) return '';
  // textContent glues adjacent paragraphs together ("One.Two."), so block ends get a space first.
  const spaced = html.replace(BLOCK_END, '$& ');
  // DOMParser builds an inert document: scripts never run and images never load.
  const document = new DOMParser().parseFromString(spaced, 'text/html');
  return (document.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}

export function toShow(show: TvmazeShow) {
  return {
    id: show.id,
    name: show.name,
    premiereYear: toPremiereYear(show.premiered),
    rating: show.rating.average,
    genres: show.genres,
    posterUrl: show.image?.medium ?? null,
    summary: toPlainText(show.summary),
  };
}
