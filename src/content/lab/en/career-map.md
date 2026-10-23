---
locale: en
code: L02
title: Career Map
summary: Public wage statistics from eleven countries in one browser-side comparison — age, education, region and occupation, with nothing sent to a server.
status: complete
technologies:
  - React
  - TypeScript
  - Vite
  - Python
  - Vitest
  - Playwright
  - Supabase
  - GitHub Actions
repository: https://github.com/aligator527/career-map
demo: https://aligator527.github.io/career-map/
date: '2026-10-01'
sourceNote: >-
  Written from the repository README and GitHub metadata, read 2026-10-23. Eleven jurisdictions
  counted from the README source list (JP, US, UK, CA, DE, FR, IT, NL, AU, SG, KR). Status
  "complete" from the commit history: the pipeline and site are finished, and a monthly workflow
  keeps watching for new releases.
---

Where does someone with your age, education, region and occupation actually sit? Every country
publishes enough to answer that, and almost nobody does, because the answer has to be assembled
from eleven statistical systems that agree on nothing.

## 00 / One question, eleven ways of answering it

Some countries publish microdata: the US American Community Survey and Canada's census public-use
file hand you individual records, which lets you build any cut you want and costs a download
measured in hundreds of megabytes. Others publish tables: Japan's 賃金構造基本統計調査, the UK's
ASHE, Eurostat's Structure of Earnings Survey for Germany, France, Italy and the Netherlands,
Australia's Employee Earnings and Hours, Singapore's occupational wage tables, Korea's KOSIS survey.
Those are small, and they answer only the cuts the publisher chose to cut.

The pipeline has to turn both into one shape, which means deciding — per country, and in writing —
what an occupation is, what counts as full-time, and which age bands can be compared with which.
The honest output of that work is not a number but a distribution with its source attached.

## 01 / Three numbers for one salary

A comparison that stops at gross pay says a Tokyo salary and a Berlin salary are the same number.
They are not the same money. So each figure can be read three ways: gross, net of an estimated tax
and social-insurance load, and net adjusted for prices — regional price parity inside a country,
purchasing power parity between them. Each adjustment names the source it comes from, because the
adjustment is where a comparison like this usually stops being defensible.

## 02 / The computation stays in the browser

The inputs are an age, an education, a region, an occupation and an income. That is a combination
most people would hesitate to type into someone else's server, so none of it is sent: the pipeline
ships derived datasets as static files, and the page computes against them locally.

The privacy decision has two consequences that improved the thing. It caps the data budget — a cut
has to be small enough to ship to a phone — and it makes the site work offline once opened. The
optional part where people report their own pay publishes a group's figures only once at least ten
people are in it, which is what keeps self-reported data from identifying the people who reported
it.

## 03 / Data that goes stale quietly

Statistical releases land roughly once a year, without notice, and a dataset keeps answering
confidently long after it has stopped being current. A monthly job checks every source for a new
edition and opens an issue when it finds one. That is the whole mechanism, and it is the difference
between a project that is finished and one that is merely abandoned.
