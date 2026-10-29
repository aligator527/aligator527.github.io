---
locale: en
title: A hold is a decision
summary: Approved and rejected both leave something behind. A proposal that is neither leaves nothing — and the fix is not faster approvals but a hold you can read.
publishedAt: '2026-10-29'
topics: [Technical leadership, Engineering management, Technology selection, Architecture]
figure:
  kind: steps
  caption: Three technology decisions and what it costs to undo each. The marked step is where the second row stops being cheap to leave, which is where its process belongs — not at the moment an invoice is signed.
  rows:
    - label: Bounded trial
      steps: ['Set a limit', 'Run it', 'Keep or stop']
      back: Stop paying; nothing is built on it yet
    - label: Platform, identity, language
      steps: ['Compare', 'Decide', 'First service on it', 'Everything on it']
      point: First service on it
      back: Re-decide freely, until the marked step
    - label: A promise a customer can hold you to
      steps: ['Design', 'Write it into the contract', 'Operate it']
draft: false
---

Approved and rejected are both decisions, and both leave something behind: a record, an owner, a
date, a thing that happens next. A proposal that is neither leaves nothing. It is the cheapest
state to put something into and the most expensive one to leave it in, because nothing about it
appears in any report — there is no artefact for an absence.

## 00 / Elapsed days measure the calendar, not the decision

The instrument everyone reaches for is the age of the ticket. It is easy to collect and it cannot
answer the question. A proposal that waited months because the architecture it depended on had not
been chosen yet was waiting correctly. A proposal that waited three weeks and missed the only
window to get a requirement into a release was not. Same instrument, opposite readings.

Duration is a symptom with several causes, and they call for opposite responses:

- waiting on a dependency that genuinely has not resolved — correct, and worth saying out loud;
- deferred because it is not the most valuable thing to think about this quarter — also correct,
  and a decision in its own right;
- waiting on information nobody was asked to find — a missing request;
- waiting on a judgement nobody owns — a missing owner;
- waiting because the answer is no and nobody wants to say it — a missing no.

The last one deserves naming. A no is a decision: it releases the people waiting, it can be
appealed, and it can be revisited when something changes. Silence does none of those things while
costing the same.

## 01 / A hold a stranger can read

The test is whether someone who was not in the room can read the hold and know whether to act on
it. "Pending" fails that test. Five fields pass it:

- **why** it is waiting;
- **what** would end the wait — a condition, not a date;
- **who** ends it, which is one named person, not a team;
- **when** it is looked at again regardless;
- **what** it is blocking today, which is often nothing, and worth writing down when it is.

That costs a sentence. The alternative is re-explaining the proposal in three months to people who
have forgotten the first conversation, which is how the same discussion happens twice and arrives
somewhere different the second time.

## 02 / Reversibility, not price, sets the process

The usual rule is a money threshold: under some figure a manager approves, over it a committee
does. It is easy to administer and it measures the wrong property. A small monthly subscription
that ends up inside everybody's workflow is harder to leave than a one-off purchase ten times its
size.

Identity is the example I keep returning to, because it is the component that is cheapest to adopt
and most expensive to leave, and the choice is usually made in an afternoon by whoever set up the
first environment — [the note on per-user pricing](../per-user-identity-pricing/) is about the
calculation that gets skipped in that afternoon. Nothing about the invoice signals any of this.

So the axis is what it costs to be wrong, and how far along the path you already are:

- **Bounded trials.** Approve the limit rather than the tool: this many people, this long, this
  much, and these are the questions we expect to answer. Reversible by not renewing. These need
  the least process and are the most common thing to over-govern.
- **Structural choices.** Platform, identity, language, data model. Reversible until the first
  thing is built on them, and not after — which is why they earn the written criteria, the
  alternatives and the timebox of [a proof of
  concept](../choosing-a-stack-by-proof-of-concept/) rather than a conversation.
- **Promises.** Anything that reaches a customer as a commitment: a contract requirement, a
  shipped mobile build, an email sent, a destructive migration. Here the question is not whether
  it is worth the money but what your position is if it is wrong, and that has to exist in writing
  beforehand — [a release plan is a return plan](../release-plan-is-a-return-plan/) is the same
  argument at the level of a single deploy.

## 03 / A request for a tool is two claims, and one of them gets heard

An engineer asks for a tool and gives the reason that is easiest to say: it makes the work faster.
What they often want is something else — a way to understand a codebase they did not write, or a
way for a new person to start contributing in a week instead of a month.

The manager prices the claim they heard. Against typing speed, the tool is worth having eventually,
so it gets scheduled for whenever implementation becomes the bottleneck. Both parties are being
reasonable and they are answering different questions, and the gap is in the proposal rather than
in either person: it said what the tool does and not what it is for, for whom, and what is
different if it arrives three months later.

Four sentences close it — the problem, who has it, what the delay costs, and what you would
measure to know it worked. Those are also the four things that let someone say yes quickly, which
is the actual goal.

## 04 / Finding out and deciding are different jobs

"Evaluate X" as a single item conflates four things: whether we want to know, who is finding out,
by when, and what we do with the answer. The fourth is the one that gets lost, because the first
three feel like progress. The investigation finishes, the answer lands in a comment, and the
decision it was meant to feed never happens — a question has been answered and nothing has been
decided.

The related failure is an investigation that outlives its premise. When the dependency resolves
differently from what the item assumed, the item keeps its assumption, because nobody re-reads a
thing that is already on hold. Which means a decision is not finished when it is made: it is
finished when everything that was waiting on it has been updated or closed. That is the step most
worth making mechanical, since it is pure bookkeeping and nobody enjoys it.

## 05 / The process has a cost of its own

All of this is more work than not doing it. A scheme that wants a document per decision will slow
down the decisions it was built to speed up, and the first people to feel it will be the ones
making small reversible choices — exactly the ones that needed least of it. So the overhead
belongs among the numbers you watch. If the record takes longer to write than the decision took to
make, the record is too long.

What the record is for is narrow and worth being honest about. On the packaging SaaS in [this case
study](../../work/packaging-saas/), the data model's documentation was not current, so no one had a
shared picture of how the system already worked and every question about it started from
reverse-engineering; I updated it after the performance work, which is why the next change to it
would not start there. A decision record is that same mechanism one level up. It exists so the
next person does not re-derive the argument — and so that when the premise changes, somebody can
tell.

The thing worth building is not faster approval. It is being able to say, at any moment and for
every open proposal, what it is waiting for and who ends the wait. Most of the time, that turns out
to be the whole fix.
