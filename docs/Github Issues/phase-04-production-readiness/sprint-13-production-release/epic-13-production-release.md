# [EPIC] Production Release

<!-- GitHub title: [EPIC] Production Release
     Labels: epic, ci
     Milestone: Sprint 13 - Production Release
     Branch: none — epics are not worked on directly
     Create this epic AFTER issues 081-086 exist, then replace the placeholder
     numbers in the task list below with the real GitHub issue numbers.
     Copy everything below this comment into the issue body. -->

## Module: ci
## Sprint: Sprint 13 - Production Release

---

## Purpose

Move the ERP platform into production with automated, reversible, and rehearsed operational
procedures: infrastructure, secrets, deployment, backup, a readiness review, and the v1.0.0
release itself.

```text
Documented        Anyone can execute it

Automated         The same steps run every time

Reversible        A failure is recoverable, not a crisis

Rehearsed         It has been done before, not just written down
```

## Business Value

Twelve sprints of features, one sprint of security hardening, and one sprint of performance work
have produced a system that is correct and fast. This epic is where it becomes *operable* — the
difference between software that works and software a team can run.

## Issues

- [ ] #81 Provision Production Infrastructure
- [ ] #82 Implement Environment and Secrets Management
- [ ] #83 Build Continuous Deployment Pipeline
- [ ] #84 Implement Backup and Disaster Recovery
- [ ] #85 Complete Production Readiness Review
- [ ] #86 Execute v1.0.0 Release

## Release Process

```text
Feature merged to development

        ↓

development merged to main

        ↓

Pipeline: build, test, scan (Issue 074's gates)

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

## Epic Acceptance Criteria

- [ ] All child issues closed
- [ ] Production and staging provisioned and reproducible
- [ ] Secrets sourced from a secret manager; the same artifact deploys everywhere
- [ ] Deployment automated with a demonstrated rollback
- [ ] Backup and restore verified by a timed drill
- [ ] Every prior phase's gate re-confirmed as still passing (security, performance, functional)
- [ ] Go-live checklist completed and signed off
- [ ] v1.0.0 tagged, deployed, and verified
- [ ] Release v1.0.0 published

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-13-production-release.md` |
| Phase overview | `academy/08-sprints/phase-04-production-readiness/phase-overview.md` |
| Gates checked | Issue 074 (Sprint 11 security), Issue 080 (Sprint 12 performance) |
| Release | v1.0.0 |
