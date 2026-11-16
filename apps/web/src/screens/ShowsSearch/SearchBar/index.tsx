import { Button, Input } from '@tv-shows-explorer/ui-kit';
import { type SearchBarProps, usePresenter } from './usePresenter';

export function SearchBar(props: SearchBarProps) {
  const { draft, canClear, inputRef, onDraftChange, onSubmit, onClear } =
    usePresenter(props);

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="relative w-full sm:max-w-sm"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-70"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <Input
        ref={inputRef}
        type="search"
        aria-label="Search shows"
        placeholder="Search by title, e.g. murder"
        autoComplete="off"
        value={draft}
        onChange={onDraftChange}
        className="h-11 border-foreground bg-card pr-11 pl-9 shadow-none md:text-base dark:bg-card [&::-webkit-search-cancel-button]:appearance-none"
      />
      {canClear && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Clear search"
          onClick={onClear}
          className="absolute top-1/2 right-1.5 -translate-y-1/2 text-lg"
        >
          <span aria-hidden="true">×</span>
        </Button>
      )}
    </form>
  );
}
