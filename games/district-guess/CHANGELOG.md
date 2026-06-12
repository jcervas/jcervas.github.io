# District Guess — Changelog

## v1.35 (current) — Hint Cards Redesign
- Replaced single expanding hint bar with a horizontal scrollable card row
- Each clue gets its own card: locked cards show a lock icon, revealed cards show label + value
- Latest revealed card highlighted with accent border
- Desktop: all values always visible; mobile: tap a card to expand its value
- Hint bar repositioned between main map and reference panel
- Expand button removed (all hints visible inline)

## v1.34 — 2024 ACS Data & Game-Over Redesign
- Updated ACS data source from 2022 to 2024 (2020–2024 5-year ACS)
- Fixed missing districts (387 → 435) by replacing Census decennial API calls with block-count crosswalk weights
- ACS source label in UI updated to "2024"
- Share text redesigned: removed date, added outcome summary, game URL
- On game over: main map collapses, reference panel expands to full width
- All district tabs in result modal use a single shared district preview (above tabs)

## v1.33 — Game-Over Map Improvements
- Reference map zooms to the answer district with surrounding context after game over
- Answer district filled in theme-aware color (white in dark mode, near-black in light)
- All other districts shown with transparent fill + boundary strokes only
- "Already Played" banner persists after result modal is dismissed
- Result modal district preview unified across all tabs

## v1.32 — Compactness & ACS Integration
- Added compactness metrics (area, Polsby-Popper, Reock) via `redistmetrics` R package
- ACS demographic data embedded directly in TopoJSON (no runtime Census API calls)
- Reference map: zoom and pan enabled (`d3.zoom`, scale 0.5–20×)
- Fixed map dragging behavior

## v1.31 — Polish & Fixes
- Refined beta badge and map background styling
- Map overlay polish (dark mode district highlight fixed from white to theme-aware color)
- Fixed share text: correct guess count, replaced color emojis with ✓/✗
- Added "Correct!" indicator to correct guess rows in result modal

## v1.3 — TopoJSON Pipeline & D3 Overhaul
- Replaced static GeoJSON with custom TopoJSON pipeline (`build-map.sh`)
- TopoJSON bundles districts, state boundaries, urban areas, and roads (4.6 MB)
- D3-rendered overlay with staged reveal (roads → urban → state → district)
- Game-over view shows full district context in reference map
- District tiles rendered via D3 with state boundary context
- 2026 district boundaries used throughout

## v1.2 — Hint Bar & Layout
- Added scrollable hint bar with clue icons and labels
- Viewport layout improvements; reference panel below map
- Census data cards in result modal ("District Profile" tab)
- State outline rendering in D3 reference map

## v1.1 — Hints Modal & UX
- Hints modal with progressive clue reveal
- Hot/cold elimination: adjacent states stay in play, non-adjacent states + neighbors eliminated
- D3-based district map replacing Leaflet
- Guesses tab added to result modal
- Beta badge introduced

## v1.0 — Beta Launch
- Two-phase guessing: state first, then district number
- Clickable US reference map with state chips
- Hot/cold feedback on wrong state guesses
- Dark/light mode toggle
- Timer (starts on first guess)
- Leaderboard (Firebase Firestore)
- Feedback form (mailto)
- Share / Post to X result
- Partisanship clue (2024 presidential margin)
- "Donate to CMU" link
- Copyright: Jonathan Cervas & Jason Fierman
