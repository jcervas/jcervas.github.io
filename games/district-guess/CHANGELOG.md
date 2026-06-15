# District Guess — Changelog

---

## v1.4.5 — Result Modal & Map Label Polish

- **Result modal layout**: avg-time/guesses line moved below guess distribution; `result-time-line` gets a surface-alt background pill; `rstat-avg-time` drops its background and is now plain muted text
- **Avg guesses stat**: result modal now shows average number of guesses among correctly solved games (weighted from `guessDist`), alongside average solve time
- **Result answer code**: font-size clamped (`clamp(0.95rem, 3vw, 1.75rem)`) so long district names take less vertical space
- **result-message hidden on short viewports**: `@media (max-height: 720px)` hides the win/lose message to prevent scrolling
- **NE callout label collision avoidance**: small-state labels (VT, NH, MA, RI, CT, NJ, DE, MD) now start at each state's actual centroid Y and use iterative relaxation to push overlapping labels apart, rather than a fixed step from the topmost anchor
- **Wordmark SVG**: `wordmark.svg` created as vector paths (Barlow 800 outlines via Inkscape) — no font dependency, `fill="currentColor"` for theming

---

## v1.4.3 — UX Polish: Welcome Back, Confetti & Map Fixes

- **Welcome back screen**: returning to an in-progress game shows "Welcome Back", guess count ("You've made N of 6 guesses. Keep it up!"), and a "Continue" button instead of "Play" — built after `init()` resolves so game state is accurate
- **Confetti on win**: colorful canvas confetti animation fires when the result modal opens on a correct district guess
- **State zoom fixed**: district selection map now fits the full state extent instead of over-zooming based on district count; district boundaries fade in at zoom > 2× so users can see which area each circle belongs to
- **Star ratings fixed**: feedback form star clicks now correctly highlight stars and store values via hidden inputs
- **"STATISTICS" heading removed** from result modal to save space
- **Force simulation on zoom**: district icon positions re-tune (smaller collision radius, stronger centroid pull) as user zooms in, so icons migrate toward their true geographic inner points

---

## v1.4.0.1 — Patch: District Tiles & Result Modal Polish

- **Result modal**: removed redundant district name sub-line; tightened spacing around answer, message, and stats; smaller action buttons and stat numbers; district preview fills 35% of viewport height on mobile with container-fitted SVG projection
- **District tiles zoom**: icons, labels, and connector lines now scale correctly at any zoom level — visual radius stays constant (13px), connector lines hide above 1.5× zoom, force attraction strengthens with zoom so icons stay near their inner point and don't drift into water
- **Daily vs. random games**: first game each day is the same for all players (date seed); subsequent "New Map" games use a per-user random seed persisted in sessionStorage
- **Icon positioning**: force attraction strength scales with zoom (0.6 at 1×, ~0.98 at 4×+) so icons lock tightly to their inner point when zoomed in

## v1.4 — Mobile Polish & Scoring Fix

- **Mobile hint bar**: previous revealed cards collapse to icon-only strip; tap any to open the hints modal showing all clues
- **District map auto-zoom**: after eliminations, map zooms to fit remaining possible districts; user's manual zoom is preserved across rebuilds; resets when a new state is selected
- **Reference map aspect ratio**: district tiles SVG viewBox now adapts to container dimensions and state shape (wide states like TN get a short map; tall states like CA fill the full height)
- **Guess scoring fix**: only wrong guesses count; winning moves (correct-state unlock and correct-district pick) are free (perfect game = 1; 2 wrongs + correct = 2)
- **Guess counter spacing**: more padding above, less below

## v1.35 — Hint Cards Redesign
- Replaced single expanding hint bar with a horizontal scrollable card row
- Each clue gets its own card: locked cards show a lock icon; revealed cards show icon + label + value
- Latest revealed card highlighted with accent border and reveal animation
- Desktop: all values always visible; mobile: tap a card to expand/collapse value
- Hint bar repositioned between main map and reference panel
- Expand button removed (all hints inline)

## v1.34 — 2024 ACS Data & Game-Over Redesign
- Updated ACS data source to 2024 (2020–2024 5-year ACS); UI label updated accordingly
- Fixed missing districts (387 → 435) by replacing Census decennial API calls with block-count crosswalk weights derived from Block Assignment Files
- Share text redesigned: removed date, shows outcome summary + link (unlimited play)
- On game over: main map collapses; reference panel expands to full width
- All result modal tabs share a single district preview above the tab row
- Copyright line added to How to Play modal (Jonathan Cervas & Jason Fierman)

