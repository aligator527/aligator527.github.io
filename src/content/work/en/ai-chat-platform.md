---
locale: en
code: P02
title: AI Chat Game Platform
summary: 0→1 development of a consumer AI chat game platform, led as Project Lead and full-stack engineer in a 20-person cross-functional team.
role: Project Lead / Full-Stack Engineer
organization: Ikigai Co., Ltd.
engagementType: contract
startDate: '2025-07'
endDate: '2026-05'
status: complete
domains: [Consumer product, AI chat platform]
capabilities: [leadership, architecture, frontend, backend, cloud, security, standards, release]
technologies:
  [React, TypeScript, Vite, TanStack, Go, AWS, Terraform, Lambda, API Gateway, PostgreSQL, Keycloak]
featured: true
order: 2
publicVisibility: public
depth: case-study
heroVariant: stack-left
teamSize: 20-person cross-functional team
sourceNote: facts.md — Ikigai Co., Ltd. entry (current CV), case-study detail confirmed by Ivan on 2026-09-18, and SkillSheet detail reviewed 2026-10-07. PostgreSQL supersedes the CV's DynamoDB for this engagement. Release status and product outcomes were not supplied and are not published.
diagram:
  caption: A request's path, top to bottom. Sign-in runs through a Keycloak server on its own domain, meant as the shared entry point for a planned family of applications. Simplified reconstruction, not the production architecture diagram.
  layers:
    - label: Client
      items: [React, TypeScript, Vite, TanStack]
    - label: Identity · own domain
      items: [Keycloak]
    - label: API & compute
      items: [API Gateway, Lambda, Go]
    - label: Data · shared
      items: [PostgreSQL]
    - label: Infrastructure as code
      items: [Terraform]
---

## 00 / Summary

A contract engagement from July 2025 to May 2026, leading the 0→1 build of a consumer product in which players talk with AI characters inside a game scenario. I combined project leadership with hands-on full-stack work in a 20-person cross-functional team, reporting directly to the company's president and the project manager.

## 01 / Context

The scenario adapts to what the player says, but its overall flow stays as the scenario intends. The product's real subject is the conversation itself. A common weakness of AI characters is that they agree to anything. Here, each reply is worked out by a small ecosystem of AI agents, so that a character can plausibly refuse, and the reply still has to arrive quickly.

An earlier codebase existed, written by one developer more than a year before. It gave little foundation for this scope, so the platform was effectively built anew.

The team combined engineers, designers, content specialists, AI developers, and a project manager.

## 02 / Constraints

- **Speed against realism.** Replies depended on several AI agents, but a conversation that stalls stops feeling like a conversation.
- **Consumer scale.** The product was planned for a potentially very large user base, which makes per-user infrastructure costs matter from the start.
- **More than one product.** The platform was intended to host further AI-interactive applications later, so early decisions had to survive that.

## 03 / Decisions

### Go for the backend, chosen by proof of concept

The backend language was chosen after several proofs of concept rather than by preference. The criteria were scalability, maintainability, speed, and how well the codebase would work with AI-assisted development. Go offered the best balance of the four. Other parts of the stack were chosen in a similar way.

### Keycloak instead of a managed identity service

Managed identity services such as Amazon Cognito and Auth0 price by user. For a consumer product planned for a very large user base, that pricing would have become a major cost. Keycloak has no per-user fee. The trade-off accepted with it is that the identity server becomes part of the system the team operates, rather than a service bought in.

### One sign-in for the platform, not for the app

Keycloak ran on its own domain rather than inside the application. It was intended as the single entry point for the whole platform, a family of AI-interactive applications sharing one sign-in and one database. During this engagement, that wider platform was a design intent, not a delivered system.

## 04 / System

A request passes through four tiers, shown in the diagram above:

1. The web client, built with React, TypeScript, and Vite, with TanStack for data fetching and state.
2. Keycloak, on a separate domain, handling authentication and authorization.
3. The API, written in Go, on AWS Lambda and API Gateway.
4. PostgreSQL as the data store.

The AWS infrastructure was defined in Terraform, which made development and verification environments reproducible rather than hand-built.

What I built on the client was the chat interface, the game-progress screens, and the state logic that keeps a conversation and a scenario in step. On the server, the Go API covered chat-history storage, session control, and the calls that produce an AI reply.

## 05 / AI conversation

The conversation is the product, so the AI side was a design problem rather than an integration task. My part of it was the shape of the exchange: designing the chat experience around what the model can be relied on to do, and the prompt engineering that keeps a character in its role — able to refuse, and still answering fast enough to feel like talking to someone.

## 06 / Delivery

As Project Lead, I was responsible for planning, technical decisions, code review, engineering standards, technology selection, and releases. Work ran in sprints, with planning and task management alongside the hands-on engineering.

Product outcomes belong to the cross-functional team as a whole, and release status and results are not covered here.

## 07 / Retrospective

Today I would standardize the team's workflow for AI-assisted development from the start. Without a shared workflow, output often did not meet the team's shared expectations and had to be reworked, which lowered overall quality. The Go decision anticipated AI-assisted development; the workflow around it needed the same deliberate treatment.
