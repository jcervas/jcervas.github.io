# TODO 🚧

## UI / Layout

- [x] Modal text should scale relative to screen size to avoid scrolling — better use of spacing throughout

## Features

- [ ] US map that shows when game is first started is zoomed in too much. Should show all or nearly of US. the current full zoom out is reasonable
- [ ] change game over screen to include just national map with district (existing), ribbon for new game (existing), and better know a district data
- [x] Get racial/ethnic data from topojson for district profile
- [ ] add Polsby-Popper (show district inside circle, white with black stroke)
- [ ] add → Reock (draw circle with district comparison)
- [ ] potentially add other redistricting data like county splits
- [x] Potential callouts for small-area states (e.g. New England) with force collision
- [ ] When an at-large state is the answer, clicking the state should give the win (not requiring the district tile)
- [ ] Hard Mode — in hard mode, user gets no hints, just 6 guesses (UI toggle already added, disabled)

## Done

- [x] Logo SVG — real district map with buffer and CMU red styling (`logo.svg`)
- [x] Feedback form star ratings — click handlers + fill-through hover wired up
- [x] Remove "STATISTICS" heading from result modal
- [x] District boundary lines fade in on zoom so users can see which area each circle belongs to
- [x] State zoom fixed — district map fits full state extent, no over-zoom
- [x] Welcome back screen — "Continue" button + guess count for in-progress games
- [x] Confetti animation on correct district guess in result modal
