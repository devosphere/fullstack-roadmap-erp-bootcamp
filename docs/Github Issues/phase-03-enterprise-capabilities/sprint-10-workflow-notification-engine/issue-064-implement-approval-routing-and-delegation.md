# [FEATURE] Implement Approval Routing and Delegation

<!-- GitHub title: [FEATURE] Implement Approval Routing and Delegation
     Labels: feature, backend, priority: critical
     Milestone: Sprint 10 - Workflow & Notification Engine
     Branch: feature/064-implement-approval-routing-and-delegation
     Epic: Workflow & Notification Engine
     Depends on: 021, 063
     Blocks: 065, 068
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

## Module: backend
## Sprint: Sprint 10 - Workflow & Notification Engine

---

## Summary

Resolve who must act on each workflow step — by role, hierarchy, or explicit assignment — enforce
self-approval prevention, support delegation for a date range, escalate tasks that go unactioned,
and record every decision immutably.

## Background

Issue 063 built the engine that advances through steps. This issue answers the question the engine
cannot answer on its own: **who is the approver, right now, for this step, for this document?**

That resolution has to reproduce what Issue 025 and Issue 045 each did by hand:

```text
Issue 025    approver = requester's direct manager (Issue 021 hierarchy)
Issue 045    approver = role-based, chosen by requisition value
```

Both are instances of the same four rule types this issue implements generically. Getting the
resolution right here is what makes Issue 068's later migration possible without behavior change —
if this issue's `REPORTING_MANAGER` rule and `ROLE` rule do not produce identical results to the
hard-coded logic they replace, the migration will introduce a regression nobody notices until an
approval routes to the wrong person.

Two controls carry over unchanged from both predecessors and must not be weakened: **self-approval
is blocked, regardless of rule type or delegation**, and **every decision is permanently recorded**.
Delegation adds one more identity to check against — a delegate approving on someone else's behalf
must still not be the original requester.

## User Story

As a Manager,
I want approvals routed to me automatically and to be able to delegate them when I'm away,
So that approval work reaches the right person without manual reassignment.

## Acceptance Criteria

```gherkin
Given a workflow step with approverRuleType REPORTING_MANAGER
When it is resolved for a given employee
Then the approver is that employee's manager from the Issue 021 hierarchy
```

```gherkin
Given a workflow step with approverRuleType ROLE
When it is resolved
Then the approver is an employee holding that role
```

```gherkin
Given the resolved approver is the same person who submitted the document
When the step attempts to route to them
Then routing fails and escalates to the next eligible approver, or blocks visibly if none exists
```

```gherkin
Given a manager has an active delegation to another employee for a date range
When a task is routed to the manager within that range
Then the task is assigned to the delegate, and the audit record shows both identities
```

```gherkin
Given a task has not been actioned within its configured escalation period
When the period elapses
Then the task escalates to the next approver and the reason is recorded
```

```gherkin
Given a recorded approval or rejection decision
When a user attempts to edit or delete it
Then the request is rejected
```

- [ ] `GET /api/workflows/delegations` lists the current user's delegations
- [ ] `POST /api/workflows/delegations` creates a delegation with a date range
- [ ] `DELETE /api/workflows/delegations/{id}` removes a delegation
- [ ] `GET /api/workflows/audit/{workflowInstanceId}` returns the full decision and delegation history
- [ ] Approver resolution implemented for all four rule types: specific user, role, reporting manager, department head
- [ ] Self-approval blocked for every rule type
- [ ] Self-approval on delegation checked against the original requester, not just the delegate
- [ ] Delegation respects its configured start and end date
- [ ] A task routed during an active delegation assigns to the delegate and records both identities
- [ ] Escalation triggers automatically after a step's configured `escalationHours`
- [ ] Escalation moves the task to the next eligible approver and records the reason
- [ ] Every decision records approver, timestamp, comment, and whether it was via delegation
- [ ] Audit records are append-only and immutable
- [ ] Audit history survives changes to the workflow definition
- [ ] Permissions declared and enforced

## Expected Result

Every workflow step reaches the correct person automatically, nobody approves their own request
under any circumstance, delegated coverage works within its bounds, and stalled tasks escalate
instead of sitting unactioned. The full history is permanently reconstructable.

---

## Scope

### Included

