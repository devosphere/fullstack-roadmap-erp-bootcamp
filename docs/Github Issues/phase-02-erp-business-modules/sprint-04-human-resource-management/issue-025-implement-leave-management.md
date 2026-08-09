# [FEATURE] Implement Leave Management

<!-- GitHub title: [FEATURE] Implement Leave Management
     Labels: feature, hr, priority: critical
     Milestone: Sprint 04 - Human Resource Management
     Branch: feature/025-implement-leave-management
     Epic: Human Resource Management
     Depends on: 021, 023, 026
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
- [ ] High
- [x] Critical

## Module: hr
## Sprint: Sprint 04 - Human Resource Management

---

## Summary

Implement leave requests and approval: employees submit requests, the system validates them against
their balance, requests route to the employee's manager for a decision, and approved leave deducts
from the balance.

## Background

This is the first approval workflow in the ERP system, and the first place two modules must stay
consistent with each other: a leave request and a leave balance can disagree if the deduction and
the approval are not handled as one operation.

The routing here is deliberately simple — the request goes to the employee's manager, resolved from
the hierarchy built in **Issue 021**. That logic is hard-coded in this module for now. Sprint 07
adds a second hard-coded version for purchase requisitions, and Sprint 10 replaces both with a
configurable engine. Writing it twice before generalizing is intentional: it is much easier to see
what is common once there are two real examples.

The rule that causes most defects: **balance is checked at approval, not only at submission.** An
employee can submit three requests against a balance of five days before any are approved. If the
balance is only checked on submission, all three approve and the balance goes negative.

## User Story

As an Employee,
I want to submit a leave request and have my manager approve it,
So that I can take time off without contacting HR manually.

## Acceptance Criteria

```gherkin
Given an eligible employee with sufficient leave balance
When they submit a leave request for future dates
Then the request is created with status Pending and appears in their manager's queue
```

```gherkin
Given an employee with a balance of 5 days
When they submit a request for 7 days
Then the request is rejected at submission with a clear message
```

```gherkin
Given an employee with a balance of 5 days and two pending requests of 3 days each
When the manager approves the second request
Then it is rejected because the remaining balance is insufficient at approval time
```

```gherkin
Given a leave request is approved
When the approval completes
Then the balance is deducted and the request status is Approved, both or neither
```

```gherkin
Given an employee with no assigned manager
When they submit a leave request
Then the submission fails with a clear message rather than creating an unroutable request
```

```gherkin
Given a manager viewing their approval queue
When they open it
Then they see only requests from their own direct reports
```

- [ ] `POST /api/leave/requests` submits a leave request
- [ ] `GET /api/leave/requests/me` lists the employee's own requests
- [ ] `GET /api/leave/requests/pending` returns the manager's approval queue
- [ ] `GET /api/leave/requests/{id}` returns a request
- [ ] `POST /api/leave/requests/{id}/approve` approves a request
- [ ] `POST /api/leave/requests/{id}/reject` rejects a request with a required reason
- [ ] `POST /api/leave/requests/{id}/cancel` cancels a pending request
- [ ] `GET /api/leave/types` lists leave types
- [ ] Leave types configurable: Annual, Sick, Emergency, Maternity, Unpaid
- [ ] Requested days calculated excluding weekends and holidays
- [ ] Balance validated at submission **and** at approval
- [ ] Overlapping requests for the same employee rejected
- [ ] Start date cannot be in the past except for Sick and Emergency leave
- [ ] Approval routes to the employee's manager from the reporting hierarchy
- [ ] Self-approval blocked
- [ ] Rejection requires a reason
- [ ] Approval and balance deduction occur in a single transaction
- [ ] Cancelling an approved future request restores the balance
- [ ] Employment status eligibility enforced using the gate from Issue 023
- [ ] Status transitions enforced
- [ ] Approval decisions recorded with approver, timestamp, and comment
- [ ] Managers see only their own team's requests
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

An employee submits a request, their manager sees it and decides, and the balance reflects the
outcome exactly. A request can never leave the balance and the request status disagreeing.

---

## Scope

### Included

- Leave request submission, cancellation, and retrieval
- Leave type configuration
- Working-day calculation excluding weekends and holidays
- Balance validation at submission and approval
- Overlap detection
- Manager routing from the reporting hierarchy
- Approve and reject with recorded decisions
- Transactional balance deduction
- Access scoping
- Permission enforcement
- ERD update

### Out of Scope

- Leave balance accrual and allocation (Issue 026)
- Self-service leave UI (Issue 027)
- Multi-step or value-based approval routing (Sprint 10, Issue 064)
- Delegation of approval authority (Sprint 10, Issue 064)
- Email notification of pending approvals (Sprint 10, Issue 066)
- Leave encashment and carry-over policy

## Technical Requirements

**Endpoints**

```text
GET    /api/leave/types
POST   /api/leave/requests
GET    /api/leave/requests/me
GET    /api/leave/requests/pending
GET    /api/leave/requests/{id}
POST   /api/leave/requests/{id}/approve
POST   /api/leave/requests/{id}/reject
POST   /api/leave/requests/{id}/cancel
```

**Schema**

```text
LeaveType

id
code              unique
name
isPaid
requiresDocument
maxConsecutiveDays
allowsBackdating

LeaveRequest

id
requestNumber     unique
employeeId        → Employee
leaveTypeId       → LeaveType
startDate
endDate
requestedDays     calculated working days
reason
status            enum
approverId        → Employee, nullable
decidedAt         nullable
decisionComment   nullable
createdAt
updatedAt
```

**Status flow**

```text
PENDING → APPROVED → CANCELLED

PENDING → REJECTED

PENDING → CANCELLED
```

Only `PENDING` requests can be approved, rejected, or cancelled by the employee. An `APPROVED`
request with a future start date can be cancelled, which restores the balance.

**Working day calculation**

```text
Count days from startDate to endDate inclusive

Exclude Saturdays and Sundays

Exclude configured public holidays

Result is requestedDays
```

**Transactional requirement**

Approval must do both of these or neither:

```text
1. Set request status to APPROVED
2. Deduct requestedDays from the employee's balance for that leave type
```

If the balance check fails inside the transaction, the approval fails and the request stays
`PENDING`.

**Routing**

```text
LeaveRequest.employeeId

        ↓

Employee.managerId          (from Issue 021)

        ↓

Approver
```

If `managerId` is null, submission fails with a message naming the missing manager assignment
rather than creating an unroutable request.

**Permissions to add**

```text
LEAVE_REQUEST_CREATE
LEAVE_REQUEST_READ_OWN
LEAVE_REQUEST_READ_TEAM
LEAVE_REQUEST_READ_ALL
LEAVE_REQUEST_APPROVE
```

## Dependencies

- Issue 021 — the reporting hierarchy, for approver resolution.
- Issue 023 — the employment status eligibility gate.
- Issue 026 — leave balances must exist to validate against. If 026 is not yet merged, coordinate
  so both land together.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for working-day calculation including holidays and weekends
- [ ] Unit tests for overlap detection
- [ ] Unit tests for status transition rules
- [ ] Test proving balance is re-checked at approval, not only submission
- [ ] Test proving approval and deduction are atomic — a failed deduction leaves the request pending
- [ ] Test confirming self-approval is blocked
- [ ] Test confirming an employee without a manager cannot submit
- [ ] Tests confirming managers see only their own team's requests
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-04-human-resource-management.md` § 4 |
| Epic | Human Resource Management |
| Routing generalized by | Issue 064 (Sprint 10) |
| Pull Request | _to be linked_ |
