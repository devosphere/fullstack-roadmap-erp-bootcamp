# [TASK] Implement Backup and Disaster Recovery

<!-- GitHub title: [TASK] Implement Backup and Disaster Recovery
     Labels: task, ci, priority: critical
     Milestone: Sprint 13 - Production Release
     Branch: feature/084-implement-backup-and-disaster-recovery
     Epic: Production Release
     Depends on: 081, 083
     Blocks: 085
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

Agree recovery objectives with the business, automate database backups to separate storage, write
the disaster recovery runbook, and prove it by restoring a real backup into a clean environment and
timing the result.

## Background

Every other issue in this sprint builds a mechanism and then verifies it directly — the deployment
pipeline is tested by an intentional failure in Issue 083, infrastructure reproducibility is tested
by rebuilding it in Issue 081. This issue holds itself to the same standard: **a backup that has
never been restored is not a backup, it is an assumption.**

Two numbers frame the whole issue, and they are business decisions, not technical ones:

```text
RPO (Recovery Point Objective)   How much data can we afford to lose?
RTO (Recovery Time Objective)    How long can we afford to be down?
```

An RPO of one hour means backups run at least hourly. An RTO of four hours means the restore
procedure — not just the backup file existing, but every step from "the database is gone" to "the
application is serving correct data again" — must complete inside four hours, and this issue is
where that claim gets tested against the clock rather than assumed.

Storing backups **in the same failure domain as the primary database** defeats their purpose — if
the database, its backups, and the infrastructure hosting both go down together, there was never
really a backup.

## User Story

As a DevOps Engineer,
I want backups automated, separately stored, and proven restorable within our recovery objectives,
So that data loss is a bounded, rehearsed inconvenience rather than an unrecoverable event.

## Acceptance Criteria

```gherkin
Given the agreed RPO
When the backup schedule is inspected
Then it runs at a frequency that satisfies that objective
```

```gherkin
Given a completed backup
When its storage location is inspected
Then it resides in a separate failure domain from the primary database
```

```gherkin
Given a restore drill performed into a clean environment
When it completes
Then the restored data is verified correct and the elapsed time is recorded against the RTO
```

```gherkin
Given a scheduled backup fails to complete
When the failure occurs
Then it is detected and alerted, not silently missed
```

```gherkin
Given the disaster recovery runbook
When someone unfamiliar with the system follows it
Then they can execute a restore without needing to ask the original author for help
```

- [ ] RPO and RTO agreed with the business and documented
- [ ] Automated database backups configured at a frequency satisfying the agreed RPO
- [ ] Backups stored in a separate failure domain from the primary database
- [ ] Backup retention policy configured
- [ ] Backup success and failure monitored and alerted
- [ ] Disaster recovery runbook written, covering the full sequence from failure detection to verified recovery
- [ ] Full restore drill performed into a clean environment (not the existing staging environment, to avoid masking a dependency on leftover state)
- [ ] Restored data verified for integrity, not just that the restore command completed
- [ ] Actual restore time recorded and compared against the agreed RTO
- [ ] Drill result documented honestly, whether or not it met the RTO
- [ ] Restore drill scheduled to repeat periodically, not treated as a one-time exercise

## Expected Result

Backups run automatically, are stored where a primary-database failure cannot also take them out,
and have been proven — with a clock running — to restore correctly within the time the business
agreed it could tolerate being down.

---

## Scope

### Included

- RPO/RTO agreement and documentation
- Automated backup scheduling
- Separate-failure-domain storage
- Retention policy
- Backup monitoring and alerting
- Disaster recovery runbook
- A real, timed restore drill into a clean environment
- Recurring drill scheduling

### Out of Scope

- Application-level data export/import features (distinct from infrastructure-level backup)
- Multi-region disaster recovery (a scale this programme's stage does not yet require)
- Point-in-time recovery beyond what the backup frequency naturally provides

## Technical Requirements

**RPO / RTO**

```text
RPO example: 1 hour     → backups run at least hourly
RTO example: 4 hours    → the full restore procedure, timed end to end, must complete within 4 hours
```

Document the actually-agreed figures — these are illustrative, not prescriptive. The business
stakeholder who agrees them should be named in the documentation.

**Backup automation**

```text
Scheduled job (using the infrastructure from Issue 081, consistent with the worker/scheduling
pattern already established for Issue 062's report scheduling and Issue 064's escalation checks)

    → triggers a database backup at the interval satisfying the RPO
    → uploads the backup to storage in a separate failure domain
    → verifies the backup file's integrity (not just that the command exited 0)
    → on failure, alerts immediately
```

**Retention**

```text
Document the retention window (e.g. daily backups kept 30 days, weekly kept 90 days,
monthly kept 1 year) — balancing storage cost against how far back recovery might
plausibly be needed
```

**Disaster recovery runbook**

```text
docs/Architecture/disaster-recovery-runbook.md

1. How to detect that recovery is needed
2. How to provision a clean environment (references Issue 081's reproducible infrastructure)
3. How to locate and select the correct backup to restore
4. The exact restore commands/procedure
5. How to verify the restored data's integrity
6. How to redirect the application to the restored database
7. How to communicate status during the incident
8. Post-recovery verification checklist
```

Written so a team member who did not build this system could follow it — this is verified directly
by the drill.

**The restore drill**

```text
1. Provision a genuinely clean environment (not staging, which may carry leftover state
   that accidentally makes restoration look easier than it would be from true zero)
2. Follow the runbook exactly as written, timing every step
3. Restore the most recent backup
4. Verify data integrity: row counts, spot-check known records, confirm the
   application starts and serves correct data against the restored database
5. Record total elapsed time
6. Compare against the RTO — document the result whether it passes or fails
7. If it fails the RTO, that is a finding for this issue to report, not a reason
   to hide the result — file a follow-up if the gap cannot be closed within this sprint
```

**Monitoring**

```text
Backup job success/failure feeds into whatever alerting exists at this point in the programme
(a direct notification is sufficient now; this becomes a formal alert with a runbook once
Sprint 15's alerting, Issue 097, exists)
```

## Dependencies

- Issue 081 — the infrastructure this issue backs up and restores into.
- Issue 083 — the deployment pipeline, since the restore drill's clean environment should be
  reachable using the same deployment mechanism, not a separate manual setup.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] RPO and RTO agreed and documented with a named business stakeholder
- [ ] Automated backups running and monitored
- [ ] Backups verified stored in a separate failure domain
- [ ] Retention policy configured
- [ ] Disaster recovery runbook written
- [ ] **Restore drill performed into a genuinely clean environment**, not staging
- [ ] Restored data integrity verified beyond "the command succeeded"
- [ ] Actual restore time recorded and compared against the RTO, result documented honestly
- [ ] Recurring drill schedule established
- [ ] Code review completed
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-13-production-release.md` § 4 |
| Epic | Production Release |
| Backs up | Issue 081 (production database) |
| Restores via | Issue 083 (deployment mechanism, for the drill environment) |
| Alerting matures in | Issue 097 (Sprint 15) |
| Pull Request | _to be linked_ |
