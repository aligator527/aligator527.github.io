# Claude Code Adapter

This directory adapts the tool-independent `.ai` knowledge base for Claude Code.

## Files

- `settings.json`: shared project permissions. Safe validation commands are pre-approved; dependency changes, commits, and pushes ask; common secret paths and destructive commands are denied.
- `settings.local.example.json`: starting point for personal project permissions. Copy it to `settings.local.json`; do not commit that copy.
- `rules/`: path-scoped instructions that load when Claude works with matching files.
- `agents/`: specialized subagents. The UI critic and QA reviewer are intentionally non-editing reviewers.
- `skills/`: repeatable workflows available as `/design-review`, `/case-study`, `/qa`, and manual-only `/deploy`.

## Security model

`CLAUDE.md` shapes agent behavior. It is not an enforcement boundary. `settings.json` permissions provide client-side enforcement for the listed tool patterns, but command-pattern deny rules are not a complete OS sandbox. Review project permissions and use Claude Code sandboxing where stronger isolation is required.

## Verification

- Run `/context` to confirm memory and rules.
- Run `/permissions` to inspect the effective permission sources.
- Run `claude doctor` when Claude reports invalid settings.
- Keep Claude Code current; path-scoped rules, skills, and permission behavior depend on CLI version.

