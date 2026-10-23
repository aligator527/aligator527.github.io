---
locale: en
title: When per-user identity pricing stops working
summary: Managed identity costs per user; self-hosting costs per engineer. Where the lines cross is a calculation most teams skip — and the lock-in is not the protocol.
publishedAt: '2026-10-23'
topics: [Architecture, Identity, Keycloak, AWS]
draft: false
---

Identity is the component that is cheapest to adopt and most expensive to leave. The decision is
usually made in an afternoon, early, by whoever is setting up the first environment — which is
exactly the moment when the per-user option costs nothing, because there are no users.

## 00 / Two different shapes of cost

A managed identity provider bills per monthly active user. A self-hosted one bills per instance,
per database, and per engineer. One of those lines slopes with your success. The other is nearly
flat, and then steps.

For most B2B products the sloping line never gets steep: a few thousand seats is a rounding error
next to the cost of running an auth server yourself, and the decision is not close. For a consumer
product planned to be large, the lines cross. The only questions are where, and whether being wrong
is survivable.

## 01 / Price it on the day, not from memory

Rates change, and so do the models. What is worth knowing in advance is the shape of the traps.
[Amazon Cognito's pricing page](https://aws.amazon.com/cognito/pricing/), read on 2026-10-23:

- three feature tiers, and a new user pool defaults to the middle one — Essentials, at **$0.015 per
  MAU** above the free tier;
- the **10,000 MAU** monthly free tier applies on Lite and Essentials. The Plus tier has no free
  tier at all;
- federated SAML/OIDC users have a separate allowance of **50 MAU per month**, whatever tier the
  pool is on;
- user pools created on or before 22 November 2024 keep an older, larger allowance of **50,000
  MAU** — so the price depends not only on which tier you are on but on when the resource was
  created.

[Auth0](https://auth0.com/pricing) prices its B2C plans by monthly active users too, with a free
tier in the tens of thousands of MAU at the time of writing. The number that matters for a product planned at scale is the one
not on the page: the top plan is quoted, not listed. If the plan is to grow past the published
tiers, the cost of the managed option above that point is not something you can look up — it is
something you will negotiate, later, from a position where moving is expensive.

That asymmetry, not the per-MAU rate, is the thing to notice.

## 02 / What is actually in the self-hosted column

An estimate that sets a per-MAU rate against "an instance and a database" is not an estimate. It is
an argument with the inconvenient half left out. The honest column contains:

- **Availability.** Sign-in is on the critical path of everything, including sessions that expire
  mid-use. An identity server without a failover plan is a single point of failure introduced into
  a system that may not otherwise have one.
- **Upgrades on somebody else's schedule.** A CVE in an auth server is not a backlog item.
- **Key rotation, session invalidation, and a tested procedure for "revoke everything, now".**
- **Backups of a store holding password hashes** — restored at least once, by someone who wrote
  down how long it took.
- **Account recovery and email deliverability**, which is the unglamorous half of consumer
  identity and the half users actually meet.
- **Abuse**: bot signups, credential stuffing, rate limits per account and per address.
- **The engineer who knows how it works** — and the second one, for when the first is away.

Priced at a loaded hourly rate, that column is rarely small. It is also mostly fixed: the same work
serves ten thousand users and ten million. That is precisely why the two lines cross at all.

## 03 / The lock-in is not the protocol

"We can move later, it is all OIDC" is half true. The protocol is portable. The user store is not.

- **Subject identifiers change.** Anything that stored `sub` as the user's identity has to be
  remapped, including rows in your own database.
- **Password hashes may not be exportable.** Where a provider will not hand them over, migration
  means every user resets their password. That is a product event, not a deployment.
- **MFA enrolments, social-account links and refresh tokens do not transfer.**
- **Anything that trusts the issuer is pinned to it**: gateway authorizers, mobile builds already
  in the field, partner integrations.

So the question is not only which option is cheaper but which direction is cheaper to be wrong in.
Leaving a self-hosted provider is a migration you can plan, because you hold the hashes. Leaving a
managed one may not be. That asymmetry belongs in the decision and is usually left out of it.

## 04 / Sometimes the argument is not money

Where sign-in belongs is an architecture question before it is a pricing question. If one product
signs users in, identity can live inside it. If several products are meant to share one account,
identity is a platform component: it belongs outside any single application, on its own hostname,
with its own lifecycle. Moving it there later means changing every redirect URI and every token
issuer already shipped.

On the consumer AI chat product behind [this case study](../../work/ai-chat-platform/), that is
where it ran: Keycloak on its own domain, intended as the single sign-in entry point for a planned
family of AI-interactive applications sharing one database. Cognito and Auth0 both price by user,
the product was planned for a large user base, and the per-user line was the one that would have
grown with it. During that engagement the wider platform remained design intent rather than a
delivered system — which is part of the lesson too. The platform argument is a bet on a roadmap,
and roadmaps move.

## 05 / What to settle before committing

- Three user-count scenarios — launch, plan, and the number that would count as success — priced on
  both sides, on the day, not from a blog post.
- Engineer-hours in the self-hosted column, at a loaded rate, including the on-call half.
- The export path for users, hashes and MFA enrolments, written down before launch and confirmed
  with the provider rather than assumed.
- What happens while identity is down, and whether anyone has tried it.
- Who upgrades the thing, how often, and in what window.

Either answer is defensible. "It is cheaper" without the second column, and "we can migrate later"
without the export path, are not.
