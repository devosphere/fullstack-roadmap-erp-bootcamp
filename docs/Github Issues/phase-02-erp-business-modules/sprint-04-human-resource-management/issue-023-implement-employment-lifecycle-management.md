# [FEATURE] Implement Employment Lifecycle Management

<!-- GitHub title: [FEATURE] Implement Employment Lifecycle Management
     Labels: feature, hr, priority: high
     Milestone: Sprint 04 - Human Resource Management
     Branch: feature/023-implement-employment-lifecycle-management
     Epic: Human Resource Management
     Depends on: 022
     Blocks: 024, 025
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [x] Feature
- [ ] Bug
- [ ] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [x] High
- [ ] Critical

## Module: hr
## Sprint: Sprint 04 - Human Resource Management

---

## Summary

Track employment status over time: enforce valid status transitions, record every change with its
reason and effective date, and expose an employee's employment history.

## Background

Issue 019 gave the employee record a `status` field. A single field records the present but loses
the past.

HR needs the past. "Was she a regular employee on 1 March?" determines leave entitlement, benefit
eligibility, and payroll. Overwriting the status field answers today's question and destroys every
previous one.

The fix is an append-only history table alongside the current status. The current status becomes a
derived convenience; the history is the truth.

Status also gates other modules: an employee on `SUSPENDED` should not be able to file leave, and a
`RESIGNED` employee should not appear in the attendance roster. Those rules belong here, checked
once, rather than repeated in every HR feature.

## User Story

As an HR Officer,
I want employment status changes recorded with their effective dates and reasons,
So that the organization has a complete, auditable employment history for every employee.

## Acceptance Criteria

```gherkin
Given an employee with status Probation
When an HR Officer changes their status to Regular with an effective date and reason
Then the change is recorded in employment history and the current status updates
```

```gherkin
Given an employee with status Terminated
When an HR Officer attempts to change their status to Regular
Then the request is rejected because Terminated is a terminal state
```

```gherkin
Given an employee whose status changed three times
When their employment history is requested
Then all three changes are returned in order with dates, reasons, and who made them
```

```gherkin
Given an employee with status Suspended
When they attempt to submit a leave request
Then the request is rejected
```

- [ ] `PATCH /api/employees/{id}/employment-status` changes status
- [ ] `GET /api/employees/{id}/employment-history` returns the full history
- [ ] All statuses supported: Probation, Regular, Contractual, On Leave, Suspended, Resigned, Terminated
- [ ] Valid transitions enforced; invalid transitions rejected with a clear message
- [ ] Terminal statuses cannot be reversed
- [ ] Effective date required on every change
- [ ] Reason required on every change
- [ ] History records who made the change and when
- [ ] History is append-only and cannot be edited or deleted
- [ ] Probation end date tracked with an upcoming-confirmation report
- [ ] Resignation and termination require an end date
- [ ] Status gates enforced for attendance and leave eligibility
- [ ] Status change events written to the audit log
- [ ] Permissions declared and enforced
- [ ] Transition rules documented

## Expected Result

Every employment status change is recorded permanently with its date, reason, and author. Invalid
transitions are rejected. Other HR features can ask "is this employee eligible?" and get a
consistent answer.

---

## Scope

### Included

- Status transition endpoint with validation
- Employment history table and endpoint
- Transition rule enforcement
- Probation tracking
- Eligibility checks consumed by other HR features
- Audit logging
- Permission enforcement
- Documentation of the transition rules

### Out of Scope

- Attendance (Issue 024) and leave (Issues 025, 026)
- Promotion, transfer, and salary change records
- Offboarding checklists
- Automatic user account deactivation on termination (handled in Issue 020)

## Technical Requirements

**Endpoints**

```text
PATCH  /api/employees/{id}/employment-status
GET    /api/employees/{id}/employment-history
GET    /api/employees/probation-ending
```

**Schema**

```text
EmploymentHistory

id
employeeId        → Employee
fromStatus
toStatus
effectiveDate
reason
changedBy         → User
createdAt
```

**Status transitions**

```text
PROBATION    → REGULAR | CONTRACTUAL | RESIGNED | TERMINATED
REGULAR      → ON_LEAVE | SUSPENDED | RESIGNED | TERMINATED
CONTRACTUAL  → REGULAR | RESIGNED | TERMINATED
ON_LEAVE     → REGULAR | SUSPENDED | RESIGNED | TERMINATED
SUSPENDED    → REGULAR | TERMINATED
RESIGNED     → (terminal)
TERMINATED   → (terminal)
```

**Eligibility gates**

| Status | Can record attendance | Can request leave |
|--------|----------------------|-------------------|
| Probation | Yes | Yes |
| Regular | Yes | Yes |
| Contractual | Yes | Yes |
| On Leave | No | No |
| Suspended | No | No |
| Resigned | No | No |
| Terminated | No | No |

Expose this as a single service method so Issues 024 and 025 call it rather than reimplementing it.

**Permissions to add**

```text
EMPLOYEE_STATUS_CHANGE
EMPLOYMENT_HISTORY_READ
```

**Rules**

- The transition map lives in one place and is the only authority on validity.
- `EmploymentHistory` rows are never updated or deleted; corrections are new rows.
- The current `Employee.status` is kept in sync but the history is authoritative.

## Dependencies

- Issue 022 — the extended employee profile.
- Issue 019 — the base employee record and status field.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for every valid and invalid transition
- [ ] Unit tests for the eligibility gate
- [ ] Integration tests for status change and history retrieval
- [ ] Test confirming history rows cannot be modified
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation, transition rules, and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-04-human-resource-management.md` § 2 |
| Epic | Human Resource Management |
| Eligibility gate consumed by | Issues 024, 025 |
| Pull Request | _to be linked_ |
