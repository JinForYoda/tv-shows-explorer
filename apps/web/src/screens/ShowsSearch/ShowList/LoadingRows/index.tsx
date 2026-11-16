import { Skeleton } from '@tv-shows-explorer/ui-kit';

const ROWS = ['first', 'second', 'third'];

export function LoadingRows() {
  return (
    <ul
      aria-label="Loading shows"
      aria-busy="true"
      className="border-t-2 border-foreground"
    >
      {ROWS.map((row) => (
        <li key={row} className="flex border-b border-foreground">
          <div className="w-23 shrink-0 p-2.5">
            <Skeleton className="aspect-[2/3] w-full bg-muted" />
          </div>
          <div className="grid flex-1 content-start gap-y-3 py-3.5 pr-1 pl-4.5 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-x-4.5">
            <Skeleton className="h-4 w-12 bg-muted" />
            <div className="grid gap-3">
              <Skeleton className="h-6 w-3/5 bg-muted" />
              <Skeleton className="h-3 w-1/3 bg-muted" />
              <Skeleton className="h-3 w-full bg-muted" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
