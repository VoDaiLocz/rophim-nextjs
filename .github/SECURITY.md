# Security Policy

## Supported Branch

Security fixes are handled on `main`.

## Reporting

Do not open public issues for secrets, authentication bypasses, injection bugs, or exploitable vulnerabilities.

Email the maintainer listed in `README.md` with:

- affected route, package, or workflow
- reproduction steps
- impact and exploitability notes
- logs or screenshots with secrets redacted

## CI Security Gates

- Dependency Review blocks pull requests that introduce new high severity dependency risk.
- CodeQL scans JavaScript and TypeScript on pull requests, pushes to `main`, and weekly.
- Dependabot opens weekly dependency and GitHub Actions update pull requests.
- Backend production deploys require GitHub Actions to trigger the Render deploy hook
  and pass `/health` after deployment.
