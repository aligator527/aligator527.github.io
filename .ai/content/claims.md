# Claims and Evidence Policy

## Rule

No public claim without a defensible source.

## Claim classes

| Class | Example | Requirement |
|---|---|---|
| Identity | Role, location, language | Present in `facts.md` |
| Scope | “Led technical planning” | CV, contract, public profile, or explicit user confirmation |
| Metric | Adoption, latency, revenue, team size | Exact source and measurement context |
| Outcome | “Reduced timeouts” | Evidence describing before/after or qualified wording |
| Opinion | “I prefer ADRs for durable decisions” | Clearly framed as a working principle |
| Future | Planned degree or product | Label as planned/in progress; never present as achieved |

## Wording under uncertainty

Prefer:

- “Contributed to…”
- “Designed the approach for…”
- “The current CV reports…”
- “Approximately…” when the source is approximate.
- “Reduced timeout and performance issues” when no defensible percentage exists.

Do not convert qualitative improvements into invented percentages.

## Team attribution

- State Ivan’s role and contribution separately from team outcomes.
- Do not imply that one person built an entire multi-person product.
- When team size is known, provide it in context.

## Drafting protocol

When evidence is missing:

1. Insert `[FACT REQUIRED: ...]` in drafts.
2. Ask one precise question.
3. Keep the claim unpublished until answered.
4. Add the verified result to `facts.md` or project notes.

## NDA protocol

- Use an anonymized domain and problem statement.
- Reconstruct diagrams at a safe abstraction level.
- Replace screenshots with synthetic or abstracted UI only when clearly presented as a reconstruction.
- Never hide sensitive content merely with CSS blur.

