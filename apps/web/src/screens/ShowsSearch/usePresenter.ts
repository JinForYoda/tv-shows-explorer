import { type RefObject, useEffect, useRef, useState } from 'react';
import { collectGenres, type GenreCount } from './collectGenres';
import { filterByGenre } from './filterByGenre';
import { focusResults } from './focusResults';
import type { Genre, Show } from './lib/show.types';
import { paginate } from './paginate';
import { isStatusVisible, toStatusLabel } from './toStatusLabel';
import { type ShowsSearchResult, useShowsSearch } from './useShowsSearch';

export type ShowsSearchPresenter = {
  searchQuery: string;
  genreFilter: Genre | null;
  page: number;
  pageCount: number;
  status: ShowsSearchResult['status'];
  isRefreshing: boolean;
  isRetrying: boolean;
  shows: Show[];
  genres: GenreCount[];
  resultCount: number;
  filteredCount: number;
  statusLabel: string;
  isStatusVisible: boolean;
  resultsRef: RefObject<HTMLUListElement | null>;
  onSearch: (text: string) => void;
  onGenreFilterChange: (genre: Genre | null) => void;
  onPageChange: (page: number) => void;
  retry: () => void;
};

export function usePresenter(): ShowsSearchPresenter {
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState<Genre | null>(null);
  const [page, setPage] = useState(1);
  // A counter, not a flag: picking the Page already shown must still move focus to the results.
  const [resultsFocusRequest, setResultsFocusRequest] = useState(0);
  const resultsRef = useRef<HTMLUListElement>(null);
  const { status, shows, isRefreshing, isRetrying, retry } =
    useShowsSearch(searchQuery);

  const filteredShows = filterByGenre(shows, genreFilter);
  const currentPage = paginate(filteredShows, page);

  useEffect(() => {
    if (resultsFocusRequest > 0) focusResults(resultsRef.current);
  }, [resultsFocusRequest]);

  const onSearch = (text: string) => {
    const nextSearchQuery = text.trim();
    if (nextSearchQuery === searchQuery) return;
    setSearchQuery(nextSearchQuery);
    setGenreFilter(null);
    setPage(1);
  };

  const onGenreFilterChange = (genre: Genre | null) => {
    setGenreFilter(genre === genreFilter ? null : genre);
    setPage(1);
  };

  const onPageChange = (nextPage: number) => {
    setPage(nextPage);
    setResultsFocusRequest((request) => request + 1);
  };

  const statusInput = {
    status,
    isRefreshing,
    filteredCount: filteredShows.length,
    resultCount: shows.length,
  };

  return {
    searchQuery,
    genreFilter,
    page: currentPage.page,
    pageCount: currentPage.pageCount,
    status,
    isRefreshing,
    isRetrying,
    shows: currentPage.shows,
    genres: collectGenres(shows),
    resultCount: shows.length,
    filteredCount: filteredShows.length,
    statusLabel: toStatusLabel(statusInput),
    isStatusVisible: isStatusVisible(statusInput),
    resultsRef,
    onSearch,
    onGenreFilterChange,
    onPageChange,
    retry,
  };
}
