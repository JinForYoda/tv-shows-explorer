# Simple Architecture

The frontend architecture of this repository, based on Robert C. Martin's _Clean Architecture_. It grows stage by
stage. The acronym is **VIPER**: each letter is a layer.

| Letter | Layer     | Status          |
| ------ | --------- | --------------- |
| V      | View      | Stage 1         |
| I      | —         | not defined yet |
| P      | Presenter | Stage 1         |
| E      | —         | not defined yet |
| R      | —         | not defined yet |

Terms (Block, Screen, View, Presenter, ui-kit) are defined in [GLOSSARY.md](../GLOSSARY.md).

---

## Stage 1 — View + Presenter

### Rule 1. The View is the end point

A block's `index.tsx` is its View: a React component that only renders.

- A View calls exactly one logic hook: `usePresenter(props)`.
- The only exception is `useTranslation`, because i18n belongs to rendering. This project has no i18n.
- Any other hook (`useState`, `useEffect`, `useRef`, `useQuery`, …) is logic and lives in the presenter.
- Props that are only needed for rendering may be read by the View directly (`props.title`) without going through
  the presenter.
- Enforced by ESLint (`no-restricted-syntax` for `src/screens/**/index.tsx` in `apps/web/eslint.config.mjs`).

```tsx
export function ShowCard(props: ShowCardProps) {
  const { ratingLabel, summary } = usePresenter(props);

  return (
    <article>
      <h3>{props.title}</h3>
      <span>{ratingLabel}</span>
      <p>{summary}</p>
    </article>
  );
}
```

### Rule 2. The Presenter is the entry point for logic

`usePresenter.ts` is a hook that gives the View everything it needs to render: ready-made values and handlers.
In stage 1 all of a block's business logic lives in it or behind it.

### Rule 3. The folder structure is a tree of blocks

When a block on screen has a child, the child gets its own folder, with its own View and Presenter, inside the
parent's folder. The folder tree mirrors the block tree on screen.

A block gets a `usePresenter.ts` only when it has at least one computation or handler. A block that only renders its
props is a single `index.tsx`; an empty presenter returning `{}` is not created.

```
Navbar/
├── index.tsx          ← View
├── usePresenter.ts    ← Presenter
└── Avatar/
    ├── index.tsx
    └── usePresenter.ts
```

### Rule 4. `components/` and `lib/` — reuse within a subtree

Any level of the tree may have:

- `components/` — blocks (same shape: View + Presenter) used in **2+ places** at this level or below;
- `lib/` — non-components (functions, types, helper hooks) under the same "2+ consumers at this level or below" rule.

Anything only one block needs lives in that block's folder.

### Rule 5. Small, atomic files

Every file has at most **120 lines of code** (blank lines and comments excluded). Enforced by ESLint (`max-lines` in
the root `eslint.config.mjs`).

### Rule 6. The Presenter does not have to hold all the logic

The presenter is an entry point, not a dumping ground. Logic that is not the block's hook goes into separate atomic
files **next to the block** (`fetchShows.ts`, `collectGenres.ts`). Only the presenter imports them; the View does not.

### Rule 7. No `shared/`

There is no `shared` folder. The only exception is the **ui-kit**: dumb reusable components with no business logic and
no presenters. In this repository the ui-kit is the Nx library `libs/ui-kit`. Everything else that is reused lives in
the `components/` or `lib/` of the nearest common ancestor (rule 4).

### Rule 8. Parent → child through props only

In stage 1 a child gets data and callbacks only through props from its parent's View. No context and no stores until
the architecture defines the layers for them.

### Rule 9. The root of the tree is a Screen

The root block of a screen is called a **Screen** and lives in `src/screens/<Name>/`. The word "page" is reserved for
a page of results in pagination, so there is no `pages/` folder.
