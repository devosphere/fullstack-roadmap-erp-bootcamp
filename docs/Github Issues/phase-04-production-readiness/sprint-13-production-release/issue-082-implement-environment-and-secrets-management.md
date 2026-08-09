# [TASK] Implement Environment and Secrets Management

<!-- GitHub title: [TASK] Implement Environment and Secrets Management
     Labels: task, ci, security, priority: critical
     Milestone: Sprint 13 - Production Release
     Branch: feature/082-implement-environment-and-secrets-management
     Epic: Production Release
     Depends on: 073, 081
     Blocks: 083
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

Move production secrets into a secret manager, define the full configuration set per environment,
validate required configuration at startup, and prove the same build artifact runs correctly in
every environment.

## Background

Issue 073 established the *principle* — secrets live in environment variables, never in source
control — and audited the repository against it. This issue is where that principle becomes a
production-grade mechanism: a real secret manager, not a `.env` file sitting on a server.

The requirement that matters most here: **the exact same build artifact deploys to staging and
production.** If a build is compiled separately for each environment, staging stops being a
reliable rehearsal of production — Issue 083's pipeline and Issue 084's restore drill both depend on
staging actually representing what production will do. Environment differences must live entirely
in configuration injected at deploy time, never in what gets compiled.

The second requirement carries forward from Issue 010 and Issue 006's pattern: **fail fast and
loudly on missing configuration.** A production deployment that starts successfully with a missing
`JWT_SECRET` and only fails the first time someone tries to log in is a much worse outcome than one
that refuses to start at all.

## User Story

As a DevOps Engineer,
I want secrets stored in a secret manager and injected at deploy time,
So that the same tested artifact can be trusted to run correctly and securely in every environment.

## Acceptance Criteria

```gherkin
Given the production secret manager
When it is inspected
Then no secret value exists in the repository, CI configuration, or any committed file
```

```gherkin
Given a build artifact deployed to staging
When the identical artifact is later deployed to production with production configuration
Then it behaves correctly with no code difference between the two deployments
```

```gherkin
Given a required environment variable is missing at startup
When the application attempts to start
Then it fails immediately with a message naming the missing variable
```

```gherkin
Given production secrets
When access is reviewed
Then only the deployment process and named administrators can read them
```

- [ ] Full configuration variable set documented per environment (development, staging, production)
- [ ] Production secrets stored in a secret manager, not plain CI variables or committed files
- [ ] Configuration injected into the running application at deployment time, not baked into the build
- [ ] Startup configuration validation implemented, extending Issue 006/010's pattern to every required variable
- [ ] Missing required configuration causes the application to fail to start, with a clear error naming what's missing
- [ ] The identical build artifact verified to run correctly against both staging and production configuration
- [ ] Access to production secrets restricted to the deployment process and a named administrator list
- [ ] Secret rotation procedure from Issue 073 verified to work against the production secret manager specifically
- [ ] Configuration reference documented per environment

## Expected Result

Every secret is centrally managed, access-controlled, and injected rather than compiled in. The
build that ran correctly in staging is provably the same build that runs in production.

---

## Scope

### Included

- Secret manager integration
- Per-environment configuration documentation
- Deploy-time configuration injection
- Startup validation for every required variable
- Same-artifact verification across environments
- Access restriction to secrets
- Rotation procedure verification in production

### Out of Scope

- Infrastructure provisioning itself (Issue 081)
- The CI/CD pipeline mechanics that consume this configuration (Issue 083)
- Application-level secrets unrelated to infrastructure (e.g. business data encryption keys, if introduced later)

## Technical Requirements

**Environment configuration reference**

| Variable | Development | Staging | Production |
|----------|-------------|---------|------------|
| `NODE_ENV` | development | staging | production |
| `DATABASE_URL` | local | staging DB (secret) | production DB (secret) |
| `JWT_SECRET` (Issue 010, hardened Issue 070) | local value | secret manager | secret manager |
| `REDIS_URL` (Issue 077) | local | staging cache | production cache |
| `NEXT_PUBLIC_API_URL` | localhost | staging domain | production domain |
| `LOG_LEVEL` | debug | info | info |
| `SMTP_*` (Issue 066) | mock | test mailbox | production relay (secret) |

Extend this table with every variable introduced since Issue 006 — this is the authoritative,
current list, superseding any individual module's `.env.example` as the single reference for what a
full deployment requires.

**Same-artifact principle**

```text
Build pipeline (Issue 083) produces one versioned, immutable artifact

    ↓

Deploy to staging     → inject staging configuration at deploy time
Deploy to production  → inject production configuration at deploy time

    ↓

No environment-specific value is compiled into the artifact itself
```

Verify this concretely: deploy the same artifact hash to staging, confirm it behaves correctly, then
promote that exact artifact to production rather than rebuilding.

**Startup validation**

```text
On application start:

    For every variable marked required in the configuration schema:
        - present?           if not, fail immediately with the variable name
        - correct format?    if not, fail immediately with the reason

    Only after all required configuration validates does the application begin accepting requests
```

This extends the pattern introduced in Issue 006 (database URL) and Issue 010 (JWT secret) to the
full configuration surface accumulated through Sprint 12.

**Secret manager access**

```text
Read access:    the deployment process (via a scoped, non-human credential),
                 and a named list of administrators for break-glass access

Write access:    restricted further than read — who can change a secret is a
                 smaller list than who can read one
```

## Dependencies

- Issue 073 — the secrets-out-of-source-control principle and rotation procedure this issue
  operationalizes in production.
- Issue 081 — the infrastructure this configuration deploys into.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Full environment variable reference documented and current
- [ ] Secret manager integration verified
- [ ] Startup validation tested for every required variable's absence
- [ ] Same-artifact deployment to staging and production verified concretely, not just asserted
- [ ] Secret access restricted and verified
- [ ] Rotation procedure tested against the production secret manager
- [ ] Code review completed
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-13-production-release.md` § 2 |
| Epic | Production Release |
| Operationalizes | Issue 073 |
| Runs on | Issue 081 |
| Consumed by | Issue 083 |
| Pull Request | _to be linked_ |
