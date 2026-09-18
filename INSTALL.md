# Installation and Repository Integration

## New repository

Copy every file in this pack to the repository root before asking an agent to scaffold the Astro application.

Expected top-level result:

```text
portfolio/
├── .ai/
├── .claude/
├── CLAUDE.md
├── AGENTS.md
├── README.md
├── package.json
├── astro.config.mjs
├── public/
└── src/
```

The `README.md` in this pack explains the instruction system. If the repository already has a public-facing README, merge the useful sections instead of overwriting it.

## Existing repository

Before copying:

1. Back up or commit existing changes.
2. Compare any existing `CLAUDE.md`, `AGENTS.md`, `.claude/`, or `.ai/` files.
3. Merge deliberately; do not keep contradictory instructions.
4. Validate `.claude/settings.json` after merging.

## Local-only files

Add these entries to the actual repository `.gitignore`:

```gitignore
CLAUDE.local.md
.claude/settings.local.json
.env
.env.*
!.env.example
```

## Required placeholders

Search the repository for `<` to find configuration placeholders. At minimum, resolve:

- `<github-user>` — resolved: `aligator527`
- `<repository-name>` — not applicable: the site is a user site served from `/`
- `<custom-domain>` if applicable
- project-specific analytics and contact destinations

Never publish phone numbers, home addresses, private client information, credentials, or NDA-protected screenshots without explicit approval.

