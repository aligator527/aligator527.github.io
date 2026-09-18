# ADR-0003: Deploy as a GitHub user site at the domain root

Status: Accepted
Date: 2026-09-18

## Context

`.ai/engineering/deployment.md` describes both options: a project page served from
`/<repository-name>` and a user site served from `/`. The first implementation had to pick one, and
the choice affects every internal URL.

## Decision

Deploy as the user site `https://aligator527.github.io`: `site` is that origin and `base` is `/`.

Base-path discipline is kept regardless. All internal URLs go through `withBase()`
(`src/utils/url.ts`), `base` is read from the `BASE_PATH` environment variable, and CI additionally
builds with `BASE_PATH=/portfolio` and re-runs the link checker against that output.

## Alternatives

- Project page under `/portfolio`: rejected because a personal portfolio reads better at the root,
  and a subpath adds a URL segment to every link a visitor might share.
- Custom domain: deferred. No domain has been approved yet; adding one later means a `public/CNAME`
  file and a `site` change, with `base` already correct.

## Consequences

- Cleaner public URLs, and the repository must be named `aligator527.github.io`.
- Base-path regressions would otherwise be invisible at the root, so the subpath build in CI is the
  guard that keeps a future move to a subpath or custom domain cheap.

## Revisit when

A custom domain is approved, or the portfolio has to share the user-site repository with another
project.
