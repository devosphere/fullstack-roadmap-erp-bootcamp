# [FEATURE] Create Task Inbox

<!-- GitHub title: [FEATURE] Create Task Inbox
     Labels: feature, frontend, priority: high
     Milestone: Sprint 10 - Workflow & Notification Engine
     Branch: feature/065-create-task-inbox
     Epic: Workflow & Notification Engine
     Depends on: 064
     Blocks: 068
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

## Module: frontend
## Sprint: Sprint 10 - Workflow & Notification Engine

---

## Summary

Give every user one place to see and act on tasks assigned to them by any workflow — approve or
reject with a comment, open the source document, and see their completed task history.

## Background

Before this issue, an approver checking whether they have work to do means opening a specific
module — the leave section, the procurement section — and looking for pending items there. That
does not scale as more document types run through workflows.

The task inbox is the single surface built on top of `WorkflowTask` from Issue 064, regardless of
which document type generated it. A leave approval and a requisition approval look the same here:
a task with a document reference, an assignee, and two possible actions.

The access rule matters as much as it did for the employee self-service portal in Issue 027: a task
is visible **only to its assignee and their delegates**, resolved server-side from the authenticated
user — never by a document id the client supplies.

## User Story

As an Employee with approval authority,
I want a single inbox for every task assigned to me regardless of what kind of request it is,
So that I don't have to check multiple modules to find out what needs my decision.

## Acceptance Criteria

```gherkin
Given tasks from different document types assigned to the current user
When they open the task inbox
Then all of them appear in one list
```

```gherkin
Given a task not assigned to the current user, nor delegated to them
When they attempt to act on it via the API
Then the request is rejected regardless of what the UI displays
```

```gherkin
Given a task the user opens
When they click through to its source document
Then the relevant document detail is shown
```

```gherkin
Given a user rejects a task
When they submit without a comment
Then the request is rejected
```

```gherkin
Given a user approves or rejects a task
When the action completes
Then the workflow instance advances or terminates accordingly and the task moves out of the pending list
```

```gherkin
Given a completed task
When the user views their task history
Then it appears with its outcome and timestamp
```

- [ ] `GET /api/workflows/tasks/inbox` returns the current user's open tasks
- [ ] `GET /api/workflows/tasks/history` returns the current user's completed tasks
- [ ] `POST /api/workflows/tasks/{id}/approve` approves a task with an optional comment
- [ ] `POST /api/workflows/tasks/{id}/reject` rejects a task with a required comment
- [ ] Inbox lists tasks across all document types uniformly
- [ ] Inbox filterable by document type and status
- [ ] Each task links to its source document
- [ ] Approve and reject actions call into the Issue 063/064 workflow engine
- [ ] Rejection blocked without a comment
- [ ] A completed task cannot be actioned again
- [ ] Access restricted server-side to the assignee and their active delegates
- [ ] Task history shows outcome, decision comment, and timestamp
- [ ] Loading, empty, and error states present
- [ ] Permissions declared and enforced

## Expected Result

Any user with approval responsibility opens one inbox and sees everything waiting on them,
regardless of source module, and can act on it without navigating elsewhere.

---

## Scope

### Included

- Task inbox and history endpoints
- Approve and reject actions wired to the workflow engine
- Cross-document-type presentation
- Filtering
- Document drill-through
- Server-side access scoping including delegation
- Permission enforcement

### Out of Scope

- Notification of new tasks (Issue 066)
- Delegation management UI (delegation itself is created in Issue 064; a UI for it can follow)
- Bulk approve/reject actions
- Task reassignment by an administrator

## Technical Requirements

**Endpoints**

```text
GET  /api/workflows/tasks/inbox
GET  /api/workflows/tasks/history
POST /api/workflows/tasks/{id}/approve
POST /api/workflows/tasks/{id}/reject
```

**Access scoping**

Identical principle to Issue 027's `/me` endpoints: the inbox resolves tasks from the authenticated
user's id, with no id parameter accepted from the client. A task's visibility check on approve or
reject is:

```text
task.assigneeId == currentUser.id
    OR (task.delegatedFromId is set AND currentUser is the active delegate)
```

Enforced server-side, independent of what the UI shows.

**Approve / reject flow**

```text
POST /api/workflows/tasks/{id}/approve

    1. Verify the task is assigned to (or delegated to) the current user
    2. Verify the task is OPEN
    3. Set task.status = COMPLETED, task.decision = APPROVED
    4. Call the Issue 063 engine's advance() for the parent WorkflowInstance
    5. Write a WorkflowAuditLog entry (Issue 064)
```

Rejection follows the same shape but requires `comment` and calls the engine's `reject()`.

**Frontend structure**

```text
frontend/src/features/workflow/
├── task-inbox/
│   ├── inbox-list.tsx
│   ├── task-detail.tsx
│   └── task-actions.tsx
└── task-history/
```

Reuse the shared table, filter, and form components already established across the programme.

**Document drill-through**

Each `WorkflowTask` carries `documentType` and `documentId` (inherited from its
`WorkflowInstance`). The frontend maps `documentType` to the correct existing detail route (e.g.
`PurchaseRequisition` → `/procurement/requisitions/{id}`) rather than building new document views.

**Permissions to add**

```text
WORKFLOW_TASK_READ_OWN
```

No separate approve/reject permission is needed — the ability to act is determined entirely by task
assignment, not by a role-based permission, since the underlying `WorkflowStep` rule already
determined who was eligible to be assigned.

## Dependencies

- Issue 064 — `WorkflowTask`, approver resolution, and delegation.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Integration tests confirming inbox and history resolve from the token, not a parameter
- [ ] **Security test**: a user cannot approve or reject a task not assigned or delegated to them, via direct API call
- [ ] Test confirming rejection without a comment is rejected
- [ ] Test confirming a completed task cannot be actioned again
- [ ] Test confirming delegated tasks are actionable by the delegate
- [ ] Frontend component tests including loading and empty states
- [ ] End-to-end test: task appears in inbox, user approves it, workflow instance advances
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-10-workflow-notification-engine.md` § 3 |
| Epic | Workflow & Notification Engine |
| Acts on | Issue 063, Issue 064 |
| Same access pattern as | Issue 027 (self-service portal) |
| Pull Request | _to be linked_ |
