# How to add or edit a course

Each file in this folder is one course. Drop in a new `.md` file and the
**index card** (at `/teaching/`), its own **detail page**, and the **sitemap
entry** all appear automatically.

The filename becomes the URL: `democracys-data.md` → `/teaching/democracys-data/`.
Use lowercase and hyphens, not spaces.

> This README is excluded from the build (see `exclude:` in `_config.yml`), so it
> never becomes a page. Don't remove that line, or it will show up as a broken card.

## Template

```markdown
---
title: "Course Title"
number: "84-999 / 899"          # cross-listed numbers, or just "84-999"
level: "Undergraduate & Graduate"
gened: "Contextual Thinking"     # optional — omit if not a Gen Ed
terms: "Fall 2025, 2026"
order: 7                          # controls order on the index; lowest first
summary: "One sentence for the index card."
# syllabus: /assets/syllabi/course.pdf   # optional; shows a download link
---

The main course description goes here as Markdown — as many paragraphs as you like.

## Learning Objectives

- Objective one
- Objective two

## Course Goals

A paragraph on what the course sets out to accomplish.

## Why This Course Matters

A paragraph on the course's relevance.
```

## Fields

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Course name; used as the card title and page `<h1>`. |
| `number` | yes | Course number(s), e.g. `"84-352 / 652"`. Quote it. |
| `level` | yes | e.g. `Undergraduate`, `Graduate`, `Undergraduate & Graduate`. |
| `gened` | no | Dietrich Gen-Ed category; omit if none. |
| `terms` | yes | Terms taught, e.g. `"Spring 2024, 2026"`. |
| `order` | yes | Number; controls index order (lowest first). **Required** — a file without it is skipped on the index. |
| `summary` | yes | One line shown on the index card. |
| `syllabus` | no | Path to a syllabus PDF (e.g. `/assets/syllabi/x.pdf`); shows a download link. |

Everything below the front matter is the page body: the description plus any
sections you want (`## Learning Objectives`, `## Course Goals`, etc.). Add or
remove sections freely — they're just Markdown headings.

## Before you commit

- Add a **unique `order`** so the course sorts correctly and appears on the index.
- If you set `syllabus:`, make sure the PDF actually exists at that path.
- Quote any value containing a `:` or the YAML won't parse.
