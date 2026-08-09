# Sprint 13 - Production Release

**Sprint:** Sprint 13  
**Phase:** Phase 04 - Production Readiness  
**Duration:** 3-4 Weeks  
**Release Target:** v1.0.0  
**Status:** Planned

---

# Sprint Goal

Take the ERP platform to production by provisioning production infrastructure, separating environments and secrets, automating deployment and rollback, establishing backup and disaster recovery, completing a production readiness review, and publishing the v1.0.0 release.

At the end of this sprint, the system should be running in production with a documented, rehearsed procedure for every operational event.

---

# Sprint Context

The platform is feature complete, secured, and measured:

```text
Sprint 10        Feature complete
Sprint 11        Security hardened
Sprint 12        Performance validated
```

What remains is the difference between software that works and software that is **operated**:

```text
Where does it run?

        ↓

How does new code get there?

        ↓

What happens when a deployment fails?

        ↓

What happens when the database is lost?
```

Sprint 13 answers all four with rehearsed procedures, not intentions.

---

# Business Outcome

After completing this sprint, the ERP platform will have:

- A provisioned production environment.
- Separated staging and production configuration.
- Secrets managed outside the repository.
- An automated deployment pipeline with rollback.
- Automated backups with a verified restore.
- A completed production readiness review.
- A published v1.0.0 release.

---

# Sprint Objectives

By the end of this sprint, learners should understand:

- Environment separation and configuration management.
- Infrastructure provisioning.
- Continuous deployment pipelines.
- Safe database migrations in production.
- Deployment strategies and rollback.
- Backup, restore, and recovery objectives.
- Release management and versioning.
- Go-live procedure and post-release verification.

---

# Sprint Theme

## "A Release Is a Rehearsed Procedure"

Amateur releases rely on the person who knows how it works.

Professional releases rely on a procedure anyone on the team can follow:

```text
Documented        Anyone can execute it

Automated         The same steps run every time

Reversible        A failure is recoverable, not a crisis

Rehearsed         It has been done before, not just written down
```

A backup that has never been restored is not a backup.

---

# Business Capability

## Production Release

This sprint delivers:

- Production infrastructure.
- Environment and configuration management.
- Deployment automation.
- Backup and disaster recovery.
- Readiness review.
- Release execution.

---

# Domain Concepts

---

# Environment

An isolated instance of the system with its own data and configuration.

```text
Development     Local, disposable data
Staging         Production-like, safe to break
Production      Real users, real data
```

Environments differ only in configuration, never in code.

---

# Deployment Pipeline

The automated path from a merged commit to running software.

```text
Merge to main

        ↓

Build

        ↓

Test

        ↓

Security Scan

        ↓

Deploy to Staging

        ↓

Verify

        ↓

Approve

        ↓

Deploy to Production
```

---

# Deployment Strategy

How new code replaces old code.

| Strategy | Behaviour |
|----------|-----------|
| Recreate | Stop old, start new. Downtime. |
| Rolling | Replace instances gradually. |
| Blue-Green | Run both, switch traffic, keep old for rollback. |

---

# Rollback

Returning to the previous working version.

```text
Deployment fails

        ↓

Health check fails

        ↓

Traffic returns to previous version

        ↓

System restored
```

Rollback must be faster than diagnosis.

---

# Recovery Objectives

| Objective | Question | Example Target |
|-----------|----------|----------------|
| RPO (Recovery Point Objective) | How much data can we afford to lose? | 1 hour |
| RTO (Recovery Time Objective) | How long can we afford to be down? | 4 hours |

These are business decisions, not technical ones.

---

# Go-Live Checklist

The list of conditions that must all be true before production traffic is accepted.

---

# Sprint Scope

---

# 1. Production Infrastructure

## Objective

Provision the environment the system will run in.

## Tasks

- Define the production architecture.
- Provision application, worker, database, and cache resources.
- Configure networking, TLS, and the domain.
- Configure resource limits and restart policies.
- Document the infrastructure as code or as a reproducible procedure.

## Business Rules

- Production infrastructure is reproducible, not hand-configured.
- Production data is never copied to development without anonymization.
- Access to production is restricted and logged.
- Staging mirrors production configuration at reduced scale.

## Acceptance Criteria

- Production environment provisioned and reachable over HTTPS.
- Staging environment provisioned and matching production configuration.
- Infrastructure definition committed to the repository.
- Resource limits and restart policies configured.
- Production access restricted and documented.

