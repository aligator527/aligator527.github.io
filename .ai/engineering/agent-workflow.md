# Agent Workflow

## Default loop

1. Inspect relevant source and instructions.
2. Separate verified facts from assumptions.
3. Propose a bounded change.
4. Implement in small, reviewable steps.
5. Run targeted validation.
6. Perform an independent critique when visual or public content changes.
7. Report evidence and remaining risks.

## Role separation

| Role | Writes? | Responsibility |
|---|---:|---|
| Lead | Yes | Scope, decisions, integration |
| Frontend implementer | Yes | Astro, CSS, interaction, tests |
| Content editor | Content only | Clarity, structure, factual discipline |
| UI critic | No | Hierarchy, originality, anti-AI rubric |
| QA reviewer | No by default | Tests, accessibility, responsive and build evidence |

The agent that creates a design should not be the only agent that approves it.

## File ownership during parallel work

- Assign non-overlapping files or directories.
- Do not let multiple agents edit the same file concurrently.
- Review shared tokens, routing, and content schemas centrally.
- Integrate one coherent change at a time.

## Escalation

Ask the user when:

- a missing fact changes public meaning;
- an NDA or privacy judgment is ambiguous;
- a new dependency or architecture direction is material;
- deployment, external writes, or account changes are required;
- two valid design directions have meaningfully different positioning.

