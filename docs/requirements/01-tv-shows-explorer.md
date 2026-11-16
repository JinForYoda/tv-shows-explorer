# Requirements — TV Shows Explorer

A small app for searching and browsing TV shows through the public TVmaze API.

## 1. Show search

Shows come from `https://api.tvmaze.com/search/shows?q=banana`, where `q` is any search query.

- At first the app shows only the search field and an empty list.
- The user types a query and the app fetches results from TVmaze.
- The API does the filtering by the query.

## 2. List and pagination

- Shows are displayed as a list or as cards.
- Pagination: 3 items per page, and the user can move between pages.

## 3. Genre filter

- Above the list, every unique genre of the current results is shown as a clickable chip.
- Picking a genre keeps only the shows of that genre.
- The filter can be reset to return to all results.

Example: the query `Murder` returns 10 shows. Clicking `Comedy` keeps only the 2 comedies.

## 4. Additional notes

- There is no design; the look is up to us.
- Think through the UX: don't send a request on every keystroke, cancel stale requests, show loading and error states.
- Optional challenge: handle requests without `useQuery`. This project uses `useQuery`.