## v1.33 — Game-Over Map Improvements
- Reference map zooms to answer district with surrounding context after game over
- Answer district filled theme-aware (white in dark mode, near-black in light mode)
- All other districts rendered with transparent fill + boundary strokes only
- "Already Played" banner persists after result modal is dismissed and before new game starts
- State outline and other-district boundaries rendered in muted tone for context

## v1.32 — Compactness Metrics & ACS in TopoJSON
- Added district compactness metrics: area (sq mi), Polsby-Popper, Reock — computed via `redistmetrics` R package
- ACS demographic data embedded directly in TopoJSON at build time (no runtime Census API calls)
- Reference map: zoom and pan enabled with `d3.zoom()` (scale range 0.5–20×, double-click disabled)
- Fixed map dragging behavior after D3 zoom integration

## v1.31 — Polish & Bug Fixes
- Refined beta badge styling and map background rendering
- Fixed dark mode district highlight (was white/invisible; now theme-aware)
- Fixed share text: correct guess count and replaced color emojis with ✓/✗ symbols
- Added "Correct!" indicator in correct-guess rows in the Guesses tab

## v1.3 — TopoJSON Pipeline & D3 Overhaul
- Replaced static GeoJSON with a custom TopoJSON build pipeline (`build-map.sh` / `build_national.sh`)
- TopoJSON bundles five layers: districts, state boundaries, urban areas, roads, inner points (~4.6 MB)
- D3 overlay renders in stages: roads → urban areas → state outline → district highlight
- 2026 district boundaries used throughout
- District tiles rendered via D3 with full state boundary context
- Game-over view shows district with surrounding state districts

## v1.2 — Hint Bar, Census Cards & Layout
- Added progressive hint bar with clue icons, labels, and values (one hint unlocked per wrong guess)
- Result modal "District Profile" tab with census demographic cards
- State outline layer added to D3 reference map
- Viewport layout improvements; reference panel positioned below main map
- Modal sizing fixed (no longer shifts between tabs)

## v1.11 — Hints Modal & UX Refinements
- Hints modal added (accessible via button; auto-opens on first visit)
- D3-based reference map replaces Leaflet for US state selection
- "Guesses" tab added to result modal
- Beta badge introduced with version number
- Clues reordered: size → state delegation → median income → racial plurality → partisanship → state

## v1.1 — Hot/Cold Elimination & Interactivity
- Hot/cold elimination on wrong state guesses: adjacent states stay in play; non-adjacent states + all their neighbors eliminated and greyed out
- State chips list greyed out as states are eliminated; count updated dynamically
- District tiles replace district dropdown after correct state guess
- Clickable US reference map auto-submits on state click
- Correct/wrong flash animation on state guess
- Play Again button added (no page reload required)

## v1.0 — Beta Launch
- Two-phase guessing: select state first, then district number
- Clickable D3 AlbersUSA reference map with state chips
- Progressive clue reveal: one new clue unlocked per wrong guess
- Six guesses per game (Wordle-style)
- Dark / light mode toggle with CMU color scheme
- Timer starts on first guess submission
- Leaderboard with today / all-time / personal tabs (Firebase Firestore)
- Feedback form (opens mailto to cervas@cmu.edu & jafierman@gmail.com)
- Share result + Post to X buttons
- Partisanship clue: 2024 presidential margin (D+/R+)
- Donate to CMU link in header and result modal
- Color-blind-accessible guess counter (shapes, not just colors)
- Copyright: Jonathan Cervas & Jason Fierman

---

## Pre-Release Development Milestones

### Map Pipeline
- Integrated mapshaper simplification (10%) with intersection repair
- State boundary dissolve from district features
- Inner centroid points for label placement
- Roads (TIGER) and urban area (Census) layers simplified and clipped

### Data Pipeline
- ACS tract-level data aggregated to districts via Block Assignment Files (BAF)
- Tract → district crosswalk weighted by block counts (proxy for population)
- Connecticut handled separately (2021 ACS; Planning Region FIPS issue)
- Compactness metrics computed in R via `redistmetrics` package and joined at build time

### UI Foundations
- CSS custom properties for theming (`--accent`, `--surface`, `--border`, `--text`, `--muted`, `--radius`, `--shadow`)
- CSS `flex: 0 0 0%` + `opacity: 0` + transition for smooth map collapse on game over
- D3 projection: `geoMercator().fitExtent()` with manual scale-back for zoom-with-context
- SVG draw order: state fills → boundary strokes → district highlight rendered on top
