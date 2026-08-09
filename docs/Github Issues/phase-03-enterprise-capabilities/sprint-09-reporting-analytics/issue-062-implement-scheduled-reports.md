# [TASK] Implement Scheduled Reports

<!-- GitHub title: [TASK] Implement Scheduled Reports
     Labels: task, backend, priority: medium
     Milestone: Sprint 09 - Reporting & Analytics
     Branch: feature/062-implement-scheduled-reports
     Epic: Reporting & Analytics
     Depends on: 058, 061
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

## Module: backend
## Sprint: Sprint 09 - Reporting & Analytics

---

## Summary

Let users schedule a report to run automatically on a recurring basis, export it, and deliver the
result to named recipients — with retry on failure and a visible run history.

## Background

Every report built in this sprint so far requires someone to remember to run it. A scheduled report
is the same report and the same export mechanism from Issue 061, run by a background process
instead of a person.

Two rules exist because this is the first genuinely unattended process in the ERP system so far:

- **A failed run must retry and be visible, not silently disappear.** A monthly finance report that
  fails once and is never retried is a report nobody realizes they never received.
- **Recipients must have permission to view the report.** A schedule is configuration set once by
  its creator; the people receiving it must independently hold the same access the report itself
  requires, checked at delivery time — not only when the schedule was created, since roles change.

This is a straightforward composition of existing pieces: a cron-like trigger, Issue 058's report
execution, Issue 061's export, and a delivery step. Building it after both of those is deliberate —
there is very little new logic here.

## User Story

As a Finance Manager,
I want a monthly financial report delivered automatically to the finance team,
So that nobody has to remember to run and share it manually.

## Acceptance Criteria

```gherkin
Given a schedule configured to run weekly with saved parameters
When the scheduled time arrives
Then the report runs with those parameters and is exported in the configured format
```

```gherkin
Given a scheduled report run fails
When the failure is detected
Then it is retried automatically up to the configured limit and the failure is recorded
```

```gherkin
Given a schedule with a recipient who no longer holds the report's required permission
When the report is delivered
Then that recipient is skipped and the omission is recorded in the run history
```

```gherkin
Given a schedule's run history
When it is viewed
Then the last several runs are shown with their status and timestamp
```

```gherkin
Given a schedule is disabled
When its next scheduled time arrives
Then it does not run
```

- [ ] `GET /api/reports/schedules` lists schedules
- [ ] `POST /api/reports/schedules` creates a schedule
- [ ] `PUT /api/reports/schedules/{id}` updates a schedule
- [ ] `DELETE /api/reports/schedules/{id}` removes a schedule
- [ ] `GET /api/reports/schedules/{id}/runs` returns run history
- [ ] Frequency configurable: daily, weekly, monthly
- [ ] Report parameters saved with the schedule
- [ ] Export format configurable per schedule
- [ ] Recipients configurable per schedule
- [ ] Scheduled runs execute automatically via a background job
- [ ] Failed runs retry automatically up to a configured limit
- [ ] Recipient permission re-checked at delivery time, not only at schedule creation
- [ ] Recipients lacking permission are skipped and the skip is recorded
- [ ] Run history retains the last N runs with status and timestamp
- [ ] Disabling a schedule stops future runs without deleting history
- [ ] Permissions declared and enforced

## Expected Result

A report a person would otherwise run and send manually now runs itself on schedule, retries when
it fails, and never delivers to someone who should not see it — even if their access changed after
the schedule was set up.

---

## Scope

### Included

- Schedule CRUD
- Frequency and parameter configuration
- Background execution via the existing job infrastructure
- Retry on failure
- Recipient permission re-verification at delivery time
- Run history
- Enable/disable without deletion
- Permission enforcement

### Out of Scope

- Ad-hoc one-time future scheduling (this issue covers recurring schedules only)
- Custom delivery channels beyond email (in-app notification of delivery is a Sprint 10 candidate once Issue 066 exists)
- Schedule sharing or ownership transfer
- Timezone-aware scheduling beyond a single configured system timezone

## Technical Requirements

**Endpoints**

```text
GET    /api/reports/schedules
POST   /api/reports/schedules
PUT    /api/reports/schedules/{id}
DELETE /api/reports/schedules/{id}
GET    /api/reports/schedules/{id}/runs
```

**Schema**

```text
ReportSchedule

id
reportDefinitionId    → ReportDefinition
frequency             enum: DAILY | WEEKLY | MONTHLY
parameters             stored as structured data
recipients              array of user ids
exportFormat            enum: CSV | PDF
isActive
createdBy               → User
nextRunAt

ReportScheduleRun

id
reportScheduleId       → ReportSchedule
status                  enum: SUCCESS | FAILED | RETRYING
attemptCount
skippedRecipients       array, recipients omitted due to a permission check at delivery time
error                   nullable
startedAt
completedAt             nullable
```

**Execution flow**

```text
Background job wakes on a fixed interval

        ↓

Find schedules where isActive = true and nextRunAt <= now

        ↓

For each schedule:

    1. Run the report via Issue 058's execution path with the saved parameters
    2. Export via Issue 061's export mechanism
    3. For each recipient, re-check the report's requiredPermission
         → deliver if permitted, skip and record if not
    4. Record a ReportScheduleRun
    5. Compute and set the schedule's nextRunAt

        ↓

On failure at any step:

    → retry up to the configured limit with backoff
    → after exhausting retries, mark the run FAILED and leave it visible in history
```

**Recipient re-verification**

This is the one rule in this issue that is easy to skip and shouldn't be: a recipient added to a
schedule six months ago may have since lost the permission the report requires. Checking only at
schedule creation would silently keep delivering to someone who should have lost access. The check
runs on every delivery, using the same `requiredPermission` from `ReportDefinition`.

**Permissions to add**

```text
REPORT_SCHEDULE_CREATE
REPORT_SCHEDULE_READ
REPORT_SCHEDULE_MANAGE
```

Creating a schedule for a report still requires holding that report's own `requiredPermission` —
`REPORT_SCHEDULE_CREATE` alone is not sufficient to schedule a report the user could not run
themselves.

## Dependencies

- Issue 058 — the report execution this issue automates.
- Issue 061 — the export mechanism this issue triggers on schedule.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for `nextRunAt` calculation across all three frequencies
- [ ] Unit tests for retry and backoff logic
- [ ] Integration test confirming a scheduled run produces the same export a manual run would
- [ ] Test confirming a recipient who lost permission is skipped and the skip is recorded
- [ ] Test confirming a disabled schedule does not run
- [ ] Test confirming failed runs are visible in history after exhausting retries
- [ ] Test confirming schedule creation requires the underlying report's permission
- [ ] Integration tests for all endpoints
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-09-reporting-analytics.md` § 6 |
| Epic | Reporting & Analytics |
| Executes | Issue 058 (report run), Issue 061 (export) |
| Delivery mechanism generalized by | Issue 066 (Sprint 10, notification service) |
| Pull Request | _to be linked_ |
