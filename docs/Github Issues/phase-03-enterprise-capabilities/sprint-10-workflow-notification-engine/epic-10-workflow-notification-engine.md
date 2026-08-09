# [EPIC] Workflow & Notification Engine

<!-- GitHub title: [EPIC] Workflow & Notification Engine
     Labels: epic, backend
     Milestone: Sprint 10 - Workflow & Notification Engine
     Branch: none — epics are not worked on directly
     Create this epic AFTER issues 063-068 exist, then replace the placeholder
     numbers in the task list below with the real GitHub issue numbers.
     Copy everything below this comment into the issue body. -->

## Module: backend
## Sprint: Sprint 10 - Workflow & Notification Engine

---

## Purpose

Generalize the approval logic prototyped twice already into a single configurable engine, and add
a task inbox and notification delivery on top of it.

```text
Hard-Coded Approval

        ↓

Configurable Workflow
```

## Business Value

Sprint 04 (leave) and Sprint 07 (requisitions) each hard-coded their own approval routing — a
deliberate decision at the time, made so the right abstraction could be found from two real
examples rather than guessed at from zero. This epic is where that debt is paid: the routing
pattern common to both is extracted, and Issue 045's requisition approval is migrated onto it with
verified unchanged behavior.

## Issues

- [ ] #63 Build Workflow Engine Core
- [ ] #64 Implement Approval Routing and Delegation
- [ ] #65 Create Task Inbox
- [ ] #66 Implement Notification Service
- [ ] #67 Implement Notification Templates and Preferences
- [ ] #68 Migrate Purchase Requisition Approval to the Workflow Engine

## Domain Model

```text
WorkflowDefinition → WorkflowStep

WorkflowDefinition → WorkflowInstance → WorkflowTask

WorkflowInstance → WorkflowAuditLog

WorkflowTask → Notification ← NotificationTemplate

User → Delegation
User → NotificationPreference
```

## Measure of Success

Adding a new approval process after this epic requires **no new code** — only a new
`WorkflowDefinition`. Issue 068 is the proof: migrating an existing, tested approval flow onto the
engine with zero behavior change, verified by the existing regression suite.

## Epic Acceptance Criteria

- [ ] All child issues closed
- [ ] Workflow instances execute configured, versioned definitions correctly
- [ ] Approvers resolve by role, hierarchy, or explicit assignment
- [ ] Self-approval blocked; delegation and escalation respect their configured constraints
- [ ] Task inbox lets users act on assigned work with an immutable decision trail
- [ ] Notifications deliver asynchronously with retry and never block the triggering request
- [ ] Templates render correctly and user preferences are respected except for mandatory events
- [ ] Purchase requisition approval (Issue 045) migrated with no behavior change
- [ ] Release v0.11.0 published

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-10-workflow-notification-engine.md` |
| Phase overview | `academy/08-sprints/phase-03-enterprise-capabilities/phase-overview.md` |
| Generalizes | Issue 025 (leave, not migrated), Issue 045 (requisitions, migrated) |
| Uses | Issue 021 (reporting hierarchy), Issue 012 (roles) |
| Release | v0.11.0 |
