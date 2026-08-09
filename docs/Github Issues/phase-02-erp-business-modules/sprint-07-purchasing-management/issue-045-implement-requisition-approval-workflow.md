# [FEATURE] Implement Requisition Approval Workflow

<!-- GitHub title: [FEATURE] Implement Requisition Approval Workflow
     Labels: feature, procurement, priority: critical
     Milestone: Sprint 07 - Purchasing Management
     Branch: feature/045-implement-requisition-approval-workflow
     Epic: Purchasing Management
     Depends on: 012, 021, 044
     Blocks: 046
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

## Module: procurement
## Sprint: Sprint 07 - Purchasing Management

---

## Summary

Implement multi-step requisition approval: route requisitions to approvers based on value and the
reporting hierarchy, enforce segregation of duties, and record every decision immutably.

## Background

This is the control that decides whether company money gets spent, and the most consequential issue
in the sprint.

It differs from the leave approval in Issue 025 in one important way: **the approver depends on the
amount.** A 5,000 request goes to a department manager; a 500,000 request goes to a director. That
turns a single-step approval into a chain, where each step must be satisfied before the next
applies.

Three rules do most of the work:

- **Self-approval is blocked.** The person requesting is never the person approving, regardless of
  their authority level. This is the single most important control in procurement.
- **Approval limits are checked against the requisition's value**, not the approver's job title.
  Titles change; limits are configuration.
- **Approval history is immutable.** An audit that can be edited is not an audit.

This module hard-codes its routing. Sprint 04 already hard-coded leave approval. **Issue 068
replaces both with a configurable engine** — see the deliberate technical debt note in the sprint
README.

## User Story

As a Department Manager,
I want to review and approve purchase requisitions from my team within my authority,
So that spending is controlled and requests above my limit escalate to the right person.

## Acceptance Criteria

```gherkin
Given a submitted requisition with an estimated value of 30,000
And the department manager's approval limit is 50,000
When routing is resolved
Then the requisition is assigned to the department manager only
```

```gherkin
Given a submitted requisition with an estimated value of 300,000
And limits are 50,000 for manager and 500,000 for finance officer
When routing is resolved
Then the requisition requires approval from the manager and then the finance officer
```

```gherkin
Given a requisition requiring two approvals
When the first approver approves
Then the requisition remains pending and moves to the second approver
```

```gherkin
Given a requisition requiring two approvals
When the second approver approves
Then the requisition status becomes Approved
```

```gherkin
Given a requester who is also an authorized approver
When they attempt to approve their own requisition
Then the request is rejected
```

```gherkin
Given any approver rejects a requisition
When the rejection is submitted without a reason
Then the request is rejected
```

```gherkin
Given a requisition is rejected at any step
When the rejection completes
Then the requisition status becomes Rejected and no further approval is possible
```

```gherkin
Given a recorded approval decision
When a user attempts to edit or delete it
Then the request is rejected
```

- [ ] `GET /api/procurement/approvals/pending` returns the approver's queue
- [ ] `POST /api/procurement/approvals/{id}/approve` approves with an optional comment
- [ ] `POST /api/procurement/approvals/{id}/reject` rejects with a required reason
- [ ] `GET /api/procurement/approvals/history/{requisitionId}` returns the decision history
- [ ] `GET /api/procurement/approval-limits` lists configured limits
- [ ] `PUT /api/procurement/approval-limits/{roleId}` configures a role's limit
- [ ] Approval limits configurable per role
- [ ] Routing resolves approvers from the reporting hierarchy in Issue 021
- [ ] Value-based escalation produces the correct approval chain
- [ ] Approval steps execute in order
- [ ] Self-approval blocked regardless of authority
- [ ] Rejection requires a reason
- [ ] Rejection terminates the chain
- [ ] Every decision records approver, timestamp, comment, and step
- [ ] Decision history is append-only and immutable
- [ ] Approvers see only requisitions assigned to them
- [ ] A requisition with no resolvable approver fails visibly rather than stalling
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Requisitions reach the right approvers in the right order based on value. Nobody approves their own
spending, and every decision is permanently recorded with its reason.

---

## Scope

### Included

