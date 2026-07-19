# How to add a publication

Each file here becomes its own landing page at `/publications/<filename>/`, with
the citation, a link to the article, and a summary. The `/publications/` index
lists them automatically, grouped into articles and op-eds.

The filename is the URL: `zip-codes-representation.md` →
`/publications/zip-codes-representation/`. Use lowercase and hyphens.

> This README is excluded from the build (see `exclude:` in `_config.yml`), so it
> never becomes a page. Don't remove that line.

## Template

```markdown
---
title: "Paper Title (italics with <i>…</i> are fine)"
authors: "Jonathan R. Cervas and Bernard Grofman"
venue: "Journal Name 12, no. 3"      # journal + volume/issue, or "Medium", etc.
year: 2026
kind: article                        # "article" or "op-ed" (controls which list)
order: 1                             # sort position within its list; 1 = top (newest)
link: "https://doi.org/..."          # link to the article itself
---

A short summary — a few sentences on the question the piece asks and what it
finds. Plain Markdown; leave it empty if you don't have one yet (the page still
shows the citation and link).
```

## Fields

| Field | Notes |
|---|---|
| `title` | Shown as the page heading and in the index. `<i>…</i>` renders as italics. |
| `authors` | Full author string, in order. |
| `venue` | Journal + volume/issue, or outlet name for op-eds. |
| `year` | Publication year. |
| `kind` | `article` → "Peer-Reviewed Articles & Chapters"; `op-ed` → "Op-Eds & Public Commentary". |
| `order` | Lowest = first. The home page shows the five lowest-`order` articles. |
| `link` | URL to the article. Omit to show no "Read the article" link. |

The **summary is the body** (below the front matter), so it can be as long as you
like and use Markdown. An empty body just hides the Summary section.
