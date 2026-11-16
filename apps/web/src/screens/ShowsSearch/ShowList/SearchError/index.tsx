import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
} from '@tv-shows-explorer/ui-kit';

export type SearchErrorProps = {
  isRetrying: boolean;
  onRetry: () => void;
};

export function SearchError(props: SearchErrorProps) {
  return (
    <Alert
      variant="destructive"
      className="flex flex-wrap items-center justify-between gap-4 border-2 border-current bg-transparent px-4 py-4"
    >
      <div className="grid gap-1">
        <AlertTitle className="col-start-auto font-display text-2xl font-normal">
          Could not load shows
        </AlertTitle>
        <AlertDescription className="col-start-auto text-foreground">
          Check your connection and try again.
        </AlertDescription>
      </div>
      <Button
        variant="outline"
        aria-busy={props.isRetrying}
        disabled={props.isRetrying}
        onClick={props.onRetry}
        className="border-foreground bg-transparent text-foreground shadow-none"
      >
        Retry
      </Button>
    </Alert>
  );
}
