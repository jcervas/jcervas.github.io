# How to update the data files

These `.yml` files hold the site's content. Edit one, commit, and the relevant
page rebuilds automatically — no code changes.

> Jekyll only loads `.yml` / `.yaml` / `.json` / `.csv` / `.tsv` from `_data/`,
> so this `README.md` is ignored by the build and never becomes a page. (Unlike
> `_cases/`, no `exclude:` entry is needed here.)

| File | Powers |
|---|---|
| `publications.yml` | `/publications/` and the home-page "Selected Publications" |
| `teaching.yml` | `/teaching/` (course list) — fields: title, number, level, gened, terms, description (optional, shown as an expandable) |
| `media.yml` | `/media/` (featured cards + mentions table) and `/media/new-york-daily-news/` |
| `media_ny2022.yml` | `/media/ny-2022/` (the 128-article Special Master archive) |

---

## Adding media coverage (the sortable tables)

Three pages render as sortable/searchable tables from the data below. Each row
needs a **`date`** in ISO form (`YYYY-MM-DD`) — that's what powers date sorting
and the displayed date — plus `title`, `outlet` (where shown), `url`, and a
`topic`.

### A national mention → `media.yml`, under `mentions:`

```yaml
mentions:
  - date: 2026-06-15            # ISO, used for sorting + display
    outlet: "AP News"
    title: "Headline of the article"
    url: "https://example.com/article"
    topic: "Voting Rights Act"  # see topics below
    author: "Jane Reporter"     # optional
    quotes:                     # optional — shown indented under the title
      - "A pulled quote from the piece."
```

### An NY Daily News item → `media.yml`, under `nydn:`

Same fields, plus a **`section`** of `Editorial` or `Other` (this is a filter):

```yaml
nydn:
  - date: 2026-03-09
    outlet: "New York Daily News"
    title: "Editorial headline"
    url: "https://www.nydailynews.com/..."
    section: Editorial
    topic: "Reform & Commentary"
```

### An NY-2022 article → `media_ny2022.yml`, under `items:`

```yaml
items:
  - date: 2022-05-17
    title: "Headline"
    outlet: "New York Times"
    url: "https://www.nytimes.com/..."
    topic: "Draft & Final Maps"
```

---

## Topics (the `topic:` field)

`topic` drives the filter chips. Values were **auto-classified from titles**, so
they have some misses — edit any of them freely. Keep the spelling consistent so
articles group under the same chip. The taxonomies currently in use:

- **`media.yml` (national mentions + NYDN):** `Voting Rights Act`,
  `Electoral College`, `Census & 2030`, `Mid-Decade Fights`, `Reform & Commentary`
- **`media_ny2022.yml`:** `Appointment`, `Court Ruling`, `Draft & Final Maps`,
  `Primaries & Calendar`, `Public Input & Hearings`, `Litigation & Challenges`,
  `Analysis & Impact`, `Coverage`

You can invent a new topic just by using it — a new chip appears automatically.

**How filters render:** a facet with **8 or fewer** distinct values shows as
chips; more than 8 becomes a dropdown (that's why *topic* is chips but *outlet*,
with dozens of values, is a dropdown).

---

## Before you commit

- **`date` must be ISO `YYYY-MM-DD`** or sorting breaks. The *displayed* date is
  formatted from it automatically (e.g. `2026-06-15` → "Jun 15, 2026").
- **Check the `url` opens.** A typo ships a dead link.
- **Quote any value containing a `:`** (most titles), or the YAML won't parse.
- Keep `topic` (and `section`) spellings consistent with existing rows.

## Adding a table to a new page

The tables come from a reusable include. To put one on another page:

```liquid
{% include media-table.html items=site.data.SOMEFILE.items facets="topic,outlet" columns="date,title,outlet" %}
```

- `items` — the array to render
- `facets` — comma list of fields to filter on (each row is tagged from these)
- `columns` — comma list of columns to show (`date`, `title`, `outlet`)

The behavior (sort, search, chips/dropdown) is handled by `js/media-table.js`,
which is loaded site-wide and activates on any page that has a table.

---

## Publications (`publications.yml`)

Not a table — a simple list. Add an entry under `articles:` (newest first) or
`op_eds:`:

```yaml
articles:
  - title: "Paper title"
    authors: "Jonathan R. Cervas and Bernard Grofman"
    venue: "Journal Name 12, no. 3"
    year: 2026
    url: "https://doi.org/..."
```
