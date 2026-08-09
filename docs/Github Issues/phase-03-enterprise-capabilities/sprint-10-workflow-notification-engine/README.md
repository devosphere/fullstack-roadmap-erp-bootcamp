# Sprint 10 - Workflow & Notification Engine

**Milestone:** Sprint 10 - Workflow & Notification Engine  
**Release:** v0.11.0  
**Phase:** Phase 03 - Enterprise Capabilities  
**Duration:** 3-4 Weeks  
**Sprint Spec:** `academy/08-sprints/phase-03-enterprise-capabilities/sprint-10-workflow-notification-engine.md`

---

# Milestone Definition

| Field | Value |
|-------|-------|
| Title | `Sprint 10 - Workflow & Notification Engine` |
| Due date | End of sprint |
| Description | Generalize approval routing into a configurable engine and add a task inbox and notification service. Release v0.11.0. |

---

# Sprint Goal

Generalize the approval logic prototyped in Sprint 04 and Sprint 07 into a configurable workflow
engine, and add a task inbox, notification delivery, templates, preferences, and a workflow audit
trail.

---

# Epic

**[Workflow & Notification Engine](epic-10-workflow-notification-engine.md)**

---

# Issue Roster

| # | File | GitHub Title | Type | Labels | Branch |
|---|------|--------------|------|--------|--------|
| 063 | [issue-063](issue-063-build-workflow-engine-core.md) | `[FEATURE] Build Workflow Engine Core` | Feature | `feature`, `backend`, `priority: critical` | `feature/063-build-workflow-engine-core` |
| 064 | [issue-064](issue-064-implement-approval-routing-and-delegation.md) | `[FEATURE] Implement Approval Routing and Delegation` | Feature | `feature`, `backend`, `priority: critical` | `feature/064-implement-approval-routing-and-delegation` |
| 065 | [issue-065](issue-065-create-task-inbox.md) | `[FEATURE] Create Task Inbox` | Feature | `feature`, `frontend`, `priority: high` | `feature/065-create-task-inbox` |
| 066 | [issue-066](issue-066-implement-notification-service.md) | `[FEATURE] Implement Notification Service` | Feature | `feature`, `backend`, `priority: high` | `feature/066-implement-notification-service` |
| 067 | [issue-067](issue-067-implement-notification-templates-and-preferences.md) | `[FEATURE] Implement Notification Templates and Preferences` | Feature | `feature`, `backend`, `priority: medium` | `feature/067-implement-notification-templates-and-preferences` |
| 068 | [issue-068](issue-068-migrate-purchase-requisition-approval-to-the-workflow-engine.md) | `[IMPROVEMENT] Migrate Purchase Requisition Approval to the Workflow Engine` | Improvement | `improvement`, `procurement`, `technical-debt`, `priority: high` | `feature/068-migrate-purchase-requisition-approval-to-the-workflow-engine` |

All six issues take **Milestone:** `Sprint 10 - Workflow & Notification Engine`.

---

# Dependency Order

```text
063 Workflow Engine Core

        ↓

064 Approval Routing & Delegation

        ↓

065 Task Inbox          066 Notification Service

                                ↓

                        067 Notification Templates & Preferences

065 + 067 ──────────────────────┘

        ↓

068 Migrate Purchase Requisition Approval
```

Issue 068 must land last — it is a refactor of existing, working functionality (Issue 045), and it
depends on the full engine being complete and tested first.

---

# This Sprint Pays Down Deliberate Debt

Two earlier sprints hard-coded their own approval routing on purpose, flagged at the time as debt to
be paid here:

| Hard-coded approval | Built in | Consequence |
|---|---|---|
| Leave request approval | Sprint 04, Issue 025 | Single-step, fixed to the employee's direct manager |
| Requisition approval | Sprint 07, Issue 045 | Multi-step, value-based escalation |

**Issue 068 migrates Issue 045's routing onto the engine with no behavior change**, verified by
regression tests against the existing test suite. Issue 025's leave approval is **not** migrated in
this sprint — it remains a noted candidate for the same treatment, since migrating everything at
once was judged more risk than the sprint's scope justified.

The measure of success for Issues 063-064: **adding a new approval process afterward requires no
new code**, only configuration.

---

# Sprint Definition of Done

- [ ] Workflow engine executes configured, versioned definitions.
- [ ] Multi-step routing resolves by role, hierarchy, or explicit assignment.
- [ ] Self-approval blocked; delegation and escalation working within their constraints.
- [ ] Task inbox lists, approves, and rejects with a required comment on rejection.
- [ ] Notifications delivered asynchronously with retry and a visible audit trail.
- [ ] Templates render correctly; user preferences respected except for mandatory events.
- [ ] Purchase requisition approval migrated with verified unchanged behavior.
- [ ] Documentation and ERD updated.
- [ ] Release v0.11.0 published.

---

# Release Notes Draft

```markdown
# v0.11.0

Workflow & Notification Engine Release

## Added

- Configurable Workflow Engine
- Approval Routing, Delegation, and Escalation
- Task Inbox
- Notification Service (In-App and Email)
- Notification Templates and Preferences
- Workflow Audit Trail

## Changed

- Purchase requisition approval now runs on the workflow engine
```
