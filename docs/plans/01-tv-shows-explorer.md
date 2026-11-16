# Implementation plan — TV Shows Explorer

Requirements: [docs/requirements/01-tv-shows-explorer.md](../requirements/01-tv-shows-explorer.md).
Rules: [docs/simple-architecture.md](../simple-architecture.md). Terms: [GLOSSARY.md](../../GLOSSARY.md).

## Decisions

| Topic            | Decision                                                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository       | Nx monorepo, bun as package manager. Now `apps/web` + `libs/ui-kit`; `apps/api` (Elysia) comes in stage 2                                       |
| Frontend         | React + strict TypeScript, Vite (`@nx/react`)                                                                                                   |
| UI               | Tailwind v4 + shadcn/ui, components in `libs/ui-kit` (non-buildable lib, alias `@tv-shows-explorer/ui-kit`)                                     |
| Design           | "Listings", a printed TV guide: Instrument Serif + IBM Plex Mono, square corners, red accent; light and dark theme following the system setting |
| Requests         | TanStack Query (`useQuery`); the TVmaze response is validated with zod v4                                                                       |
| Tests            | Vitest + Testing Library (`renderHook`)                                                                                                         |
| Lint             | ESLint: `max-lines: 120`; a View may only call `usePresenter` and `useTranslation`                                                              |
| Deploy           | Vercel Hobby: the SPA now, an Elysia function in stage 2 on the same domain                                                                     |
| State in the URL | no (stage 1)                                                                                                                                    |

## Behaviour

- **Search Query**: SearchBar holds the text being typed and passes it up after a 400 ms debounce. An empty or whitespace-only string sends no request and returns the screen to idle.
- **Request**: `queryKey: ['shows', 'search', query]`, `queryFn` receives `signal` (stale requests are cancelled), `enabled` only for a non-empty query, `placeholderData: keepPreviousData`, `staleTime` 5 minutes, `retry: 1`.
- **Response**: TVmaze returns at most 10 results with no server-side paging, so the Genre Filter and Pages are computed on the client over one response. A response that fails zod validation is a request error.
- **Genre Filter**: the unique Genres of the current response as chips with a count (`Comedy · 2`), plus "All". One Genre at a time; clicking it again or clicking "All" resets the filter. Shows with no Genre appear only under "All".
- **Page**: 3 Shows each. A new Search Query resets the Genre Filter and the Page; a new Genre Filter resets the Page to 1.
- **States**: idle (an invitation to search), first load (skeleton cards), refresh (previous results dimmed), empty, error with a "Retry" button.
- **ShowCard**: poster from `image.medium` with a placeholder, title, premiere year, rating (or "no rating"), Genres, summary without HTML clamped to 2 lines. No show details view.

## Block tree

```
apps/web/src/
├── main.tsx, App.tsx                ← providers (QueryClient), not a Block
└── screens/ShowsSearch/             ← Screen: Search Query, Genre Filter, Page
    ├── index.tsx, usePresenter.ts
    ├── useShowsSearch.ts            ← useQuery
    ├── fetchShows.ts, showSchema.ts, toShow.ts
    ├── collectGenres.ts, paginate.ts
    ├── lib/show.types.ts            ← Show, Genre (inferred from the zod schema)
    ├── SearchBar/   index.tsx, usePresenter.ts
    ├── GenreFilter/ index.tsx
    ├── ShowList/    index.tsx, usePresenter.ts
    │   └── ShowCard/ index.tsx, usePresenter.ts
    └── Pager/       index.tsx
libs/ui-kit/src/                     ← shadcn: button, input, toggle-group, pagination, skeleton, alert
```

## Steps

Each step is one commit; after each one `bun nx run-many -t lint test typecheck build` is green.

1. **Workspace.** `create-nx-workspace` with bun, `apps/web` (React + Vite + Vitest), ESLint, Prettier. Remove the generator's demo code.
2. **ui-kit.** `libs/ui-kit`, Tailwind v4, shadcn inside the lib, the components from the tree above. Listings theme: light/dark colour tokens, fonts, `--radius: 0`. `@source` of the lib in the web app's CSS.
3. **Architecture lint.** `max-lines` / `max-lines-per-function`; `no-restricted-syntax` for `screens/**/index.tsx` forbidding hooks other than `usePresenter` and `useTranslation`. Prove the rule catches a violation.
4. **Data (TDD).** `lib/show.types.ts` (Show inferred from the zod schema), `showSchema.ts`, `toShow.ts` (HTML stripping, fallbacks), `fetchShows.ts` (fetch + zod + `signal`). Tests for mapping and an invalid response.
5. **Pure logic (TDD).** `collectGenres.ts` (unique, sorted, with counts), `paginate.ts` (slice, number of Pages, out-of-range).
6. **Request.** `useShowsSearch.ts` + `QueryClientProvider` in `App.tsx`. `renderHook` tests: disabled on an empty query, a stale request is cancelled.
7. **Screen.** `ShowsSearch/usePresenter.ts`: Search Query, Genre Filter, Page and the resets between them. Tests for the resets.
8. **Blocks.** SearchBar (debounce), GenreFilter, ShowList + ShowCard, Pager. Every state from "Behaviour".
9. **Polish.** Responsive down to 375 px, focus states, `prefers-reduced-motion`, accessible labels for chips and pagination.
10. **Deploy.** `vercel.json` (build through Nx, output `apps/web/dist`). The account owner imports the repository on vercel.com.

## Out of scope for stage 1

- `apps/api` on Elysia + zod (Standard Schema) — stage 2.
- Syncing state with the URL, a show details view, i18n.
