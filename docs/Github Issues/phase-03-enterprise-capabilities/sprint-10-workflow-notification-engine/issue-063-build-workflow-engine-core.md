# [FEATURE] Build Workflow Engine Core

<!-- GitHub title: [FEATURE] Build Workflow Engine Core
     Labels: feature, backend, priority: critical
     Milestone: Sprint 10 - Workflow & Notification Engine
     Branch: feature/063-build-workflow-engine-core
     Epic: Workflow & Notification Engine
     Blocks: 064
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

Build the state machine that executes configured, versioned workflow definitions against any
document type: definitions with ordered steps, instances that advance step by step, and a
guarantee that changing a definition never affects instances already running.

## Background

Sprint 04 and Sprint 07 each solved one approval problem with code written specifically for that
document type. This issue asks a harder question: what is common to *every* approval process?

The answer, stripped of anything specific to leave or requisitions, is small: a document, a
sequence of steps, and a decision at each step. Everything else — who approves, how many steps,
what conditions apply — is configuration, not code.

**Versioning is the detail most likely to be gotten wrong.** If a definition is edited while
instances are mid-flight, those instances must keep running against the version they started with.
Otherwise, changing "how leave gets approved" today silently rewrites approval rules for requests
submitted last week that are still pending — a correctness problem, not a convenience one.

## User Story

As a System Administrator,
I want to define a workflow once and have it apply automatically to matching documents,
So that a new approval process can be configured without writing code.

## Acceptance Criteria

```gherkin
Given a workflow definition with three ordered steps
When an instance is started against a document
Then the instance begins at step one
```

```gherkin
Given a workflow instance at step two of three
When step two is approved
Then the instance advances to step three
```

```gherkin
Given a workflow instance at the final step
When that step is approved
Then the instance status becomes Approved
```

```gherkin
Given a workflow instance at any step
When that step is rejected
Then the instance status becomes Rejected and no further step executes
```

```gherkin
Given a running workflow instance
When its definition is edited and a new version is activated
Then the running instance continues to completion under the version it started with
```

```gherkin
Given a workflow step whose condition matches no eligible approver
When the instance reaches that step
Then the instance is blocked with a visible error rather than silently stalling
```

- [ ] `GET /api/workflows/definitions` lists workflow definitions
- [ ] `POST /api/workflows/definitions` creates a definition with ordered steps
- [ ] `GET /api/workflows/definitions/{id}` returns a definition
- [ ] `PUT /api/workflows/definitions/{id}` updates a definition, creating a new version
- [ ] `POST /api/workflows/definitions/{id}/activate` activates a definition version
- [ ] `POST /api/workflows/instances` starts an instance against a document
- [ ] `GET /api/workflows/instances/{id}` returns an instance and its current state
- [ ] `GET /api/workflows/instances/document/{documentType}/{documentId}` finds the instance for a document
- [ ] `POST /api/workflows/instances/{id}/cancel` cancels a running instance
- [ ] A document type has exactly one active definition at a time
- [ ] Instances advance through steps in order
- [ ] Rejection at any step terminates the instance
- [ ] Approval at the final step completes the instance
- [ ] Editing a definition versions it; running instances keep the version they started under
- [ ] A step whose condition resolves no approver blocks visibly rather than stalling silently
- [ ] Instance state transitions are the only way status changes — no direct status writes
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

A workflow definition drives instance execution correctly through every step, and definition
changes never retroactively affect what is already running.

---

## Scope

### Included

- Workflow definition CRUD with versioning
- Step ordering
- Instance lifecycle: start, advance, complete, reject, cancel
- Version isolation for running instances
- Unroutable-step error handling
- Permission enforcement
- ERD update

### Out of Scope

- Approver resolution logic itself (Issue 064)
- Task inbox UI (Issue 065)
- Notifications (Issue 066)
- Delegation and escalation (Issue 064)
- Audit trail (Issue 064 introduces the audit log entity; this issue focuses on the state machine)
- Migrating any existing approval flow (Issue 068)

## Technical Requirements

**Endpoints**

```text
GET    /api/workflows/definitions
POST   /api/workflows/definitions
GET    /api/workflows/definitions/{id}
PUT    /api/workflows/definitions/{id}
POST   /api/workflows/definitions/{id}/activate

POST   /api/workflows/instances
GET    /api/workflows/instances/{id}
GET    /api/workflows/instances/document/{documentType}/{documentId}
POST   /api/workflows/instances/{id}/cancel
```

**Schema**

```text
WorkflowDefinition

id
code
name
documentType         e.g. "PurchaseRequisition", "LeaveRequest"
version
isActive
createdBy
createdAt

WorkflowStep

id
workflowDefinitionId  → WorkflowDefinition
stepOrder
approverRuleType       enum: SPECIFIC_USER | ROLE | REPORTING_MANAGER | DEPARTMENT_HEAD
approverRuleValue
condition               nullable, e.g. a value threshold expression
escalationHours

WorkflowInstance

id
workflowDefinitionId   → WorkflowDefinition        -- pinned to a specific version
documentType
documentId
currentStepOrder
status                  enum: PENDING | IN_PROGRESS | APPROVED | REJECTED | CANCELLED | ESCALATED
startedBy
startedAt
completedAt             nullable
```

**One active definition per document type**

```text
unique (documentType) where isActive = true
```

Enforced the same way the default-warehouse uniqueness was enforced in Issue 031 — a partial
unique constraint, not only an application check.

**Version pinning**

`WorkflowInstance.workflowDefinitionId` references the specific version active when the instance
started. Activating a new version does not touch `workflowDefinitionId` on any existing instance —
this single foreign key is what guarantees running instances are unaffected by later edits.

**State transitions**

```text
PENDING → IN_PROGRESS → APPROVED

IN_PROGRESS → REJECTED
IN_PROGRESS → ESCALATED    (Issue 064)
PENDING / IN_PROGRESS → CANCELLED
```

State only changes through defined service methods (`advance`, `reject`, `cancel`) — never by a
direct status field update, which is what keeps the state machine's invariants trustworthy.

**Unroutable step**

If `WorkflowStep.approverRuleType` resolves to zero eligible users (for example, `ROLE` pointing at
a role nobody currently holds), the instance transitions to a distinct blocked state and surfaces
the specific step and rule that failed, rather than the request silently never progressing — the
same principle applied to the unroutable requisition case in Issue 044.

**Permissions to add**

```text
WORKFLOW_DEFINITION_READ
WORKFLOW_DEFINITION_MANAGE
WORKFLOW_INSTANCE_READ
```

Restrict `WORKFLOW_DEFINITION_MANAGE` to administrators — it defines how every future approval
process behaves.

## Dependencies

None directly — this is the starting issue for Sprint 10.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for step advancement, rejection, and completion
- [ ] **Version isolation test**: editing and activating a new definition version does not change the `workflowDefinitionId` or behavior of an already-running instance
- [ ] Test confirming only one definition can be active per document type, including under concurrent activation
- [ ] Test confirming an unroutable step blocks visibly with a specific error
- [ ] Test confirming state only changes through defined transition methods
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
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-10-workflow-notification-engine.md` § 1 |
| Epic | Workflow & Notification Engine |
| Generalizes | Issue 025 (leave), Issue 045 (requisitions) |
| Extended by | Issue 064 (routing and delegation) |
| Pull Request | _to be linked_ |
