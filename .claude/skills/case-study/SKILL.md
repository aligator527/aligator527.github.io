---
name: case-study
description: Turns verified raw project notes into a structured engineering case study without inventing facts. Use when drafting, expanding, or revising a portfolio case study.
allowed-tools: Read Grep Glob Edit Write
---

# Case Study Workflow

Target: `$ARGUMENTS`

1. Read `.ai/content/facts.md`, `claims.md`, `voice.md`, and `case-study-template.md`.
2. Locate only the source notes relevant to the target.
3. Build a fact table: verified, approximate, private/NDA, missing.
4. Ask precise questions for facts that materially affect the narrative.
5. Draft context, problem, constraints, decisions, system, delivery, outcome, and retrospective.
6. Mark unresolved items as `[FACT REQUIRED]`, `[METRIC SOURCE]`, or `[NDA REVIEW]`.
7. Run `.ai/qa/content-review.md` before completion.

Never manufacture metrics, alternatives, tradeoffs, screenshots, client names, or retrospective lessons.

