---
title: Why your DynamoDB app got slow as data grew
summary: Five patterns that are invisible at a thousand records and fatal at a hundred thousand — and how to find them in your own code before you change anything.
publishedAt: '2026-10-23'
topics: [AWS, DynamoDB, AppSync, Performance]
draft: false
---

The complaint usually arrives in the same shape. The product was fine. Nobody changed the
architecture. And now a list screen takes nine seconds, the mobile app times out on export, and it
is getting worse every month — for everyone, not for one customer on one screen.

Nothing broke. That is the part worth sitting with, because it decides where you look.

## 00 / Growth does not break a data model. It reveals one.

A data model encodes the assumptions of the weeks it was written in: how many records there would
be, how many tenants, which screens would read what. Those assumptions are rarely written down, and
they are never wrong on day one — there is not enough data for them to be wrong yet.

What changes is the volume, and volume turns a constant-time mistake into a linear one. A full table
read costs nothing at a thousand items. At a hundred thousand it is the product.

So the question is not "what regressed?" Nothing regressed. The question is "which assumption just
stopped holding, and where is it encoded?"

## 01 / Read the evidence, not the documentation

On the engagement where I did this at length — a production SaaS with web and mobile clients — the
documentation of the data model was out of date, and the team did not share an accurate picture of
how it actually behaved. That is normal. Documentation describes the model somebody intended; the
code and the running system describe the one you have.

Three sources, in this order:

1. **The code.** Every read path. Not what the ORM or the resolver is named — what it actually
   issues.
2. **The queries.** Profiled, with real parameters, against real volumes. A query that is fast
   against your seed data tells you nothing.
3. **CloudWatch.** Request behaviour over time, so you can tell a slow operation from a slow
   *pattern*.

Where the code was hard to follow, I drew the data flow out as a diagram before changing anything.
That is not ceremony. If you cannot draw it, you do not know what a change will touch, and on a live
product that is the whole risk.

## 02 / The five patterns

These are the ones I have found most often together. Each is individually survivable. They compound.

### Scan where a Query against a key would do

`Scan` reads the entire table and then filters. `Query` goes to a key and reads what it needs. The
filter in a `Scan` runs *after* the read, so a filtered `Scan` that returns three items has still
read everything you are paying for, in time and in capacity.

How to confirm it: search the code for `Scan` and, for each one, write down which key you would
query by instead. If you cannot name one, you have found a key design problem, not a query problem.

### Missing global secondary indexes

A GSI exists so that a common access pattern has a path that is not the primary key. Without it, the
only ways to answer "all orders for this customer, newest first" are a `Scan` or a read of more
items than you need.

How to confirm it: list the questions your screens actually ask. Each one should map to a key or an
index. The ones that map to neither are your list.

### Keys that do not match how the data is read

This is the one that is actually a redesign, and it is why the first two keep coming back. A
partition key chosen because it was the obvious identifier, rather than because it is what reads
group by, forces every reader to work around it forever.

How to confirm it: for each access pattern, ask whether the items you want are adjacent. If the
answer is "they are scattered and we filter", the key is wrong.

### N+1 in resolvers

In AppSync — and in any GraphQL layer — a list field resolves once, and then a nested field resolves
once *per item*. One request for a list of 50 becomes 51 requests. The code looks innocent, because
each resolver is correct in isolation.

How to confirm it: count the requests for one list screen, not the time. The number should not grow
with the size of the list.

### Full datasets to the client, no pagination

The screen shows twenty rows; the request returns everything the table has. This is the easiest to
find and the easiest to fix, which is exactly why it survives for years: it never looks like the
problem, because it is not slow until it is.

How to confirm it: look at response sizes, not durations.

## 03 / Changing it on a product that is live

Diagnosis is the smaller half. The data belongs to customers who are using it right now.

What I would do again:

- **Ship in milestones**, each one verified step by step on staging while the team reviews the code
  in parallel. Not one large change at the end.
- **Release outside usage hours** when the customers are concentrated in one timezone. This is a
  cheap advantage and it is not available to everyone.
- **Update the data-model documentation when you are done.** You just spent weeks reconstructing it.
  Leaving it unwritten guarantees the next person repeats that cost.

What I would do differently:

- **Plan the way back for every change, before making it.** Promoting through dev, staging and
  production reduces risk; it does not guarantee that a production release succeeds. A data
  migration is exactly where that gap hurts, and "we will roll forward" is not a plan.
- **Map the blast radius first.** With separately deployed clients sharing one data layer, a change
  to the shared schema reaches further than the repository you are editing. I learned that while
  verifying, not while planning.

## 04 / Three things I would not do

**A full single-table redesign as the first move.** It is often the right end state and almost never
the right first step: it is the largest possible change to the thing you least understand, made
while the symptom is still unexplained.

**Caching in front of a Scan.** This makes the graph look better and leaves the cost exactly where it
was, now with a staleness problem on top. Cache after the access pattern is right, not instead.

**Chasing a number before defining the measurement.** Decide what you are measuring, on which
operation, at what data volume — before you touch anything. Otherwise you cannot tell improvement
from noise, and you will not be able to answer the only question your client will ask.

## 05 / What "better" looked like

I am not going to give you a percentage. No measurement of the before and after on that engagement
is approved for publication, and a number I cannot source is worth less than the method.

What is defensible: after the work, search timeouts decreased and customer complaints decreased
substantially. The product kept running throughout.

If you want the longer version of this specific engagement — the constraints, what was migrated, and
how it shipped — it is written up as a [case study](../../work/packaging-saas/).
