---
name: deploy
description: Validates and deploys the Astro portfolio to GitHub Pages only when explicitly invoked by the user.
disable-model-invocation: true
allowed-tools: Read Grep Glob Bash(pnpm install --frozen-lockfile) Bash(pnpm run *) Bash(git status *) Bash(git diff *) Bash(git push *)
---

# Deploy to GitHub Pages

Target/environment: `$ARGUMENTS`

1. Read `.ai/engineering/deployment.md` and `.ai/qa/definition-of-done.md`.
2. Confirm the user explicitly requested deployment.
3. Confirm the intended repository, branch, Pages base path, and domain.
4. Refuse to continue with unresolved secrets, private content, a dirty ambiguous worktree, or failing checks.
5. Run the full quality gate.
6. Review the exact diff and deployment workflow.
7. Push only the intended commits and only when authorized.
8. Verify the deployment result and final URL.

Never force-push, rewrite history, expose secrets, or modify account/repository settings without separate explicit approval.

