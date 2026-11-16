# TV Shows Explorer

A React app for finding TV shows through the [TVmaze API](https://www.tvmaze.com/api): search by title, narrow the results by genre, and page through them.

The project is a take on **Simple Architecture**, a frontend architecture based on Robert C. Martin's _Clean Architecture_. Its rules are written down in [docs/simple-architecture.md](docs/simple-architecture.md) and grow as the architecture evolves.

## Stack

Nx monorepo on bun · React 19 + Vite · Tailwind CSS v4 + shadcn/ui · TanStack Query · zod · Vitest

## Docs

- Architecture: [docs/simple-architecture.md](docs/simple-architecture.md)
- Glossary: [GLOSSARY.md](GLOSSARY.md)
- Requirements: [docs/requirements/01-tv-shows-explorer.md](docs/requirements/01-tv-shows-explorer.md)
- Implementation plan: [docs/plans/01-tv-shows-explorer.md](docs/plans/01-tv-shows-explorer.md)

## Getting started

```bash
bun install
bun nx dev web
```

Run every check:

```bash
bun nx run-many -t lint test typecheck build
```

## Deploy

The app is hosted on Vercel. To set it up, import the GitHub repository on [vercel.com](https://vercel.com/new) and keep the root directory as the repository root. Everything else (install and build commands, output directory, SPA routing) comes from [vercel.json](vercel.json), so there is nothing else to configure.

The install command pins Bun to the version in `packageManager` in `package.json`. When you upgrade Bun, update both.
