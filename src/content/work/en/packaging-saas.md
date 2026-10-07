---
locale: en
code: P03
title: Packaging-Industry SaaS
summary: Full-stack work on a production web and mobile SaaS for the packaging industry, where growing data had degraded responsiveness for every customer.
role: Full-Stack Engineer
organization: Nagashima Konpo Co., Ltd.
engagementType: contract
startDate: '2024-12'
endDate: '2025-12'
status: complete
domains: [Packaging industry, B2B SaaS, Mobile]
capabilities: [frontend, backend, cloud, standards, release]
technologies: [React, Next.js, React Native, Expo, AWS Amplify, Lambda, AppSync, DynamoDB, S3]
featured: true
order: 3
publicVisibility: public
depth: case-study
heroVariant: stack-right
teamSize: Approximately 10 people
sourceNote: facts.md — Nagashima Konpo Co., Ltd. entry, case-study detail confirmed by Ivan on 2026-09-18, and SkillSheet detail reviewed 2026-10-07. Adoption figure is the CV-approved claim. No performance metric is published.
diagram:
  caption: Web and mobile clients over one shared AWS backend, reconstructed from my own description. Not a production architecture diagram.
  layers:
    - label: Clients
      items: [React, Next.js, React Native, Expo]
    - label: API · GraphQL
      items: [AWS AppSync]
    - label: Heavy processing
      items: [Lambda]
    - label: Data & storage
      items: [DynamoDB, S3]
    - label: Platform · per repository
      items: [AWS Amplify]
environments:
  caption: Three repositories, each its own Amplify app with its own dev, staging, and production environments — nine deployments in all, over one shared GraphQL data layer. Reconstructed from my own description; not a production diagram.
  stages: [dev, staging, production]
  units:
    - name: Web
      role: Web client, acting mostly as a backend-for-frontend.
      items: [React, Next.js]
    - name: Mobile
      role: Mobile client.
      items: [React Native, Expo]
    - name: Backend
      role: Specific, heavy processing that does not belong in a client.
      items: [Lambda]
  shared:
    label: Shared data
    items: [AWS AppSync (GraphQL), DynamoDB, S3]
---

## 00 / Summary

A contract engagement from December 2024 to December 2025 on a production SaaS for the packaging industry, with web and mobile clients. The current CV reports that more than 10 Japanese companies were using the product during the engagement; the project team was approximately 10 people.

My main work was restoring responsiveness after growing data had slowed the product down for every customer. Alongside it I migrated the Node.js runtime from version 16 to 20 and supported external developers joining the codebase.

## 01 / Problem

The product had grown past the assumptions it was built on. As stored data accumulated, loading times and general responsiveness degraded across the platform — not for one customer or one screen, but for everyone using it.

The cause sat below the symptoms. The database structure had been put together quickly, before the product was extended to further companies, and its documentation was no longer current. The team did not share an accurate picture of how the existing data model behaved, so changing it safely meant first establishing what it did.

## 02 / Constraints

- **Live customers.** Customer companies depended on the system; changes had to reach production without disrupting their work.
- **Separate deployments.** The web client, mobile client, and backend lived in separate repositories, each with its own Amplify app and its own dev, staging, and production environments. A change to shared data had to stay consistent across all of them.
- **No reliable map.** With the documentation out of date, the code and the running system were the only sources of truth.

## 03 / Diagnosis

I rebuilt the picture from evidence rather than from the documentation: reading the code, profiling queries, and following request behaviour in Amazon CloudWatch. Where the code was hard to follow, I drew the data flow out as diagrams before changing anything.

The slowdown was not one defect but several patterns that compound as data grows:

- DynamoDB **Scan** operations, which read an entire table, where a **Query** against a key would do.
- Missing global secondary indexes (GSIs), so common access patterns had no efficient path.
- Partition and sort keys that did not match how the data was actually read.
- N+1 request patterns in AppSync resolvers: one request for a list, then one more per item.
- Loading complete datasets to the client instead of only what a screen needs.
- No pagination.

Each of these is tolerable with a small table and one customer. Together, with a growing number of companies, they slowed the whole platform.

## 04 / Changes

- Indexes designed for the queries search actually runs, and access patterns built around how the product reads its data.
- Pagination, so screens request only what they display.
- A separate search mechanism.
- Caching.
- Resolver changes to remove N+1 patterns.
- Removal of requests the clients did not need to make at all.
- Migration of the Case data table to the new structure.
- Timeout work on the paths that export large volumes of data, where the old structure failed most visibly.

When the work was done, I updated the data-model documentation, so that the next change would not have to start from reverse-engineering again.

## 05 / Delivery

The changes shipped as a series of milestones. Each milestone was verified step by step on staging while engineers on the team reviewed the code in parallel. Production releases ran at night, outside the hours when customers used the system.

The Node.js 16 → 20 migration ran into dependency problems and issues with the Lambda runtime. I verified it with the automated tests and by walking through a predefined workflow by hand: setting up a tenant, then using the SaaS as a customer company would.

I also supported external contractors joining the project: reviewing their code, onboarding them, writing documentation, and walking them through their first tasks.

Performance was not the whole engagement. I also built and improved product features — schedule reloading, the quotation, invoice, and packing-creation flows, automatic screen transitions, and notifications — fixed mobile layout and list-navigation problems, and ran proofs of concept for taking the product further onto mobile.

## 06 / Outcome

After the changes, search timeouts decreased and customer complaints dropped substantially. The product and its adoption are the work of the full team of approximately 10 people; my contribution was the engineering described above.

## 07 / Retrospective

Two things I would do differently now.

First, I would plan for every change how production returns to its previous state if the release goes wrong. Promoting through dev, staging, and production reduces risk, but it does not guarantee that a production release succeeds, and a data migration is exactly where that gap hurts.

Second, I would map the change's impact on other components before starting it, not while verifying it. Three separately deployed repositories sharing one data layer make that map worth drawing first.
