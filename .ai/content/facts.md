# Verified Public Facts

Last reviewed: 2026-10-08. Primary sources: Ivan Dolgov's current English CV and his Japanese SkillSheet (reviewed 2026-10-07; it is not updated for the Frameworx role, which the CV covers). Reconfirm before publication when career information changes.

## Identity and contact

- Name: Ivan Dolgov.
- Location: Tokyo, Japan.
- Public email: `ivan.d@wanya.group`.
- GitHub: `https://github.com/aligator527`.
- LinkedIn: `https://linkedin.com/in/aligator527`.
- Languages: Russian (native), Japanese (professional working proficiency, JLPT N1), English (professional working proficiency).
- Do not publish a telephone number in site copy.
- Exception, confirmed by Ivan on 2026-09-18: the downloadable CV PDF (`public/resume/ivan-dolgov-cv.pdf`) may be published as supplied, including the telephone number, photo, and its generator metadata.

## Current positioning

- Tech Lead and Full-Stack Engineer.
- 5+ years of experience as stated in the current CV.
- Strongest public technical themes: React, TypeScript, Go, AWS, system architecture, requirements definition, technical leadership, code review, and enterprise software.

## Current role

- Frameworx, Daiwa House Group. (Spelling confirmed by Ivan on 2026-09-18; the CV's "Frameworks / FRAMEWORX" is superseded.)
- Tech Lead — Next-Generation WMS.
- Started September 2026.
- Publicly approved scope from CV: technical planning and architecture across frontend, backend, cloud, security, and WMS/WCS integration; technology selection; architecture standardization; engineering guidelines; architecture decisions; technical PoCs.

Do not publish unreleased product screenshots, internal roadmaps, confidential diagrams, security details, customer names, or private delivery dates without explicit approval.

## Previous experience

### Ikigai Co., Ltd. — Project Lead / Full-Stack Engineer, contract

- July 2025 – May 2026.
- Led 0→1 development of an AI chat game platform in a 20-person cross-functional team.
- Confirmed by Ivan on 2026-09-18: the platform was consumer-facing.
- React and TypeScript frontend; Go backend; AWS infrastructure with Terraform, Lambda, and API Gateway.
- Database: PostgreSQL. Confirmed by Ivan on 2026-10-07 from his SkillSheet; this supersedes the CV's DynamoDB for this engagement.
- Keycloak authentication and authorization; planning, technical decisions, code reviews, standards, and release work.
- Case-study detail, confirmed by Ivan on 2026-09-18:
  - Product: users converse with AI characters inside a game scenario. The scenario adapts to the player's replies while its overall flow stays as designed. The central product concern was realistic conversation: responses are computed by a small ecosystem of AI agents, balancing response speed against realism, including the ability of a character to refuse rather than agree with everything.
  - Starting point: an earlier codebase existed, written by one developer more than a year before; it provided little foundation for the new project.
  - Team: engineers, designers, content, AI developers, and a PM. Ivan reported directly to the company director and the PM.
  - Go was selected after several PoCs, on the balance of scalability, maintainability, speed, and suitability for AI-assisted development. Other stack choices were made in a similar PoC-based way (no further detail supplied).
  - Keycloak was selected over Cognito and Auth0 because the B2C product was planned for a potentially very large user base, where per-user managed-identity pricing would have become a major cost. Do not publish a planned user count.
  - Architecture at publishable abstraction: user → web client (Vite) → platform-level Keycloak → API server → database. Keycloak ran on a separate domain as a shared sign-in entry point for a planned platform of multiple AI-interactive applications with one database and one entry point. The wider platform was planned, not delivered; present it as design intent.
  - Retrospective: today Ivan would standardize the workflow for AI-assisted development; its absence lowered overall output quality and caused rework that did not meet shared expectations.
  - SkillSheet detail (Ivan's own Japanese SkillSheet, reviewed 2026-10-07): chat UI, game-progress screens, and state-management logic in React and TypeScript; TanStack for data fetching and state; chat-history storage and session control; AI response API integration; LLM-based chat experience design and prompt engineering; Terraform IaC improving reproducibility of development and verification environments; agile delivery with sprint planning, task management, code review, technology selection, and release management.

### Nagashima Konpo Co., Ltd. — Full-Stack Engineer, contract

- December 2024 – December 2025.
- Production web and mobile SaaS for the packaging industry.
- Current CV states usage by more than 10 Japanese companies and a project team of approximately 10 people.
- Confirmed by Ivan on 2026-09-18: publish this as adoption during the engagement (December 2024 – December 2025), not as a present-tense figure.
- React, Next.js, React Native, Expo, AWS Amplify, Lambda, AppSync, DynamoDB, and S3.
- Search and large-data performance work; Node.js 16→20 migration; PoCs, reviews, external developer support, releases.
- Problem context, confirmed by Ivan on 2026-09-18: as stored data grew, loading times and general responsiveness degraded across the SaaS for all customers. The original database structure had been created quickly, without planning for expansion to further companies, and its documentation was not current, so team members lacked a shared understanding of how it already worked. No quantitative measurement of the degradation or the improvement is approved for publication.
- Case-study detail, confirmed by Ivan on 2026-09-18:
  - Diagnosis: reading code, profiling queries, and CloudWatch; hard-to-follow parts were drawn as diagrams.
  - Causes: DynamoDB Scan used where Query was appropriate, missing GSIs, poorly chosen keys, N+1 patterns in AppSync resolvers, loading all data to the client, and no pagination.
  - Changes: new indexes and access patterns, pagination, a separate search mechanism (technology not stated), caching, resolver changes, and data migration. No alternative approaches were formally evaluated.
  - Release safety: each milestone verified step by step on staging, team code review in parallel, production releases at night outside customer usage hours.
  - Ivan updated the data-model documentation after the work.
  - Node.js 16→20: difficulties with dependencies and Lambda; verified with tests and manually against a predefined workflow of tenant setup and normal SaaS use.
  - External developers were contractors; support covered review, onboarding, documentation, and explaining their first tasks.
  - Domain detail, confirmed by Ivan on 2026-10-08: the SaaS covers the whole job lifecycle for a packing order — 案件作成 (creating the job) → 見積 (quotation) → 梱包設計 (packing design) → 梱包作業 (the packing work itself) → 請求書 (invoice) → コンテナ設計 (container loading plan) → loading onto the truck. The "Case" table is this 案件 entity: the job, not an English common noun.
  - Architecture: frontend, backend, and mobile in separate repositories, each with its own Amplify app and dev/staging/production environments. GraphQL (AppSync) over DynamoDB. The web frontend acted mostly as a BFF; the backend held specific heavy processing unsuitable for the frontend.
  - Retrospective: plan how to return production to its previous state for each change, since dev → staging → production does not guarantee a successful production release; assess impact on other components in advance.
  - Outcome, qualitative wording approved for publication: search timeouts decreased and customer complaints decreased substantially.
  - SkillSheet detail (reviewed 2026-10-07): index design for faster search; timeout improvements when exporting large volumes of data; migration of the Case data table; refactoring of the formula modal; removal of unnecessary requests; feature work including schedule reload, quotation/invoice/packing creation flows, automatic transitions, and notifications; UI fixes for mobile layout, list navigation, and searchability; validation and bug-fix work; PoCs for the move to a mobile application.

### Flaretech Co., Ltd. — formerly Marvel — Software Engineer / Project Lead

- March 2023 – May 2025.
- Led multiple client projects with teams of approximately five people.
- Requirements, documentation, React/Next.js development, AWS deployment, production support, and client coordination.
- Project detail from Ivan's SkillSheet, confirmed by Ivan on 2026-10-07 to have been delivered through Flaretech. Client names are not approved for publication; industries are.
  - Insurance, 2025/01–2025/04, approximately 40 people, Full-Stack Engineer (not lead): sales-support and application-management system. Confirmed by Ivan on 2026-10-08: the "agents" in this system are insurance sales representatives (募集人), the licensed people who sell policies — not agencies, and not software agents. JavaScript frontend; Java and Spring Framework backend. Screens for proposal documents, agents, and application/proposal search; customization work; testing; support for coordinating outsourced development. Azure DevOps.
  - Recruitment agency, 2024/12–2025/01, approximately 5 people, Project Lead: new corporate site. Client negotiation, requirements, specification work, Next.js/React frontend, AWS setup, launch and operation, SEO. Japanese-language requirements interviews and design documentation.
  - Information and communications, 2024/08–2024/12, approximately 5 people, Project Lead: multilingual corporate site in Japanese, English, Chinese, and Russian. Same end-to-end scope, including UI/UX and SEO.
  - Electricity and gas, 2023/10–2024/08, approximately 5 people, Full-Stack Engineer: CRM for a company that connects electricity consumers with suppliers. Confirmed by Ivan on 2026-10-08: the CRM held not only customers but the supply-point identification numbers (供給地点特定番号), the voltage class of each connection (低圧 / 高圧 / 特別高圧), and the tariff structure (基本料金 and 電力量料金, including seasonal rates). React frontend; PHP/Laravel backend; call-management and content features; investigation, testing, and implementation support for introducing a call system.
  - Information and communications, 2023/04–2024/02, approximately 5 people, Frontend Engineer: SaaS for freelance job matching and career support. Next.js, React, TypeScript; new features, UI improvement, refactoring of the existing codebase from Figma mockups.
- Team sizes therefore range from approximately 5 to approximately 40; do not state a single figure for all projects.

### Independent freelance — Full-Stack Engineer

- August 2021 – January 2023.
- Delivered web applications and business systems in one- to two-person delivery environments.
- React, Vue.js, Python/Django, PHP, automation, data collection, e-commerce improvements, and client-facing requirements work.

## Education and certifications

- MBA in progress, GLOBIS University, April 2026 – present.
- Matsuo–Iwasawa Laboratory Global Consumer Intelligence program, The University of Tokyo, 2026 — in progress (confirmed 2026-09-18).
- Fundamental Information Technology Engineer Examination, IPA Japan.
- Information Security Management Examination, IPA Japan.
- JLPT N1.

## Technology inventory

Treat this as experience inventory, not a claim of equal mastery:

- Frontend: React, Next.js, TypeScript, JavaScript, React Native, TanStack, MUI, Tailwind CSS.
- Backend: Go, Java/Spring, PHP/Laravel, Python/Django, Node.js.
- Cloud/infrastructure: AWS, Terraform, Lambda, API Gateway, AppSync, DynamoDB, Amplify, S3, CloudFront.
- Data/security: PostgreSQL, MySQL, DynamoDB, Keycloak.
- AI: LLM integration, RAG, workflow automation, prompt engineering, AI-driven R&D.

## Unverified or approval-required

Do not publish without a direct source and explicit approval:

- financial impact;
- conversion, performance, or revenue percentages;
- named client relationships not already public;
- user counts other than the CV-approved SaaS adoption claim above;
- employer-internal promotion plans;
- future degrees, certifications, titles, or projects;
- confidential WMS architecture and release information.

