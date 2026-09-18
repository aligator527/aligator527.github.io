# Project Intelligence

`.ai` is the tool-independent source of truth for the portfolio. It describes what to build, why it exists, which facts may be stated, how it should look, and what quality means.

Tool-specific files such as `CLAUDE.md` and `.claude/` adapt this material for a particular agent. They may summarize `.ai`, but must not silently redefine it.

## Directory map

| Directory | Purpose |
|---|---|
| `product/` | Goals, audiences, positioning, sitemap, content model |
| `design/` | Art direction, tokens, typography, layout, motion, accessibility, anti-AI rules |
| `content/` | Voice, verified facts, claim policy, case-study structure |
| `engineering/` | Architecture, conventions, dependency policy, performance, deployment, agent workflow |
| `qa/` | Definition of done and review rubrics |
| `decisions/` | Architecture and design decision records |

## Maintenance rules

- Update `facts.md` before publishing changed career information.
- Add a decision record when changing architecture, major dependencies, art direction, or deployment strategy.
- Keep aspirational ideas separate from verified claims.
- Prefer explicit `TBD` markers over plausible-sounding invention.
- Delete obsolete rules rather than letting contradictory guidance accumulate.

