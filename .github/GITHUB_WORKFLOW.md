# GitHub Workflow

## Branching

- `main` is the protected production branch.
- Feature work should use short-lived branches named `feat/...`, `fix/...`, `chore/...`, `test/...`, `docs/...`, or `ci/...`.
- Open pull requests early as drafts when the work is not ready for review.

## Pull Request Gates

Required checks for merge:

- `PR Title / Conventional PR Title`
- `CI / Format`
- `CI / Lint`
- `CI / Typecheck`
- `CI / Test`
- `CI / Build`
- `Dependency Review / Review Dependency Changes`
- `CodeQL / Analyze JavaScript and TypeScript`

Vercel should remain connected through its native GitHub integration for `apps/web`.
Every pull request gets a Vercel Preview Deployment, and merges to `main` deploy the
frontend to production through Vercel.

Backend production deploys are controlled by GitHub Actions. After `CI` passes on
`main`, `Deploy Backend / Render Production Deploy` triggers the Render deploy hook
and polls the backend health endpoint. Until the Render secrets are configured, the
deploy workflow exits successfully with a skipped-deploy summary so `main` does not
stay red during initial infrastructure setup.

Recommended branch protection:

- require pull request before merging
- require at least one approval
- require review from CODEOWNERS
- dismiss stale approvals when new commits are pushed
- require branches to be up to date before merging
- require linear history
- block force pushes and branch deletion

Production environment protection:

- create a GitHub environment named `production`
- require approval before deployment if production changes need manual control
- store backend deploy secrets on the repository or `production` environment

Required repository or environment secrets:

- `RENDER_DEPLOY_HOOK_URL`: Render deploy hook URL for the `rophim-server` service
- `RENDER_BACKEND_HEALTH_URL`: public backend health URL, for example `https://rophim-server.onrender.com/health`

Render service setup:

- use `render.yaml` as the Blueprint source
- keep `autoDeployTrigger: off`
- create the deploy hook in Render and store it in GitHub Secrets
- keep `healthCheckPath: /health`

Blueprint deeplink:

```text
https://dashboard.render.com/blueprint/new?repo=https://github.com/locfaker/rophim-nextjs-monorepo
```

## Local Verification

Run the same gates before pushing:

```bash
pnpm format:check
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

Use `pnpm format` and `pnpm lint:fix` for local cleanup before committing.

## Dependency Workflow

Dependabot opens weekly pull requests for npm packages and GitHub Actions. Treat security updates as priority work, and keep normal dependency updates small enough to review safely.
