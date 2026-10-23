---
locale: en
code: L03
title: Foreign Residents in Japan
summary: 'An e-Stat crawler and the datasets it produces: foreign residents by prefecture and municipality, made consistent across periods that are not.'
status: complete
technologies:
  - Python
  - Parquet
  - Svelte 5
  - TypeScript
  - Vite
  - GitHub Actions
repository: https://github.com/aligator527/zairyu-map
demo: https://aligator527.github.io/zairyu-map/
date: '2026-09-25'
sourceNote: >-
  Written from the repository README and GitHub metadata, read 2026-10-23. The architecture the
  logistics map was then built on; a weekly workflow refreshes the data. No employer or client
  material.
---

Japan's Ministry of Justice publishes 在留外国人統計 — foreign residents by nationality, residence
status, prefecture and, recently, municipality. It is the same data every six months, in a
different shape every six months. The crawler and the datasets are the project; the map is what
they are for.

## 00 / What changes between periods

Each of these is one rule in a normaliser and one decision about what the output means:

- **Country codes and names.** Old names are mapped to current ones — スワジランド to エスワティニ,
  マケドニア to 北マケドニア — so a country is one series rather than two.
- **Age.** 80 means "80 and over". In one period, 2019-12, the published age was unbounded, so it is
  top-coded to match the rest. Two early periods have an 不詳 bucket holding three people in total.
- **Sex.** A third code appears from 2022-12 and does not exist before it.
- **Residence statuses.** 特定技能 appears from 2019-12, 特定技能2号 from 2022-06. A status that did
  not exist is not the same as a status with no one in it.
- **Municipalities.** They are only published from 2023-12, and the first two editions carry no sex
  or age at all.

## 01 / What the ministry hides, and what that does to the totals

Municipalities with ten or fewer foreign residents are not published individually: they are
collapsed into one nationwide その他 row. From 2024-12, sex and age are suppressed below five
thousand residents, and nationality and status below ten.

So a prefecture total summed from municipal rows is slightly short of the prefecture table's own
figure. The site always computes national and prefecture totals from the full prefecture table, and
uses municipal data only for the municipal view. Two screens that disagree teach a reader to trust
neither, and the fix is to decide once which table is authoritative for which question. Suppressed
cells are drawn as 非公表 hatching, never as zero.

## 02 / The file that is not a spreadsheet

From 2024-12 the workbooks stop keeping their data on a sheet and keep it in a Power Pivot model
instead. Reading them takes `pbixray` and a small patch: without it, tables whose names begin with
`R` or `H` — which is most of them — are skipped, and the library returns an empty table rather
than an error.

That is the failure mode worth naming. A parser that raises is a bug report; a parser that returns
nothing is a dataset that quietly loses a period, and the only defence is checking the totals
against the published figure every time.

## 03 / Shipping it to the browser

Each period is a columnar binary file — counts as 32-bit integers, codes as 8 and 16 bits — gzipped
to between 0.3 and 0.8 MB. Filtering and aggregation are one pass over typed arrays in the page, so
there is no backend and no query language, and a filter responds as fast as it can redraw.

The palette is Japanese traditional: 紅 for magnitude, 藍 for focus and for decline in the
year-on-year scale, 墨 for text. Seven quantile classes with roughly equal numbers of regions,
monotonic in lightness through OKLCH, so that "more" is readable as a step in both themes, and text
contrast stays at 5:1 or better.
