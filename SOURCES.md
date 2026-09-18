# Configuration Sources

The pack was authored against the official documentation available on 2026-09-18. Recheck these sources when upgrading tooling or changing deployment.

## Claude Code

- Project memory, imports, and `.claude/rules/`: https://code.claude.com/docs/en/memory
- Settings and precedence: https://code.claude.com/docs/en/settings
- Permission syntax and enforcement: https://code.claude.com/docs/en/permissions
- Project subagents: https://code.claude.com/docs/en/sub-agents
- Project skills: https://code.claude.com/docs/en/skills
- Hooks: https://code.claude.com/docs/en/hooks

## Astro and GitHub Pages

- Astro deployment to GitHub Pages: https://docs.astro.build/en/guides/deploy/github/
- GitHub Pages publishing sources: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Do not freeze GitHub Action version numbers in instruction prose. When implementing the workflow, copy current versions from the official Astro guide and commit the lockfile.