---

# 2. Environment and Secrets Management

## Objective

Keep configuration separate from code and secrets out of the repository.

## Tasks

- Define the full configuration variable set per environment.
- Store production secrets in a secret manager.
- Inject configuration at deployment time.
- Validate required configuration at application startup.
- Document the secret rotation procedure.

## Business Rules

- The same build artifact runs in every environment.
- No environment-specific value is compiled into the application.
- The application fails fast and loudly on missing required configuration.
- Production secrets are accessible only to the deployment process and named administrators.
- Secrets are rotated on a documented schedule and after any staff change.

## Acceptance Criteria

- Configuration variable set documented per environment.
- Secrets stored in a secret manager, not in the repository or CI variables in plain text.
- Startup configuration validation implemented.
- The same artifact deploys to staging and production.
- Rotation procedure documented.

---

# 3. Continuous Deployment Pipeline

## Objective

Make deployment automatic, repeatable, and reversible.

## Tasks

- Extend the CI pipeline into continuous deployment.
- Build a versioned, immutable artifact.
- Deploy automatically to staging on merge.
- Require manual approval for production deployment.
- Run database migrations as a controlled pipeline step.
- Run smoke tests after every deployment.
- Implement automatic rollback on failed health checks.

## Business Rules

- Only the pipeline deploys to production; no manual deployment.
- Every deployment is traceable to a commit and a release tag.
- Migrations are backward compatible so the previous version can still run.
- A failed smoke test triggers rollback automatically.
- Deployment events are recorded with who approved them and when.

## Acceptance Criteria

- Pipeline builds a versioned artifact.
- Automatic deployment to staging works.
- Production deployment requires approval.
- Migrations run as a controlled step.
- Smoke tests run post-deployment.
- Automatic rollback demonstrated on an intentionally failing deployment.

---

# 4. Backup and Disaster Recovery

## Objective

Guarantee that data can be recovered.

## Tasks

- Define RPO and RTO with the business.
- Configure automated database backups.
- Store backups separately from the primary database.
- Define backup retention.
- Write the disaster recovery runbook.
- Perform a full restore drill into a clean environment.
- Record actual restore time against the RTO.

## Business Rules

- Backups run automatically on a schedule meeting the RPO.
- Backups are stored in a separate failure domain from the primary.
- Backup success and failure are monitored and alerted.
- A restore drill is performed before go-live and repeated on a schedule.
- The drill result is recorded whether or not it meets the RTO.

## Acceptance Criteria

- RPO and RTO agreed and documented.
- Automated backups running and monitored.
- Backup retention configured.
- Disaster recovery runbook written.
- Full restore drill performed into a clean environment.
- Actual restore time recorded and compared to the RTO.

---

# 5. Production Readiness Review

## Objective

Verify, as a team, that the system is ready for real users.

## Review Areas

```text
Functionality      All acceptance criteria across sprints met
Security           Sprint 11 criteria met, no high or critical findings
Performance        Sprint 12 budgets met under load
Reliability        Health checks, restart policies, graceful shutdown
Recoverability     Backup verified by drill
Deployability      Deployment and rollback demonstrated
Observability      Logs accessible, errors visible
Documentation      Runbooks, setup guide, API docs current
Support            Incident procedure and escalation defined
```

## Business Rules

- Every review area must pass or carry a documented, accepted risk.
- The review is completed before the release, not after.
- An unresolved critical finding blocks go-live.

## Acceptance Criteria

- Go-live checklist created and completed.
- Every review area assessed and signed off.
- Open risks documented with owners.
- Incident response procedure defined.
- Rollback plan documented for the release itself.

---

# 6. v1.0.0 Release and Post-Release Verification

## Objective

Execute the release and confirm the system is healthy.

## Tasks

- Finalize the CHANGELOG for v1.0.0.
- Write the release notes.
- Tag the release.
- Deploy to production through the pipeline.
- Run post-release verification.
- Monitor for an agreed stabilization period.
- Publish the release.

## Post-Release Verification

```text
Health endpoint responding

        ↓

Authentication working

        ↓

One transaction per module verified

        ↓

Reports generating

        ↓

Background jobs running

        ↓

Notifications delivering

        ↓

Error rate within threshold
```

## Business Rules

