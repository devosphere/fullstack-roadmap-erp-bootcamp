# [TASK] Provision Production Infrastructure

<!-- GitHub title: [TASK] Provision Production Infrastructure
     Labels: task, ci, priority: critical
     Milestone: Sprint 13 - Production Release
     Branch: feature/081-provision-production-infrastructure
     Epic: Production Release
     Depends on: 008, 080
     Blocks: 082
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [ ] Task
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

Provision production and staging environments — application, worker, database, and cache
resources, networking, TLS, and access controls — reproducibly and documented, not hand-configured.

## Background

Issue 008 built a Docker environment for local development. This issue builds the environment real
users will run against, and the standard is different in a way that matters: **reproducibility is
not optional here.** A developer's local Docker setup can be recreated by running `docker compose
up` again. Production infrastructure that was clicked together by hand in a console cannot be
recreated the same way — if the server is lost, so is the knowledge of exactly how it was
configured.

Staging exists specifically so Issue 083's deployment pipeline and Issue 084's backup drill can be
rehearsed against something that behaves like production, without risking production itself. It
must mirror production's configuration shape at reduced scale — not be a different, simpler
environment that happens to also run the app.

Access to production is the other line drawn here: broad access to a development database is
normal; broad access to a production database holding the personal and financial data this system
has accumulated since Sprint 04 is not.

## User Story

As a DevOps Engineer,
I want production infrastructure that is provisioned reproducibly rather than by hand,
So that the environment can be recreated, audited, and trusted rather than depending on institutional memory.

## Acceptance Criteria

```gherkin
Given the production infrastructure definition
When it is applied to a clean cloud account or environment
Then it reproduces the same infrastructure shape without manual intervention
```

```gherkin
Given the production environment
When it is accessed over the public internet
Then it is reachable only over HTTPS
```

```gherkin
Given the staging environment
When its configuration is compared to production
Then it matches in shape (same services, same connections) at a reduced scale
```

```gherkin
Given a request to access the production database or servers directly
When it is attempted by someone not on the documented access list
Then it is denied and the attempt is logged
```

- [ ] Production architecture defined: application, worker, database, cache, load balancer
- [ ] Application, worker, database, and cache resources provisioned for production
- [ ] Networking configured with TLS termination and a registered domain
- [ ] Resource limits and restart policies configured for every service
- [ ] Staging environment provisioned matching production's configuration shape at reduced scale
- [ ] Infrastructure defined as code (or an equivalent reproducible procedure) and committed to the repository
- [ ] Production reachable over HTTPS with HTTP redirected, consistent with Issue 073's transport requirements
- [ ] Access to production infrastructure restricted to a documented, named list
- [ ] Production access attempts and changes logged
- [ ] Infrastructure documentation committed describing the architecture and how to reproduce it

## Expected Result

Production and staging environments exist, can be recreated from a committed definition rather than
institutional memory, and are reachable only as intended — over HTTPS, by authorized people.

---

## Scope

### Included

- Production and staging infrastructure provisioning
- Infrastructure-as-code (or equivalent reproducible procedure)
- Networking, TLS, and domain configuration
- Resource limits and restart policies
- Access restriction and logging
- Architecture documentation

### Out of Scope

- Environment variable and secret content (Issue 082)
- Deployment automation itself (Issue 083)
- Backup configuration (Issue 084)
- Auto-scaling policy tuning (a candidate for post-launch iteration, informed by Issue 080's load test results)

## Technical Requirements

**Target architecture**

```text
                        Users

                          │

                       HTTPS

                          │

                    Load Balancer

                          │

        ┌─────────────────┼─────────────────┐

    Frontend          Backend API        Workers

        │                 │                 │

        └─────────────────┼─────────────────┘

                     Cache Layer

                          │

                  PostgreSQL (Primary)
```

This mirrors the Docker Compose services from Issue 008 (`frontend`, `backend`, `database`) plus
what later sprints added: a worker process (introduced by Sprint 09's scheduled reports and Sprint
10's notification dispatch) and the cache layer from Issue 077.

**Environments**

```text
Production    real users, real data, restricted access
Staging       production-shaped configuration, safe to break,
              used by Issue 083's deployment rehearsal and Issue 084's restore drill
```

**Infrastructure definition**

Commit the provisioning definition to the repository (e.g. `infrastructure/` per the structure
noted in `AGENTS.md`), in whatever form the chosen platform uses — Terraform, a cloud provider's
native IaC tool, or a fully scripted, idempotent setup procedure if a full IaC tool is out of scope
for the programme's stage. The requirement is reproducibility, not a specific tool.

**Resource limits and restart policies**

Every service gets explicit CPU/memory limits and a restart policy (e.g. restart on failure, with
backoff) — not left at platform defaults, which are often either unbounded or too conservative for
this application's actual profile as measured in Issue 075's baseline.

**Access control**

```text
Production database and server access:
    - Named, documented list of who has access and why
    - No shared credentials — individual, attributable access
    - Access changes and connection attempts logged
```

## Dependencies

- Issue 008 — the Docker Compose service definitions this issue's production architecture mirrors.
- Issue 080 — load test results, which inform the resource sizing decisions made here.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Infrastructure definition committed and verified reproducible against a clean environment
- [ ] Production reachable over HTTPS only, verified
- [ ] Staging environment verified to match production's shape at reduced scale
- [ ] Resource limits and restart policies configured and verified
- [ ] Access restricted to a documented list; verified that an unauthorized attempt is denied and logged
- [ ] Code review completed
- [ ] Architecture documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-13-production-release.md` § 1 |
| Epic | Production Release |
| Mirrors | Issue 008 (Docker Compose services) |
| Sized using | Issue 075, Issue 080 (baseline and load test results) |
| Pull Request | _to be linked_ |
