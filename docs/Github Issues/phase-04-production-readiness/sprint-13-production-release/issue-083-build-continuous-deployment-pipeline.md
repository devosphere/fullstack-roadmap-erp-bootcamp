# [TASK] Build Continuous Deployment Pipeline

<!-- GitHub title: [TASK] Build Continuous Deployment Pipeline
     Labels: task, ci, priority: critical
     Milestone: Sprint 13 - Production Release
     Branch: feature/083-build-continuous-deployment-pipeline
     Epic: Production Release
     Depends on: 074, 082
     Blocks: 084
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
- [ ] High
- [x] Critical

## Module: ci
## Sprint: Sprint 13 - Production Release

---

## Summary

Extend the CI pipeline into continuous deployment: build a versioned artifact, deploy to staging
automatically, gate production behind approval, run migrations as a controlled step, run smoke
tests, and roll back automatically on failure.

## Background

Issue 009 built CI: build, lint, test on every Pull Request. Issue 074 added a fourth gate:
security. This issue adds the final stage — turning a green pipeline into a running deployment,
without a person manually copying files to a server.

The requirement that carries the most weight: **only the pipeline deploys to production.** Every
deployment traces to a commit and a release tag; there is no path where someone deploys by hand,
because a manual deployment is a deployment nobody can fully reproduce or audit afterward — the same
principle Issue 081 applied to infrastructure, applied here to the release process itself.

**Rollback must be faster than diagnosis.** When a deployment fails its smoke tests, the system
should already be back on the previous version before anyone has finished reading the error — not
after a person notices something is wrong, forms a hypothesis, and manually reverts.

Migrations get their own controlled step because they are the one part of a deployment that isn't
trivially reversible: a schema change applied and then rolled back can leave data in an inconsistent
state if not designed for it, which is why they must be backward compatible with the previous
application version — the version rollback might restore.

## User Story

As a DevOps Engineer,
I want deployment fully automated with an automatic rollback on failure,
So that shipping code to production is routine and safe rather than a manual, risky event.

## Acceptance Criteria

```gherkin
Given a Pull Request merged to main
When the pipeline runs
Then it builds a versioned artifact and deploys it to staging automatically
```

```gherkin
Given a staging deployment that passed verification
When production deployment is initiated
Then it requires explicit manual approval before proceeding
```

```gherkin
Given an approved production deployment
When it runs
Then database migrations execute as a distinct, controlled pipeline step before the application starts serving the new version
```

```gherkin
Given a deployment that completes
When post-deployment smoke tests run
Then a failure triggers automatic rollback to the previous version
```

```gherkin
Given a deployment is rolled back
When the previous version resumes serving traffic
Then the rollback is recorded with who approved the original deployment and when the rollback occurred
```

- [ ] Pipeline extended to build a versioned, immutable artifact from a green `main` build
- [ ] Automatic deployment to staging on every merge to `main`
- [ ] Production deployment gated behind explicit manual approval
- [ ] Every deployment traceable to a specific commit and release tag
- [ ] Database migrations run as a distinct, controlled pipeline step
- [ ] Migrations verified backward compatible — the previous application version can still run against the migrated schema
- [ ] Smoke tests run automatically immediately after every deployment
- [ ] Automatic rollback triggered by a failed smoke test
- [ ] Rollback restores the previous version and is recorded, including who approved the deployment and when rollback occurred
- [ ] No deployment path exists outside the pipeline — verified there is no manual deployment mechanism left available

## Expected Result

Code moves from a merged commit to running in production through one automated, auditable path.
A bad deployment reverts itself before it becomes an incident.

---

## Scope

### Included

- Versioned artifact build
- Automatic staging deployment
- Approval-gated production deployment
- Controlled, backward-compatible migration execution
- Post-deployment smoke testing
- Automatic rollback on failure
- Deployment audit trail

### Out of Scope

- Backup and disaster recovery (Issue 084)
- The production readiness review itself (Issue 085)
- Executing the v1.0.0 release (Issue 086 — this issue builds the mechanism; 086 uses it)
- Blue-green or canary deployment strategies beyond a basic rolling/recreate approach, unless already required by the infrastructure chosen in Issue 081

## Technical Requirements

**Pipeline extension**

Builds on Issue 009's CI and Issue 074's security gates:

```text
Pull Request → build, test, lint, security scan (existing, Issues 009, 074)

        ↓  (on merge to main)

Build versioned artifact

        ↓

Deploy to staging automatically

        ↓

Staging smoke tests

        ↓

Manual approval gate

        ↓

Run migrations (controlled step)

        ↓

Deploy to production

        ↓

Production smoke tests

        ↓

Pass → mark deployment complete, notify
Fail → automatic rollback to previous version
```

**Versioned artifact**

```text
Tagged with the commit SHA and, at release time, the semantic version (Issue 086)

Built once, deployed unmodified to staging and then to production
    (the same-artifact requirement from Issue 082)
```

**Migration safety**

```text
Every migration since Issue 007 must be evaluated (or new ones written going forward)
against this rule:

    The application version being replaced must still function correctly
    against the post-migration schema, for the brief window where old code
    and new schema coexist during a rolling deployment.

Backward-incompatible changes (dropping a column, renaming a table) require
a two-phase approach: deploy code that tolerates both old and new schema first,
migrate, then remove old-schema support in a later deployment.
```

**Smoke tests**

Minimum coverage, run against the freshly deployed environment:

```text
Health endpoint responds (extends the pattern from Issue 006's basic health check)
Login succeeds (Issue 010)
One read and one write succeeds per major module (HR, inventory, sales, procurement, finance)
A report generates (Issue 058)
A background job executes (the worker introduced by Sprint 09/10, provisioned in Issue 081)
```

**Automatic rollback**

```text
Smoke test failure detected

    ↓

Traffic routed back to the previous version (using whatever mechanism Issue 081's
infrastructure provides — instance swap, previous container tag, or equivalent)

    ↓

Deployment marked FAILED, rollback recorded

    ↓

Alert raised (a candidate consumed later by Sprint 15's alerting, Issue 097 —
for now, a direct notification to the deploying team is sufficient)
```

**Deployment audit trail**

```text
Every deployment recorded:
    commit SHA, artifact version, who approved production deployment,
    deployment timestamp, smoke test result, rollback status if applicable
```

## Dependencies

- Issue 074 — the security gates this pipeline extends past.
- Issue 082 — the environment and secrets injection this pipeline's deploy steps depend on.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Pipeline builds a versioned artifact from a green main build
- [ ] Automatic staging deployment verified
- [ ] Production deployment approval gate verified — cannot be bypassed
- [ ] Migration step verified to run in a controlled, ordered position
- [ ] Smoke tests verified to run automatically post-deployment
- [ ] **Rollback demonstrated**: an intentionally broken deployment triggers automatic rollback, verified end to end
- [ ] Deployment audit trail verified to record all required fields
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-13-production-release.md` § 3 |
| Epic | Production Release |
| Extends | Issue 009 (CI), Issue 074 (security gates) |
| Deploys into | Issue 081 |
| Uses configuration from | Issue 082 |
| Used by | Issue 086 (v1.0.0 release) |
| Pull Request | _to be linked_ |
