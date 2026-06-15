# TODO 🚧

## UI / Layout

- [ ] Modal text should scale relative to screen size to avoid scrolling — better use of spacing throughout

## Features

- [ ] Get racial/ethnic data from topojson for district profile
- [ ] Switch median home price → Polsby-Popper (show district inside circle, white with black stroke)
- [ ] Replace median household income → Reock (draw circle with district comparison)
- [ ] Potential callouts for small-area states (e.g. New England) with force collision
- [ ] When an at-large state is the answer, clicking the state should give the win (not requiring the district tile)
- [ ] Hard Mode — additional constraints after each guess (UI toggle already added, disabled)

## Done

- [x] Logo SVG — real district map with buffer and CMU red styling (`logo.svg`)
- [x] Feedback form star ratings — click handlers + fill-through hover wired up
- [x] Remove "STATISTICS" heading from result modal
- [x] District boundary lines fade in on zoom so users can see which area each circle belongs to
- [x] State zoom fixed — district map fits full state extent, no over-zoom
- [x] Welcome back screen — "Continue" button + guess count for in-progress games
- [x] Confetti animation on correct district guess in result modal
