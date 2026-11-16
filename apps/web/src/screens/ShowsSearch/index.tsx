import { GenreFilter } from './GenreFilter';
import { Pager } from './Pager';
import { SearchBar } from './SearchBar';
import { ShowList } from './ShowList';
import { usePresenter } from './usePresenter';

export function ShowsSearch() {
  const presenter = usePresenter();

  return (
    <main className="mx-auto grid max-w-3xl gap-6 px-4 py-10 sm:py-14">
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <h1 className="font-display text-5xl leading-none italic">
          TV Shows Explorer
        </h1>
        <SearchBar onSearch={presenter.onSearch} />
      </header>
      {/* sr-only rather than hidden while empty: a live region must stay in the accessibility tree to be announced. */}
      <p
        role="status"
        className={`text-[0.8125rem] text-muted-foreground empty:sr-only ${presenter.isStatusVisible ? '' : 'sr-only'}`}
      >
        {presenter.statusLabel}
      </p>
      <GenreFilter
        genres={presenter.genres}
        genreFilter={presenter.genreFilter}
        onGenreFilterChange={presenter.onGenreFilterChange}
      />
      <ShowList
        status={presenter.status}
        isRefreshing={presenter.isRefreshing}
        isRetrying={presenter.isRetrying}
        shows={presenter.shows}
        searchQuery={presenter.searchQuery}
        genreFilter={presenter.genreFilter}
        onRetry={presenter.retry}
        resultsRef={presenter.resultsRef}
      />
      <Pager
        page={presenter.page}
        pageCount={presenter.pageCount}
        onPageChange={presenter.onPageChange}
      />
    </main>
  );
}
