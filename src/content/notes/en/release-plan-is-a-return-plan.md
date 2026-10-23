---
locale: en
title: A release plan is a return plan
summary: Promoting a change through dev, staging and production lowers the risk and proves nothing. What has to be written down first is how to put production back.
publishedAt: '2026-10-23'
topics: [Releases, Migrations, Architecture, AWS]
figure:
  kind: steps
  caption: The same number of steps forward, three different costs to go back. The marked step is where the second row stops being reversible.
  rows:
    - label: Code only
      steps: ['Deploy', 'Verify in production']
      back: Redeploy the previous artefact
    - label: Schema and data, additively
      steps: ['Add the field', 'Write both', 'Backfill', 'Read the new one', 'Stop writing the old']
      point: Stop writing the old
      back: Undo the last step, until the marked one
    - label: Destructive migration, email sent, mobile build shipped
      steps: ['Behind a flag', 'Verify', 'Reveal']
draft: false
---

Every team I have worked with promotes changes through environments, and every team has shipped
something that passed all of them and still went wrong in production. That is not a failure of
discipline. It is what environments are: a sample of reality, taken under conditions you chose.

## 00 / What staging actually proves

Staging proves that a change does not fail in the ways you thought to look for. It is a real and
useful thing to prove, and it is smaller than it feels, because staging is missing the parts of
production that cause the interesting failures:

- the data volume, and the one tenant whose data is shaped unlike everyone else's;
- concurrency — real users doing things at the same time, with caches already warm;
- the integrations, in the state they are actually in today;
- the clients, in the versions people are actually running.

So the question that decides how a release goes is not "did it pass staging?" but "if it is wrong
in production, what do we do in the next ten minutes?" On a live product that question has to have
an answer before the deploy, because afterwards you will be answering it under time pressure, in
front of customers, at the hour you chose to release.

## 01 / Three classes of change, and only one is cheap to undo

**Reversible by redeploying.** Code only, no schema change, no data written in a new shape. Going
back is deploying the previous artefact — which means keeping it, and having gone back at least
once on purpose, so the path is known rather than theoretical.

**Reversible with work.** A schema or data change made additively: add the new field, write both,
backfill, read the new one, and only later stop writing the old. Each step is individually
reversible, which is the whole point of doing it in that order. Write down which step is the point
of no return, and treat crossing it as a separate decision with its own date.

**Not reversible.** A destructive migration, an email that went out, a call made to someone else's
API, a mobile build already on people's phones. For these, "roll back" is not a plan and never was.
What works instead is making the change invisible until it is verified: behind a flag, in a shadow
table, in a job that writes somewhere nobody reads yet.

Most incidents I have seen in this area come from a change in the second class being treated as if
it were in the first.

## 02 / Blast radius, before the change rather than during it

On a packaging-industry SaaS I worked on, the frontend, the backend and the mobile app lived in
separate repositories, each with its own deployment pipeline and its own environments. That is a
good structure: each part ships on its own schedule. It also hides something, which I learned while
verifying rather than while planning — they all meet at one data layer, so a change to the shared
schema reaches further than the repository you have open.

What that means in practice: before a change, answer "what else reads this?" by looking, not by
remembering. A field you are removing from a GraphQL schema is being selected by clients you did
not deploy. The web client can be fixed in an afternoon. The mobile one cannot, because the version
in someone's pocket is the version they have until they update, and the slowest updater sets how
long your backend keeps serving the old shape.

The architectural rule that falls out of this is boring and worth following: the shared layer
changes additively, and the removal happens one release later than you want it to.

## 03 / Night releases buy a window, not safety

If your customers are concentrated in one timezone, releasing outside their working hours is a
cheap and real advantage, and it is not available to everyone. But it is worth being precise about
what it buys: not a lower chance of being wrong, only time to notice and act before anyone is
affected.

That time is only useful if someone is using it. Which means deciding, before the release, what you
will look at in the first fifteen minutes — the one query, the one dashboard, the one screen that
tells you the migration did what it was supposed to — and who is making the call.

## 04 / The paragraph that does the work

Not a process document. Five lines per change, written while you still have the whole picture in
your head:

1. What changes.
2. What else touches it.
3. How we check, in production, that it worked.
4. How we go back.
5. When we stop trying to fix forward and go back instead.

The fifth line is the one that matters and the one usually missing. At two in the morning, with a
customer's data in an unknown state, nobody decides well how long to keep trying. Deciding it in
advance, when it costs nothing, is the whole trick.

One concrete version of line 3, from a Node.js 16 to 20 migration on that same product: the check
was not "the tests pass". It was a defined workflow — set up a tenant, then do the ordinary things
a customer does — run by hand against the deployed system, because the dependency and runtime
problems that migration produced were not the kind that unit tests notice.

## 05 / What I would settle before the next one

- Which class the change is in, in writing, and where its point of no return is.
- What the previous artefact is and whether anyone has ever deployed it on purpose.
- The oldest client version still in use, and whether the change is safe for it.
- The one check that proves the change worked, and the one that proves it did not.
- Who is awake, and what they are allowed to decide alone.

The longer version of the engagement these come from — what was diagnosed, what was migrated and
how it shipped — is written up as a [case study](../../work/packaging-saas/).