- Approver resolution for all four rule types
- Self-approval prevention, including through delegation
- Delegation with date-range enforcement
- Escalation on inactivity
- Immutable audit trail
- Permission enforcement

### Out of Scope

- Task inbox UI (Issue 065)
- Notification delivery on assignment or escalation (Issue 066)
- The workflow engine's core state machine (Issue 063)
- Multi-level delegation chains (a delegate delegating further)
- Configurable escalation targets beyond "next eligible approver"

## Technical Requirements

**Endpoints**

```text
GET    /api/workflows/delegations
POST   /api/workflows/delegations
DELETE /api/workflows/delegations/{id}

GET    /api/workflows/audit/{workflowInstanceId}
```

**Schema**

```text
Delegation

id
delegatorId          → User
delegateId           → User
startDate
endDate
createdAt

WorkflowTask

id
workflowInstanceId   → WorkflowInstance
stepOrder
assigneeId           → User
delegatedFromId      → User, nullable
status               enum: OPEN | COMPLETED | DELEGATED | EXPIRED
decision             nullable
comment              nullable
dueAt
completedAt          nullable

WorkflowAuditLog

id
workflowInstanceId   → WorkflowInstance
actorId              → User
action               enum: ROUTED | APPROVED | REJECTED | DELEGATED | ESCALATED
fromStatus
toStatus
comment
createdAt
```

**Approver resolution**

```text
SPECIFIC_USER        approverRuleValue is a user id — resolves directly

ROLE                  approverRuleValue is a role id — resolves to a holder of that role;
                       if multiple hold it, resolution picks by a documented rule
                       (e.g. lowest employee id, or department match) — document the choice

REPORTING_MANAGER      resolves via Employee.managerId (Issue 021), same as Issue 025's original logic

DEPARTMENT_HEAD        resolves via Department.headUserId (Issue 017)
```

**Self-approval check**

```text
resolvedApprover == documentOwner
    → reject this resolution, attempt the next eligible approver for the same rule,
      or block visibly if none exists (same principle as Issue 063's unroutable-step handling)

resolvedApprover == documentOwner AND an active delegation exists
    → still blocked; delegation changes who acts, not whether the original requester can act on their own document
```

**Delegation application**

```text
Task routed to userA

        ↓

Active Delegation exists where delegatorId = userA
                              and startDate <= today <= endDate

        ↓

WorkflowTask.assigneeId = delegate
WorkflowTask.delegatedFromId = userA
```

**Escalation**

```text
Background check (reuses the scheduling infrastructure introduced for Issue 062)

For each OPEN WorkflowTask where now > dueAt:

    1. Mark the current task EXPIRED
    2. Resolve the next eligible approver per the step's rule, excluding whoever failed to act
    3. Create a new WorkflowTask assigned to them
    4. Write a WorkflowAuditLog entry with action = ESCALATED
```

**Immutability**

`WorkflowAuditLog` rows are insert-only; no update or delete endpoint exists. This is what makes the
audit trail trustworthy under Sprint 11's review.

**Permissions to add**

```text
WORKFLOW_DELEGATION_MANAGE
WORKFLOW_AUDIT_READ
```

Users manage their own delegations; `WORKFLOW_AUDIT_READ` is granted to document owners, approvers
in the chain, and administrators.

## Dependencies

- Issue 021 — the reporting hierarchy, for `REPORTING_MANAGER` resolution.
- Issue 063 — the workflow engine core this issue plugs approver resolution into.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for approver resolution across all four rule types
- [ ] Unit tests for self-approval prevention, including the delegation case
- [ ] Unit tests for delegation date-range boundaries
- [ ] Unit tests for escalation triggering and target resolution
- [ ] Test confirming audit records cannot be modified or deleted
- [ ] **Parity test**: `REPORTING_MANAGER` resolution against seeded data produces the same approver Issue 025's original logic would have
- [ ] **Parity test**: `ROLE` and value-based resolution reproduces Issue 045's original approval chain on the same seeded requisitions
- [ ] Integration tests for all endpoints
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-10-workflow-notification-engine.md` § 2 |
| Epic | Workflow & Notification Engine |
| Reproduces routing from | Issue 025, Issue 045 |
| Uses | Issue 021 (hierarchy), Issue 012 (roles), Issue 017 (department heads) |
| Enables | Issue 068 (migration) |
| Pull Request | _to be linked_ |
