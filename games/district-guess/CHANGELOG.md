# District Guess — Changelog

---

## v1.4.6 — Welcome Modal Wordmark & New Map Flow

- **Wordmark SVG in welcome splash**: replaced plain "DAILY DISTRICT" text with `wordmark.svg` (Barlow 800 vector paths, CMU red `#C41230`); scales via `clamp(28px, 5vh, 44px)`
- **"Welcome Back" state**: for in-progress games the wordmark is swapped for a "Welcome Back" heading; CSS `[hidden] { display: none }` added to prevent `display: block` overriding the `hidden` attribute
- **New Map → welcome splash**: after clicking "New Map", the welcome splash now reappears with a fresh "Play" button instead of going straight into the game; `buildWelcomeButtons` lifted to module scope so `startNewMap` can call it after reset
- **`_gameStarted` reset on New Map**: ensures clue/history DOM guards fire correctly for the new game

---

## v1.4.5.1 — Bug Fix: Result Modal Not Blocking Welcome Splash

- **Fix "Back to map" routing**: closing the result modal no longer reveals the welcome splash — `showResult()` now skips auto-opening the modal when the welcome splash is still visible; users reach the result via the "Review Result" button on the welcome screen, which dismisses the splash first

---

## v1.4.5 — Result Modal & Map Label Polish

- **Result modal layout**: avg-time/guesses line moved below guess distribution; `result-time-line` gets a surface-alt background pill; `rstat-avg-time` drops its background and is now plain muted text
- **Avg guesses stat**: result modal now shows average number of guesses among correctly solved games (weighted from `guessDist`), alongside average solve time
- **Result answer code**: font-size clamped (`clamp(0.95rem, 3vw, 1.75rem)`) so long district names take less vertical space
- **result-message hidden on short viewports**: `@media (max-height: 720px)` hides the win/lose message to prevent scrolling on small screens
- **NE callout label collision avoidance**: small-state labels (VT, NH, MA, RI, CT, NJ, DE, MD) now start at each state's actual centroid Y and use iterative relaxation to push overlapping labels apart, rather than stepping from a fixed start point
- **Wordmark SVG**: `wordmark.svg` created as vector path outlines (Barlow 800 via Inkscape) — no font dependency, `fill="currentColor"` for dark/light theming

---

## v1.4.4 — Welcome Splash & Game-Over Polish

- **How to Play link** added to welcome splash above Donate button (small muted underline link)
- **Hint bar hidden on game over**: `#game-controls` no longer shown after game ends (no reason to show hints at that point)
- **Already-played banner fixed on mobile**: removed `position: sticky; top: 46px` that caused the banner to float over content; now `position: static`
- **"Use system default" placement**: moved below the Dark Theme label inside its settings row
- **Title click opens welcome splash**: clicking "Daily District" in the header re-opens the welcome modal

---

## v1.4.3 — Welcome Back, Confetti & Map Fixes

- **Welcome back screen**: returning to an in-progress game shows "Welcome Back", guess count, and a "Continue" button — built after `init()` resolves so game state is accurate
- **Confetti on win**: canvas confetti animation fires when the result modal opens after a correct guess
- **US map zoom fixed**: `Math.max(0.3, fit)` instead of `Math.max(1, fit)` allows scale < 1 so the full country is visible at game start; corners of contiguous US touch the container edges
- **Star ratings fixed**: feedback form star clicks now correctly highlight and store values
- **"STATISTICS" heading removed** from result modal to save space
- **Force simulation on zoom**: district icon positions re-tune (smaller collision radius, stronger centroid pull) as user zooms in
- **Urban/road context layers**: replaced D3 district mesh with road and urban area overlays for better visual context

---

## v1.4.2.1 — Welcome Modal Guards & Hint-Bar Cleanup

- **Welcome modal shown immediately** (before `init()` resolves) so there's no flash of unstyled game content on load
- **Clue/history DOM guarded**: `renderClues()` and `renderGuessHistory()` are no-ops until the welcome splash is dismissed (`_gameStarted` flag)
- **Hints modal lazy population**: `hints-clues-list` is populated only on modal open and cleared on close to avoid stale DOM
- **Locked hint cards**: icon-only in DOM until the clue is earned — label and value rendered only after reveal

---

## v1.4.2 — Performance & Feedback Polish

- **Deferred script loading**: non-critical scripts (Firebase, analytics) loaded after first interaction
- **Lazy Firebase initialization**: Firebase SDK loaded on demand, not at page load
- **Split TopoJSON**: large topology file broken into chunks for faster initial paint
- **Badge stroke scaling fixed**: beta badge stroke no longer scales with zoom transform
- **Feedback modal enhanced**: star rating UI, subject field, improved layout
- **Settings modal added**: dark/light/system theme toggle, confirm-selection mode toggle
- **Welcome modal revamped**: cleaner layout, Donate button pinned to bottom, spacing improvements
- **Map UI tweaks**: zoom buttons (+/−), rotate overlay hint, national backdrop layer
- **Mobile landscape layout**: two-column layout for landscape phones

---

## v1.4.1 — Welcome Modal, Context Map & Result Modal Polish

- **Welcome modal introduced**: shown on every visit; "Play" / "Continue" / "Back to Map" / "Review Result" buttons built after `init()` resolves to reflect restored game state
- **Result modal polished**: tightened spacing, smaller action buttons and stat numbers, district preview fills 35% of viewport height on mobile
- **Context map**: national D3 backdrop rendered behind district map
- **Map logo added** to header alongside wordmark

---

## v1.4.0.1 — Patch: District Icon Zoom & Daily/Random Split

