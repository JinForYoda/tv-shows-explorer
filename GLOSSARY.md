# TV Shows Explorer

A React app for finding TV shows through the TVmaze API: search, genre filtering and paging. It is a take on Simple
Architecture.

## Architecture

**Block**:
A node of the UI tree: a folder holding the View and Presenter of one piece of the screen. Child blocks are nested
folders.
_Avoid_: module, feature, widget, component (for a tree node)

**Screen**:
The root Block of one screen of the app.
_Avoid_: page, route, view (for the root)

**View**:
A block's `index.tsx`: a component that only renders and gets everything it needs from its Presenter or props.
_Avoid_: component, template

**Presenter**:
A block's `usePresenter` hook: the single entry point for logic into the View.
_Avoid_: controller, container, hook (unqualified)

**ui-kit**:
The set of dumb visual components with no business logic and no Presenters.
_Avoid_: shared, common, design system

## Domain

**Show**:
A TV series or show from the TVmaze catalogue, as the app sees it.
_Avoid_: series, tv-show, item

**Search Query**:
The text the user enters to find Shows; TVmaze does the filtering by it.
_Avoid_: term, keyword, filter (for the search text)

**Genre**:
A genre TVmaze assigns to a Show; a Show has zero or more.
_Avoid_: category, tag

**Genre Filter**:
The Genre the user picked to narrow the current search results to Shows of that Genre; when none is picked, all
results show.
_Avoid_: tag filter, category filter

**Page**:
A slice of three Shows of the filtered search results; the user moves between Pages by number.
_Avoid_: screen, chunk, slice
