import { type ShowCardProps, usePresenter } from './usePresenter';

export function ShowCard(props: ShowCardProps) {
  const { yearLabel, ratingLabel, posterAlt, posterInitials } =
    usePresenter(props);

  return (
    <article className="group flex border-b border-foreground">
      <div className="w-23 shrink-0 p-2.5">
        {props.show.posterUrl ? (
          <img
            src={props.show.posterUrl}
            alt={posterAlt}
            loading="lazy"
            className="aspect-[2/3] w-full object-cover contrast-125 grayscale group-hover:grayscale-0 motion-safe:transition-[filter] motion-safe:duration-300"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid aspect-[2/3] w-full place-items-center bg-muted font-display text-3xl text-muted-foreground italic"
          >
            {posterInitials}
          </div>
        )}
      </div>
      <div className="grid min-w-0 flex-1 content-start gap-x-4.5 gap-y-2 py-3.5 pr-1 pl-4.5 sm:grid-cols-[4.5rem_minmax(0,1fr)]">
        <p className="flex gap-2.5 text-sm font-medium text-primary tabular-nums sm:row-span-3 sm:flex-col sm:gap-0.5">
          <span>{yearLabel}</span>
          <span>{ratingLabel}</span>
        </p>
        <h2 className="font-display text-[1.625rem] leading-[1.1] wrap-break-word group-hover:text-primary motion-safe:transition-colors">
          {props.show.name}
        </h2>
        <ul aria-label="Genres" className="flex flex-wrap gap-1.5 empty:hidden">
          {props.show.genres.map((genre) => (
            <li
              key={genre}
              className="border border-foreground px-2 py-0.5 text-[0.6875rem] tracking-[0.06em] uppercase"
            >
              {genre}
            </li>
          ))}
        </ul>
        <p className="line-clamp-2 text-[0.8125rem] text-muted-foreground empty:hidden">
          {props.show.summary}
        </p>
      </div>
    </article>
  );
}
