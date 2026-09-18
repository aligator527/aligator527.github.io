# ADR-0001: Astro static architecture

Status: Accepted  
Date: 2026-09-18

## Context

The portfolio is content-oriented, must deploy to GitHub Pages, and should demonstrate disciplined frontend engineering without unnecessary JavaScript.

## Decision

Use Astro with static output, TypeScript, Content Collections, custom CSS, and optional React islands for narrowly justified interaction.

## Alternatives

- React SPA: rejected because it adds client runtime and routing cost to mostly static content.
- Next.js: capable, but server-oriented features are unnecessary for the current GitHub Pages requirement.
- Plain HTML: lightweight, but weaker for validated collections and reusable content-driven case studies.

## Consequences

- Excellent static performance and GitHub Pages compatibility.
- React remains available where it adds real value.
- Agents must understand Astro path/base behavior.
- Dynamic server features require a future architecture decision.

## Revisit when

Authenticated features, server-side personalization, or a CMS with runtime requirements becomes necessary.