- **District icon zoom**: icons, labels, and connector lines scale correctly at any zoom level; connector lines hide above 1.5×; force attraction strengthens with zoom
- **Daily vs. random games**: first game each day is deterministic (date seed); "New Map" uses per-user random seed in sessionStorage
- **Result modal**: removed redundant district sub-line; district preview projection fitted to container

---

## v1.4 — Mobile Polish & Scoring Fix

- **Mobile hint bar**: revealed cards collapse to icon-only strip on mobile; tap to open hints modal
- **District map auto-zoom**: after eliminations, map zooms to fit remaining possible districts; manual zoom preserved across rebuilds
- **Reference map aspect ratio**: SVG viewBox adapts to container and state shape
- **Guess scoring fix**: correct-state and correct-district picks are free; only wrong guesses count toward the total
- **Responsive hint cards** with auto-scroll to latest revealed card

---

## v1.35 — Hint Cards Redesign

- Replaced single expanding hint bar with a horizontal scrollable card row
- Each clue gets its own card: locked → lock icon; revealed → icon + label + value
- Latest revealed card highlighted with accent border and reveal animation
- Desktop: all values always visible; mobile: tap card to expand/collapse value
- Expand button removed (all hints inline)

---

## v1.34 — 2024 ACS Data & Game-Over Redesign

- Updated ACS data source to 2020–2024 5-year ACS; UI label updated accordingly
- Fixed missing districts (387 → 435) using block-count crosswalk weights from Block Assignment Files
- Share text redesigned: outcome summary + link only (no date)
- On game over: main map collapses; reference panel expands to full width
- All result modal tabs share a single district preview above the tab row
- Copyright line added to How to Play modal

---

## v1.33 — Game-Over Map Improvements

- Reference map zooms to answer district with surrounding context after game over
- Answer district filled theme-aware (white in dark mode, near-black in light)
- All other districts rendered with transparent fill + boundary strokes only
- "Already Played" banner persists after result modal is dismissed
- State outline and other-district boundaries rendered in muted tone for context

---

## v1.32 — Compactness Metrics & ACS in TopoJSON

- Added district compactness metrics: area (sq mi), Polsby-Popper, Reock — computed via `redistmetrics` R package
- ACS demographic data embedded in TopoJSON at build time (no runtime Census API calls)
- Reference map: zoom and pan via `d3.zoom()` (scale 0.5–20×, double-click disabled)
- Fixed map dragging after D3 zoom integration

---

## v1.31 — Polish & Bug Fixes

- Refined beta badge styling and map background
- Fixed dark mode district highlight (now theme-aware)
- Fixed share text: correct guess count, ✓/✗ symbols instead of color emojis
- Added "Correct!" indicator in correct-guess rows in Guesses tab

---

## v1.3 — TopoJSON Pipeline & D3 Overhaul

- Replaced static GeoJSON with a custom TopoJSON build pipeline
- TopoJSON bundles five layers: districts, state boundaries, urban areas, roads, inner points
- D3 overlay renders in stages: roads → urban areas → state outline → district highlight
- 2026 district boundaries used throughout
- Game-over view shows answer district with full state context

---

## v1.2 — Hint Bar, Census Cards & Layout

- Progressive hint bar: clue icons, labels, values — one clue unlocked per wrong guess
- Result modal "District Profile" tab with census demographic cards
- State outline layer added to D3 reference map
- Viewport layout improvements; reference panel below main map
- Modal sizing fixed (no longer shifts between tabs)

---

## v1.11 — Hints Modal & UX Refinements

- Hints modal added (auto-opens on first visit)
- D3-based reference map replaces Leaflet for US state selection
- "Guesses" tab added to result modal
- Beta badge with version number
- D3 district map with force layout for label placement; click to submit guess
- Clues reordered: size → delegation → income → racial plurality → partisanship → state

---

## v1.1 — Hot/Cold Elimination & Two-Phase Guessing

- Hot/cold elimination on wrong state guesses: adjacent states stay in play; non-adjacent states and their neighbors eliminated and greyed out
- State chips greyed out as eliminated; count updated dynamically
- District tiles replace dropdown after correct state guess
- Clickable US reference map auto-submits on state click
- Correct/wrong flash animation on state guess
- Play Again added (no page reload)
- SVG icon system replaces emojis in header
- `MAX_GUESSES` raised from 5 to 6
- District preview rendered as SVG; PNG blob for image sharing via Web Share API
- Mobile inline timer injected into guess counter
- Donate to CMU button added to result modal and census panel
- Distribution bar counts rendered inside bars; minimum bar width enforced

---

## v1.0 — Beta Launch

- Two-phase guessing: select state first, then district number
- Clickable D3 AlbersUSA reference map with state chips
- Progressive clue reveal: one clue per wrong guess (size → delegation → income → race → partisanship → state)
- Six guesses per game (Wordle-style)
- Dark / light mode toggle with CMU color scheme
- Timer starts on first guess submission
- Leaderboard with Today / All-Time / Personal tabs (Firebase Firestore)
- Feedback form (cervas@cmu.edu & jafierman@gmail.com)
- Share result + Post to X buttons
- 2024 presidential margin clue (D+/R+)
- Donate to CMU link in header
- Color-blind-accessible guess counter (shapes + colors)
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
- Compactness metrics computed in R via `redistmetrics` and joined at build time

### UI Foundations
- CSS custom properties for theming (`--accent`, `--surface`, `--border`, `--text`, `--muted`, `--radius`, `--shadow`)
- D3 projection: `geoMercator().fitExtent()` with manual scale-back for zoom-with-context
- SVG draw order: state fills → boundary strokes → district highlight on top
- Two-column desktop layout → stacked mobile layout via flex and media queries
