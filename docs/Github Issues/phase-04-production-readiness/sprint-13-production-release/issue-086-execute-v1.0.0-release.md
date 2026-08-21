# [TASK] Execute v1.0.0 Release

<!-- GitHub title: [TASK] Execute v1.0.0 Release
     Labels: task, ci, priority: critical
     Milestone: Sprint 13 - Production Release
     Branch: feature/086-execute-v1.0.0-release
     Epic: Production Release
     Depends on: 085
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

Finalize the CHANGELOG and release notes, tag v1.0.0 from a green pipeline, deploy through the
Issue 083 pipeline, run post-release verification, and observe a stabilization period before
announcing.

## Background

Every issue in this sprint has been building toward this one. Issue 081 provisioned where it runs,
Issue 082 secured what it needs to know, Issue 083 built how it gets there, Issue 084 proved data
can survive a disaster, and Issue 085 confirmed the whole system is ready. This issue is the
execution of all of that — the first time real users depend on what thirteen sprints built.

The discipline that governs this issue: **only a green pipeline can be tagged.** No release is
cut from a branch that hasn't passed the full pipeline from Issue 009 through Issue 083 — tagging
is a statement that this exact commit passed every gate, and that statement must be true by
construction, not by someone's memory that it probably did.

**Verification is executed independently of the deployer where possible** — the same principle
behind requiring a second approver in Sprint 07's segregation of duties (Issue 045): a person
checking their own work is a weaker check than someone else confirming it.

The rollback decision point — what specifically would trigger a rollback, and by whom — is decided
*before* deployment begins, per Issue 085's release-specific rollback plan. Deciding it after
something looks wrong is deciding under pressure, with less clarity than deciding it calmly in
advance.

## User Story

As the Engineering Lead,
I want v1.0.0 released through a verified, rehearsed procedure,
So that the first production release is executed with the same discipline the whole programme has practiced, not as an exception to it.

## Acceptance Criteria

```gherkin
Given the release candidate commit
When it is tagged v1.0.0
Then it comes from a build where the full pipeline — including security and performance gates — passed
```

```gherkin
Given the tagged release
When it is deployed
Then it goes through the Issue 083 pipeline exactly as any other deployment would, with no manual shortcut
```

```gherkin
Given the deployment completes
When post-release verification runs
Then it is executed by someone other than the person who triggered the deployment, where team size allows
```

```gherkin
Given the release passes verification
When the stabilization period elapses
Then no critical incident occurred during that window before the release is formally announced
```

```gherkin
Given the CHANGELOG
When it is reviewed after this issue
Then it accurately reflects every release from v0.1.0 through v1.0.0
```

- [ ] `CHANGELOG.md` finalized and accurate across the full v0.1.0-v1.0.0 history
- [ ] v1.0.0 release notes written, summarizing capability, production readiness, and operations
- [ ] Release candidate confirmed to come from a fully green pipeline, including Issue 074's security gates and Issue 083's own checks
- [ ] Release tagged `v1.0.0`
- [ ] Deployed to production exclusively through the Issue 083 pipeline
- [ ] Post-release verification checklist executed and recorded
- [ ] Verification executed by someone other than the deployer, where team size allows
- [ ] Rollback decision point defined before deployment began, per Issue 085's release-specific plan
- [ ] Stabilization period observed with monitoring
- [ ] No critical incident during the stabilization period, or the release rolled back per the pre-defined plan
- [ ] Release announced only after verification and stabilization both pass
- [ ] Release published on GitHub with the finalized notes

## Expected Result

v1.0.0 exists as a tagged, deployed, independently verified release — the culmination of every
control this phase built, executed exactly as the procedure describes rather than as an
improvised, high-pressure event.

---

## Scope

### Included

- CHANGELOG finalization
- Release notes
- Green-pipeline-only tagging
- Pipeline-only deployment
- Independent post-release verification
- Pre-defined rollback decision point
- Stabilization monitoring
- Release publication and announcement

### Out of Scope

- Fixing any issue discovered during verification or stabilization (handled as its own
  incident/hotfix if it occurs, potentially triggering the pre-defined rollback)
- Post-launch feature work (Phase 05 begins with Sprint 14)
- Marketing or external communication beyond the release notes

## Technical Requirements

**CHANGELOG finalization**

```text
CHANGELOG.md updated to reflect every release, v0.1.0 through v1.0.0, in the format
established since Issue 001 created the (initially empty) file — confirm every intervening
sprint's release notes made it in, not just this one
```

**Release notes** (drawing together every capability and control from Sprints 00-13)

```text
# v1.0.0

First production release of the ERP platform.

## Included Capabilities
    Identity and Access Management, Organization and Employee Management,
    Human Resource Management, Inventory Management, Sales Management,
    Purchasing Management, Finance and Accounting, Reporting and Analytics,
    Workflow and Notification Engine

## Production Readiness
    Security hardened with MFA, least-privilege authorization, and CI security scanning
    Performance budgets defined and met under load
    Automated deployment with rollback
    Automated backups with a verified restore procedure

## Operations
    Deployment runbook, disaster recovery runbook, incident response procedure
```

**Release gates** — every one of these must be true before tagging:

```text
All automated tests passing               (Issue 009's suite, extended by every sprint since)
No critical or high security findings     (Issue 074)
Performance budgets met                   (Issue 080)
SLOs — not yet formally defined; deferred to Sprint 15, Issue 098 — treated as N/A for v1.0.0
UAT / acceptance criteria signed off       (implicit across Sprints 00-10's Definitions of Done)
Documentation complete                    (Issue 085)
Backup verified                            (Issue 084)
Rollback plan documented                   (Issue 083, Issue 085)
```

**Post-release verification checklist**

```text
Health endpoint responding
Authentication working (including MFA for privileged roles, per Issue 070)
One transaction verified per module: HR, inventory, sales, procurement, finance
Reports generating (Issue 058)
Background jobs running (report scheduling from Issue 062, notification dispatch from Issue 066)
Notifications delivering
Error rate within the threshold established by Issue 075's baseline
```

**Release process**

```text
Feature merged to development → merged to main → pipeline green
                                                        ↓
                                              Tag v1.0.0
                                                        ↓
                                          Deploy via Issue 083 pipeline
                                                        ↓
                                        Post-release verification (independent)
                                                        ↓
                              Pass → stabilization period → announce
                              Fail → execute the Issue 085 rollback plan
```

**Independent verification**

Where the team has more than one person available, the person who approved and triggered
production deployment is not the same person who signs off on post-release verification — this
mirrors the segregation of duties already required in Issue 045's approval workflow, applied to the
release process itself.

## Dependencies

- Issue 085 — the completed readiness review that gates this issue.

## Definition of Done

- [ ] CHANGELOG finalized across all releases
- [ ] Release notes written and accurate
- [ ] All release gates confirmed green
- [ ] Release tagged from a verified-green pipeline
- [ ] Deployed exclusively through the Issue 083 pipeline
- [ ] Post-release verification completed and recorded
- [ ] Verification executed independently of the deployer
- [ ] Rollback decision point pre-defined and documented before deployment
- [ ] Stabilization period observed; no unresolved critical incident
- [ ] Release published on GitHub
- [ ] Code review completed
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-13-production-release.md` § 6 |
| Epic | Production Release |
| Gated by | Issue 085 |
| Deploys through | Issue 083 |
| Rollback plan from | Issue 085 |
| Release | v1.0.0 |
| Pull Request | _to be linked_ |
