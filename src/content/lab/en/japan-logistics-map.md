---
locale: en
code: L01
title: Japan Logistics Map
summary: A first-pass screening tool for warehouse location in Japan — open statistics, travel-time analysis and two siting algorithms, with no backend.
status: active
technologies:
  - Svelte 5
  - TypeScript
  - Vite
  - D3
  - TopoJSON
  - Web Workers
  - Node.js
  - GitHub Actions
repository: https://github.com/aligator527/logistics-map
demo: https://aligator527.github.io/logistics-map/
date: '2026-10-21'
featured: true
sourceNote: >-
  Written from the repository README and GitHub metadata, read 2026-10-23: 92 commits,
  seven workflows, CI running svelte-check, node --test, build, Playwright with axe and a
  visual-baseline job. Personal project on open data; no employer or client material. The DPL
  layer is deliberately not mentioned anywhere on the site — Ivan's decision, 2026-10-23.
---

Where a warehouse should go in Japan is decided by things that are all public and all published
apart from each other: warehouse floor area per prefecture, freight moving between prefectures, who
is available to drive a truck, how far a truck may legally travel in a day, what industrial land
costs, and what floods. 総合物流マップ puts them on one map so that a first screening can be made
against all of them at once.

It is a personal project built on open data, and it is non-commercial — several of its sources are
licensed only for non-commercial use.

## 00 / A decision tool, not a dashboard

A dashboard shows numbers. This has to get from 1,898 municipalities to the few worth visiting, so
the screening is a funnel: hard conditions on municipal metrics, applied in order, with the count
left after each one — `1,898 → 1,230 → … → 190`. Municipalities that fail grey out on the map, the
survivors become the candidate set for everything downstream, and the conditions are in the URL. A
screening is a link you can send to someone.

## 01 / Static by construction

There is no backend. The data is built ahead of time by ETL scripts from the official releases into
versioned JSON, and GitHub Actions refresh it on schedules keyed to each source's own rhythm —
news every morning, the diesel survey on Thursdays because it is published on Wednesdays. A
manifest records every raw input's size, SHA-256, source page and the script that reads it, so a
rebuild is reproducible and an upstream file that changed shape is visible before it is parsed.

The map is drawn rather than delegated: a Lambert projection with the Okinawa and Ogasawara insets,
background tiles placed into it piecewise-affinely, detailed boundaries loaded per prefecture only
for what is on screen. The heavy calculations — the 1 km population grid, the score stability
check, the siting simulation — run in Web Workers. Everything that ships is a static file.

## 02 / A licence turned into an architecture

Some layers — emergency transport roads, key logistics roads, ports, rail freight stations — are
国土数値情報 data licensed for non-commercial use. The question that settled the design was not
whether they may be *shown* but whether they may be *taken*: the operating office confirmed with the
ministry in October 2026 that displaying such data as a map layer is not redistribution, while a
state in which the viewer can obtain the data — vector tiles, an API — may be.

So those layers are published only as picture tiles, drawn at build time; the browser never receives
their coordinates. What is published as data are the derived results the terms do allow: the
distance from each municipality and each 1 km grid cell to the nearest such road, and the road time
to each port and station.

A constraint that would normally end in "we cannot show it" became a publication model instead.

## 03 / What the numbers are allowed to mean

**Travel time** comes from a road network with road-census speeds, rush-hour speeds as a separate
mode, and ferries. Reach is then reported against the 2024 driving rules — 13 hours on duty, 9
driving, 30 minutes of rest every 4 hours — so a destination is a day trip, a one-day run, or two
days and a relay, rather than "4 h 20 m".

**Delivery cost** is computed at the MLIT standard freight rates: region by vehicle class by
distance band, rounded up the way the ministry's own Q&A rounds them, over the real road distance of
the quickest path. CO₂ follows the improved ton-km method. Tolls, waiting, handling and surcharges
are not included, and the page says so where the figure appears.

**The site score** turns 11 criteria into 0–100 percentile ranks and averages them under weights you
set. A single weighted score is an opinion wearing a number, so it is re-run 200 times with every
weight perturbed by up to ±50%: each place gets a rank range and a share of top-ten finishes, and
only the ones that survive that are marked. The rest are the places a different reviewer would have
ranked differently.

**Siting** has two objectives, both greedy and both shown step by step: maximum coverage — the N
sites that reach the most people within a time limit, on top of whatever exists already — and
p-median, the lowest total of delivery runs at the standard fares plus a fixed yearly cost per
site. The number of sites with the lowest total is marked rather than assumed.

## 04 / What it is not

It is a first screening from open data: estimates, not quotations, legal boundaries or route
permits. Publication lag is part of the subject — the warehouse statistics for April–June 2025 were
published in September 2026 — so every metric carries its as-of date, and the footer lists each
source's cadence and next expected release.

CI runs type checks, unit tests, the build, an end-to-end pass with axe, and a visual-baseline job,
because a map is a thing that breaks silently.
