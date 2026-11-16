import { LoadingRows } from './LoadingRows';
import { SearchError } from './SearchError';
import { ShowCard } from './ShowCard';
import { type ShowListProps, usePresenter } from './usePresenter';

export function ShowList(props: ShowListProps) {
  const { state, emptyMessage } = usePresenter(props);

  if (state === 'idle') {
    return (
      <p className="border-t-2 border-foreground pt-4 text-muted-foreground">
        Type a title to search the listings.
      </p>
    );
  }
  if (state === 'loading') return <LoadingRows />;
  if (state === 'error') {
    return (
      <SearchError isRetrying={props.isRetrying} onRetry={props.onRetry} />
    );
  }
  if (state === 'empty') {
    return (
      <p className="border-t-2 border-foreground pt-4 text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }
  return (
    <ul
      ref={props.resultsRef}
      tabIndex={-1}
      aria-label="Shows"
      aria-busy={props.isRefreshing}
      className="scroll-mt-6 border-t-2 border-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring focus-visible:outline-solid aria-busy:opacity-40 motion-safe:transition-opacity"
    >
      {props.shows.map((show) => (
        <li key={show.id}>
          <ShowCard show={show} />
        </li>
      ))}
    </ul>
  );
}
