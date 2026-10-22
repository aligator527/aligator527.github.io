---
title: Choosing a stack by proof of concept
summary: A proof of concept answers a decision, not a demo — one question, one timebox, criteria written down first, including the one almost nobody tests for.
publishedAt: '2026-10-23'
topics: [Architecture, Technology selection, Go, AI-assisted development]
draft: false
---

A technology choice defended with "it is what we know" is sometimes right and never checkable. A
proof of concept makes it checkable — but only when it is run as a decision procedure, and not as
an early version of the product.

## 00 / A proof of concept is a question with a deadline

Three things separate it from a prototype: a question whose answer is allowed to be no, a criterion
agreed before anyone writes code, and a date on which it ends. Drop any one of them and the PoC
quietly becomes the first version of the system — the demo ships, nobody re-reads the question, and
the stack has been chosen by sunk cost.

The question has to be able to fail. "Can we build this in X?" cannot: the answer is always yes,
given enough time. "What does X cost us on the part we are actually worried about, in two days?"
can.

## 01 / Make the comparisons comparable

Same task, same timebox, same reviewer, and the criteria with their weights written down before the
first commit. The task should be the thing you are afraid of — the query that worries you, the
concurrency, the integration whose documentation looks thin — and not an endpoint every candidate
handles identically.

Three ways this goes wrong, all of them common:

- each candidate is built by the person who already prefers it;
- the candidates get different amounts of time, usually in favour of whoever started first;
- the criteria are written after the results, and fit the winner remarkably well.

## 02 / Criteria that survive the meeting

On the consumer product behind [this case study](../../work/ai-chat-platform/), the backend
language was chosen after several proofs of concept rather than by preference, against four
criteria: scalability, maintainability, speed, and how well the codebase would work with
AI-assisted development. Go came out of that balance, and other parts of the stack were decided the
same way.

Three of those four are ordinary, and each is worth turning into a question with an answer rather
than an adjective:

- **Scalability** — what happens at ten and a hundred times the load you expect, and what does it
  cost there? Measure it; do not reason from the vendor's page.
- **Maintainability** — how long does it take someone who did not write the code to make a small
  change safely? That is a number, and the PoC is the cheapest time to take it, while the codebase
  is still small enough for a newcomer to read in an hour.
- **Speed** — of the system and of the team. A runtime that is fast and that nobody on the team
  writes fluently is slow.

## 03 / The criterion almost nobody tests for

The fourth criterion is the one worth being explicit about, because teams now take it on faith in
one direction or the other: how well a codebase in this stack will hold up when much of it is
written with an assistant.

It is testable, and the thing to measure is the review, not the output. Give the same feature to
the assistant in each candidate and look at:

- how much of what came back was correct, and how much was plausible and wrong;
- what the compiler or the type system rejected before a human had to — a stack where wrong code
  fails to build is cheaper than one where it runs and fails later;
- whether the standard library covered what the assistant would otherwise have pulled a dependency
  for, because dependencies chosen by autocomplete are a maintenance decision made by nobody;
- whether formatting is settled by a tool, so that diffs are about logic instead of style;
- how long the result took to review, which is the number that actually scales with the team.

A large public corpus helps. It is not the whole story: the wider a language's surface, the more
there is to be confidently wrong about, and the more a reviewer has to hold in their head to catch
it.

## 04 / Letting the answer be no

A PoC can also answer "do we keep what is already here?". On that engagement an earlier codebase
existed, written by one developer more than a year earlier, and for the scope being started it
offered little foundation. That is a legitimate result, and it needs the same written question and
the same deadline as any other — otherwise the discussion drifts towards the previous author
instead of the code.

When a question has been answered, the PoC should be deleted, or promoted deliberately with a plan
for the parts that were never finished. Kept "just as a reference", it gets copied.

## 05 / The half a PoC does not cover

The language decision on that project anticipated AI-assisted development. The team's workflow for
it was not standardised from the start, and output often did not meet shared expectations and had
to be reworked, which lowered quality overall. It is the thing I would do differently, and it is
not a tooling problem.

A technology evaluation answers *which tool*. It does not answer *how we work*: what a task looks
like before it is handed to an assistant, what review covers that it did not before, what gets
written by hand, and what nobody merges without reading twice. That second question deserves the
same deliberate treatment as the first, and usually gets none — because it has no artefact to show
at the end of the week.

Choose with evidence, then write down how the chosen thing is used. The first half is the easy one.