- The release is tagged from a green pipeline only.
- Verification is executed by someone other than the deployer where possible.
- The rollback decision point is defined before deployment begins.
- The release is announced only after verification passes.

## Acceptance Criteria

- CHANGELOG updated for v1.0.0.
- Release notes published.
- Release tagged and deployed through the pipeline.
- Post-release verification checklist completed and recorded.
- Stabilization period observed with no critical incidents.
- Release published.

---

# Deployment Architecture

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

                          │

              Automated Backups (separate storage)
```

---

# Environment Configuration

| Variable | Development | Staging | Production |
|----------|-------------|---------|------------|
| `NODE_ENV` | development | staging | production |
| `DATABASE_URL` | local | staging DB | production DB (secret) |
| `JWT_SECRET` | local value | secret manager | secret manager |
| `REDIS_URL` | local | staging cache | production cache |
| `NEXT_PUBLIC_API_URL` | localhost | staging domain | production domain |
| `LOG_LEVEL` | debug | info | info |
| `SMTP_*` | mock | test mailbox | production relay (secret) |

---

# Release Process

```text
Feature merged to development

        ↓

development merged to main

        ↓

Pipeline: build, test, scan

        ↓

Deploy to staging automatically

        ↓

Staging verification

        ↓

Manual approval

        ↓

Database migration

        ↓

Deploy to production

        ↓

Smoke tests

        ↓

Pass → Announce      Fail → Automatic rollback
```

---

# GitHub Execution

---

# Epic

## Epic: Production Release

Purpose:

Move the ERP platform into production with automated, reversible, and rehearsed operational procedures.

---

# GitHub Issues

---

# Issue 081 - Provision Production Infrastructure

Type:

```
Task
```

Acceptance Criteria:

- Production environment provisioned and reachable over HTTPS.
- Staging environment matches production configuration.
- Infrastructure definition committed.
- Resource limits and restart policies configured.
- Production access restricted and documented.

---

# Issue 082 - Implement Environment and Secrets Management

Type:

```
Task
```

Acceptance Criteria:

- Configuration variable set documented per environment.
- Production secrets stored in a secret manager.
- Startup configuration validation implemented.
- The same artifact deploys to staging and production.
- Rotation procedure documented.

---

# Issue 083 - Build Continuous Deployment Pipeline

Type:

```
Task
```

Acceptance Criteria:

- Versioned artifact built by the pipeline.
- Automatic staging deployment on merge.
- Production deployment gated by approval.
- Migrations run as a controlled step.
- Smoke tests run post-deployment.
- Automatic rollback demonstrated.

---

# Issue 084 - Implement Backup and Disaster Recovery

Type:

```
Task
```

Acceptance Criteria:

- RPO and RTO agreed and documented.
- Automated backups running and monitored.
- Retention configured.
- Disaster recovery runbook written.
- Full restore drill performed and timed against the RTO.

---

# Issue 085 - Complete Production Readiness Review

Type:

```
Documentation
```

Acceptance Criteria:

- Go-live checklist created and completed.
- All review areas assessed and signed off.
- Open risks documented with owners.
- Incident response procedure defined.
- Release rollback plan documented.

---

# Issue 086 - Execute v1.0.0 Release

Type:

```
Task
```

Acceptance Criteria:

- CHANGELOG updated for v1.0.0.
- Release notes published.
- Release tagged and deployed through the pipeline.
- Post-release verification completed and recorded.
- Stabilization period observed without critical incidents.

---

# Development Workflow

Every change follows:

```text
GitHub Issue

        ↓

Feature Branch

        ↓

Development

        ↓

Commit

        ↓

Pull Request

        ↓

Code Review

        ↓

Merge to development

        ↓

Merge to main

        ↓

Pipeline Deploy

        ↓

Release
```

---

# Testing Requirements

## Deployment Testing

Validate:

- Pipeline builds and deploys to staging successfully.
- Production deployment requires approval.
- Migrations apply and are backward compatible.
- Smoke tests detect a broken deployment.
- Automatic rollback restores the previous version.

---

## Recovery Testing

### Restore Drill

```text
Provision clean environment

        ↓

Restore latest backup

        ↓

Start application against restored database

        ↓

Verify data integrity

        ↓

Record elapsed time

        ↓

Compare against RTO
```

---

### Rollback Drill

```text
Deploy an intentionally failing version

        ↓

Health check fails

        ↓

Automatic rollback triggers

        ↓