- Approval queue endpoint
- Approve and reject with recorded decisions
- Value-based routing and escalation
- Approver resolution from the reporting hierarchy
- Configurable approval limits per role
- Segregation of duties enforcement
- Immutable decision history
- Unroutable requisition handling
- Permission enforcement
- ERD update

### Out of Scope

- Purchase orders (Issue 046)
- Configurable workflow definitions (Sprint 10, Issue 063)
- Delegation of approval authority (Sprint 10, Issue 064)
- Escalation on inactivity (Sprint 10, Issue 064)
- Email and in-app notification of pending approvals (Sprint 10, Issue 066)
- Budget checking

## Technical Requirements

**Endpoints**

```text
GET    /api/procurement/approvals/pending
POST   /api/procurement/approvals/{id}/approve
POST   /api/procurement/approvals/{id}/reject
GET    /api/procurement/approvals/history/{requisitionId}
GET    /api/procurement/approval-limits
PUT    /api/procurement/approval-limits/{roleId}
```

**Schema**

```text
ApprovalLimit

id
roleId                → Role
maxApprovalAmount     decimal
stepOrder             integer
updatedBy             → User
updatedAt

RequisitionApproval

id
requisitionId         → PurchaseRequisition
stepOrder             integer
approverId            → Employee
status                enum: PENDING | APPROVED | REJECTED | SKIPPED
decision              nullable
comment               nullable
decidedAt             nullable
createdAt
```

**Approval limits example**

```text
Department Manager    ≤   50,000     stepOrder 1
Finance Officer       ≤  500,000     stepOrder 2
Director              unlimited      stepOrder 3
```

**Routing resolution**

```text
Requisition estimated value

        ↓

Determine the lowest step whose limit covers the value

        ↓

Build the chain from step 1 up to that step

        ↓

Resolve each step's approver:
    step 1 → the requester's manager (Employee.managerId, Issue 021)
    step 2+ → an employee holding the role for that step

        ↓

Create one RequisitionApproval row per step, all PENDING
```

A 300,000 requisition where the manager limit is 50,000 needs steps 1 and 2 — the manager still
reviews it, then it escalates. Skipping straight to finance would remove the manager's visibility
of their own team's spending.

**Segregation of duties**

```text
requisition.requestedBy != approval.approverId
```

Checked at approval time, not only at routing time. If the requester happens to be resolved as an
approver for a later step, that step must escalate to the next authority rather than being
self-approved.

**Step progression**

```text
Approve step N

    ↓

If a PENDING step N+1 exists  → requisition stays SUBMITTED
Otherwise                     → requisition becomes APPROVED
```

Rejection at any step sets the requisition to `REJECTED` immediately and marks remaining steps
`SKIPPED`. No further approval is possible.

**Unroutable requisitions**

If any step has no resolvable approver — a missing `managerId`, or no employee holding the required
role — submission fails with a message naming the gap. A requisition that silently sits in nobody's
queue is worse than one that fails immediately.

**Immutability**

`RequisitionApproval` rows are never updated after a decision is recorded, except to set the
decision fields once. No delete endpoint exists.

**Permissions to add**

```text
REQUISITION_APPROVE
APPROVAL_LIMIT_READ
APPROVAL_LIMIT_UPDATE
```

Restrict `APPROVAL_LIMIT_UPDATE` to administrators — it defines who can spend how much.

## Dependencies

- Issue 044 — requisitions to approve.
- Issue 021 — the reporting hierarchy, for approver resolution.
- Issue 012 — roles, for approval limits.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for routing at values below, at, and above each limit boundary
- [ ] Unit tests for multi-step chain construction
- [ ] Test confirming self-approval is blocked even for authorized approvers
- [ ] Test confirming rejection at step 1 prevents step 2 from being actionable
- [ ] Test confirming rejection requires a reason
- [ ] Test confirming approval history cannot be modified
- [ ] Test confirming an unroutable requisition fails visibly at submission
- [ ] Test confirming approvers see only their own pending items
- [ ] Integration tests for all endpoints
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation, approval matrix, and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-07-purchasing-management.md` § 3 |
| Epic | Purchasing Management |
| Uses | Issue 021 (reporting hierarchy), Issue 012 (roles) |
| Second hard-coded approval after | Issue 025 (leave) |
| Replaced by | Issue 068 (Sprint 10, workflow engine) |
| Pull Request | _to be linked_ |
