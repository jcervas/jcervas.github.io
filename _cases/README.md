# How to add a redistricting case

Each file in this folder becomes its own page. Drop in a new `.md` file and the
**index card**, **detail page**, **home-page highlight**, and **sitemap entry** all
appear automatically — no code changes needed.

The filename becomes the URL: `wisconsin.md` → `/redistricting/wisconsin/`.
Use lowercase and hyphens (`nassau-county.md`), not spaces.

> This README is excluded from the build (see `exclude:` in `_config.yml`), so it
> never becomes a page. Don't remove that line, or it will show up as a broken card.

## Template

Copy this into a new file and fill it in:

```markdown
---
title: Ohio                                  # State / place name (card + page heading)
case: "Smith v. Ohio (2026)"                 # Case name and year
role: Expert witness                         # Your role (shown on home + detail page)
image: /images/oh.png                        # Map image, lives in /images/
order: 11                                    # Sort position; 1 = first on the index
summary: "One or two sentences for the index card."
resources:                                   # Optional — omit entirely if none
  - label: "Expert Report"
    links:
      - { text: "PDF", url: /2026/OH/expert.pdf }
  - label: "Illustrative map"
    links:
      - { text: "SVG", url: /2026/OH/map.svg }
      - { text: "Dave's Redistricting", url: "https://davesredistricting.org/join/..." }
---

Your write-up goes here, in Markdown. This is the fuller narrative shown on the
detail page — first person is fine. [Inline links](https://example.com) work normally.
```

## Field reference

| Field | Required | Notes |
|---|---|---|
| `title` | yes | State or place name. Used as the card title and page `<h1>`. |
| `case` | yes | Case name + year, e.g. `"Clarke v. WEC (2024)"`. Quote it. |
| `role` | yes | e.g. `Special Master`, `Expert witness`, `Redistricting consultant`. |
| `image` | yes | Path to the map, e.g. `/images/wi.png`. |
| `order` | yes | Number. Controls index order; the **lowest 5** also appear on the home page. |
| `summary` | yes | Short blurb for the index card only. |
| `resources` | no | Grouped document/map links. Omit the key entirely if there are none. |

### About `resources`

Each entry is a `label` with one or more `links`. The label is the document; the
links are the formats or destinations for it:

```yaml
resources:
  - label: "Congressional map"
    links:
      - { text: "SVG", url: /2022/NY/NY-2022-Congressional.svg }
      - { text: "PNG", url: /2022/NY/NY-2022-Congressional.png }
      - { text: "Dave's Redistricting", url: "https://davesredistricting.org/..." }
```

Renders as: **Congressional map** — SVG · PNG · Dave's Redistricting

Cases with no documents (e.g. `georgia.md`, `virginia.md`) simply omit `resources`,
and the "Documents & Maps" section is skipped.

## Before you commit

- **Check every `url` points to a file that actually exists.** Local paths start with
  `/` and are relative to the site root (`/2026/OH/expert.pdf` → the `2026/OH/`
  folder). A typo here ships a 404 — this has bitten us before.
- Add the map image to `/images/` first, or the card will render blank.
- Wrap any value containing `:` in quotes, or the YAML won't parse.

## Where each field shows up

- `/redistricting/` — card with `image`, `title`, `case`, `summary`, and a details link
- `/redistricting/<name>/` — `title`, `case` · `role`, `image`, your write-up, `resources`
- `/` (home) — the 5 lowest `order` values, as `title` — `role`, `case`
- `/sitemap.xml` — added automatically on build