Previous version serving traffic

        ↓

Record elapsed time
```

---

## Smoke Testing

Run after every deployment:

- Health endpoint responds.
- Login succeeds.
- One read and one write per module succeeds.
- A report generates.
- A background job executes.

---

## Regression Testing

Validate:

- The full automated test suite passes against the release candidate.
- Security and performance gates from Sprints 11 and 12 still pass.

---

# Documentation Deliverables

## Business Documentation

- Go-live checklist.
- Service level expectations.
- Support and escalation procedure.

---

## Technical Documentation

- Production architecture documentation.
- Deployment runbook.
- Backup and disaster recovery runbook.
- Incident response procedure.
- Environment configuration reference.
- ADR: deployment and rollback strategy.
- ADR: backup and recovery objectives.
- CHANGELOG updated to v1.0.0.

---

# Sprint Deliverables

## Infrastructure

Completed:

- Production environment.
- Staging environment.
- Infrastructure definition committed.

---

## Engineering

Completed:

- Continuous deployment pipeline.
- Automated rollback.
- Automated backups.
- Smoke test suite.

---

## Operations

Completed:

- Restore drill performed.
- Rollback drill performed.
- Readiness review completed.
- Incident procedure defined.

---

## Release

Completed:

- v1.0.0 tagged, deployed, verified, and published.

---

# Sprint Review

The learner demonstrates:

1. Show the production and staging environments.
2. Show configuration and secrets separated from code.
3. Trigger a deployment through the pipeline.
4. Show an intentionally failing deployment rolling back automatically.
5. Show automated backups and the restore drill result.
6. Walk through the completed go-live checklist.
7. Show the v1.0.0 release and post-release verification record.

---

# Sprint Retrospective

## Discussion Topics

- Differences discovered between development and production.
- Problems found during the restore drill.
- Whether the rollback was fast enough.
- Gaps in the readiness checklist.
- Lessons learned for future releases.

---

# Release

**Version:** `v1.0.0`

This is the first production release of the ERP platform.

---

# Release Notes

```markdown
# v1.0.0

First production release of the ERP platform.

## Included Capabilities

- Identity and Access Management
- Organization and Employee Management
- Human Resource Management
- Inventory Management
- Sales Management
- Purchasing Management
- Finance and Accounting
- Reporting and Analytics
- Workflow and Notification Engine

## Production Readiness

- Security hardened with MFA, least-privilege authorization, and CI security scanning
- Performance budgets defined and met under load
- Automated deployment with rollback
- Automated backups with a verified restore procedure

## Operations

- Deployment runbook
- Disaster recovery runbook
- Incident response procedure
```

---

# Definition of Done

Sprint 13 is complete when:

- [ ] Production infrastructure provisioned and reproducible.
- [ ] Staging matches production configuration.
- [ ] Secrets managed outside the repository.
- [ ] Continuous deployment pipeline working.
- [ ] Production deployment gated by approval.
- [ ] Automatic rollback demonstrated.
- [ ] Automated backups running and monitored.
- [ ] Restore drill performed and timed against the RTO.
- [ ] Go-live checklist completed and signed off.
- [ ] Incident response procedure defined.
- [ ] CHANGELOG and release notes updated.
- [ ] v1.0.0 tagged and deployed through the pipeline.
- [ ] Post-release verification completed.
- [ ] Stabilization period observed without critical incidents.
- [ ] Documentation completed.
- [ ] Release v1.0.0 published.

---

# Skills Acquired

After completing Sprint 13, learners will understand:

## DevOps

- Infrastructure provisioning.
- Environment and configuration management.
- Continuous deployment.
- Safe production migrations.

---

## Site Reliability

- Backup and recovery objectives.
- Restore and rollback drills.
- Health checks and graceful shutdown.
- Incident response.

---

## Release Management

- Versioning and tagging.
- Release notes and changelogs.
- Go-live checklists.
- Post-release verification.

---

## Professional Practice

- Operating software other people depend on.
- Rehearsing procedures rather than documenting intentions.
- Making failure recoverable instead of unlikely.

---

# Next Sprint Preview

# Sprint 14 - Refactoring & Technical Debt Reduction

Planned:

- Technical debt inventory and prioritization.
- Code quality metrics and baseline.
- Backend refactoring.
- Frontend refactoring.
- Test suite improvement.
- Documentation and ADR cleanup.
