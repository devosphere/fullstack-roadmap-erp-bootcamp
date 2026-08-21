# [TASK] Configure CI Pipeline

<!-- GitHub title: [TASK] Configure CI Pipeline
     Labels: task, ci, priority: high
     Milestone: Sprint 01 - Application Foundation
     Branch: feature/009-configure-ci-pipeline
     Epic: Application Foundation
     Depends on: 005, 006, 007
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [x] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [x] High
- [ ] Critical

## Module: ci
## Sprint: Sprint 01 - Application Foundation & Full-Stack Environment Setup

---

## Summary

Extend the GitHub Actions workflow to install dependencies, lint, test, and build both
applications on every Pull Request, so that broken code cannot reach `development`.

## Background

Issue 003 created a CI workflow that validates repository health — markdown and structure only,
because no build system existed at the time. Now there is one.

CI is the mechanism that makes the Definition of Done enforceable rather than aspirational. A
green check is a claim that the standard was met; if the pipeline does not actually run lint,
tests, and build, the check is decorative.

This pipeline is extended repeatedly later: security scanning in Sprint 11, performance
regression gates in Sprint 12, deployment in Sprint 13, and code quality gates in Sprint 14. The
structure created here needs room for those.

## Acceptance Criteria

```gherkin
Given a Pull Request is opened against development
When the CI workflow runs
Then it installs dependencies, lints, tests, and builds both applications
```

```gherkin
Given a Pull Request contains a lint error or a failing test
When CI runs
Then the workflow fails and the Pull Request is blocked from merging
```

```gherkin
Given a Pull Request touches only the frontend
When CI runs
Then it completes without unnecessary backend work
```

- [ ] `.github/workflows/ci.yml` runs on Pull Requests to `main` and `development`
- [ ] Separate jobs for frontend and backend
- [ ] Dependency installation with caching
- [ ] Lint step for both applications
- [ ] Type check step for both applications
- [ ] Test step for both applications
- [ ] Build step for both applications
- [ ] Backend integration tests run against a PostgreSQL service container
- [ ] Existing markdown and structure validation retained
- [ ] Workflow fails on any step failure
- [ ] Status checks visible on the Pull Request
- [ ] CI documented in `CONTRIBUTING.md`

## Expected Result

Every Pull Request shows passing or failing status checks within a few minutes. A Pull Request
with a lint error, a type error, a failing test, or a broken build cannot be merged.

---

## Scope

### Included

- Install, lint, type check, test, and build for frontend and backend
- Dependency caching
- PostgreSQL service container for integration tests
- Path filtering so unaffected jobs are skipped
- Retention of the Sprint 00 repository health checks
- CI documentation

### Out of Scope

- Security and dependency scanning (Sprint 11, Issue 074)
- Performance regression gates (Sprint 12, Issue 075)
- Continuous deployment (Sprint 13, Issue 083)
- Code quality gates (Sprint 14, Issue 088)
- Branch protection rules (configured in repository settings)

## Technical Requirements

**Pipeline**

```text
Pull Request Opened

        ↓

Install Dependencies (cached)

        ↓

Lint

        ↓

Type Check

        ↓

Test

        ↓

Build
```

**Jobs**

| Job | Runs when | Steps |
|-----|-----------|-------|
| `repo-health` | Always | Markdown lint, link check, structure validation |
| `frontend` | `frontend/**` changed | Install, lint, type check, test, build |
| `backend` | `backend/**` changed | Install, lint, type check, test (with PostgreSQL), build |

**Requirements**

- Node.js version pinned and matching the Dockerfiles from Issue 008.
- Dependency cache keyed on the lockfile.
- Integration tests use a PostgreSQL service container, not a hosted database.
- No secret values in the workflow file.
- Total pipeline runtime kept short enough that developers wait for it.

## Dependencies

- Issue 005 — frontend must exist with lint and build commands.
- Issue 006 — backend must exist with lint and build commands.
- Issue 007 — database layer must exist for integration tests.

## Definition of Done

- [ ] Workflow verified by opening a real Pull Request
- [ ] Verified failing by intentionally introducing a lint error
- [ ] Status checks appear on the Pull Request
- [ ] Pipeline runtime acceptable
- [ ] Code review completed
- [ ] CI green on its own Pull Request
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-00-foundation/sprint-01-application-foundation.md` § 8 |
| DevOps guide | `academy/06-devops/` |
| Epic | Application Foundation |
| Pull Request | _to be linked_ |
