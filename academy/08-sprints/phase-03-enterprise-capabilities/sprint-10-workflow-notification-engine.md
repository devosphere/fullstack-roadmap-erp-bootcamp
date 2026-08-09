# Sprint 10 - Workflow & Notification Engine

**Sprint:** Sprint 10  
**Phase:** Phase 03 - Enterprise Capabilities  
**Duration:** 3-4 Weeks  
**Release Target:** v0.11.0  
**Status:** Planned

---

# Sprint Goal

Implement a reusable Workflow and Notification Engine by generalizing the approval logic prototyped in Sprint 07 into a configurable engine, and by adding a task inbox, notification delivery, templates, preferences, and a workflow audit trail.

At the end of this sprint, approval processes should be changeable through configuration rather than code, and users should be notified automatically when they need to act.

---

# Sprint Context

Approval logic already exists, but it is hard-coded and single-purpose:

```text
Sprint 07

Purchase Requisition Approval

- Routing rules written in the procurement module
- Applies only to requisitions
- Changing a rule requires a code change and a deployment
```

Other modules need the same capability:

```text
Leave Requests          (Sprint 04)
Sales Discounts         (Sprint 06)
Journal Entries         (Sprint 08)
Payment Authorization   (Sprint 08)
```

Sprint 10 extracts the pattern into a shared engine.

```text
Hard-Coded Approval

        ↓

Configurable Workflow
```

---

# Business Outcome

After completing this sprint, the ERP platform will support:

- Workflow definitions configured by administrators.
- Multi-step approval routing.
- Delegation and escalation.
- A unified task inbox.
- In-app and email notifications.
- Reusable notification templates.
- Per-user notification preferences.
- A complete workflow audit trail.

---

# Sprint Objectives

By the end of this sprint, learners should understand:

- State machine design.
- Configuration-driven behaviour.
- Generalizing a specific implementation into a reusable service.
- Asynchronous and background processing.
- Retry and failure handling.
- Template rendering.
- Auditability requirements.

---

# Sprint Theme

## "Build the Engine, Not the Special Case"

Sprint 07 solved one approval problem.

Sprint 10 asks a harder question:

```text
What is common to every approval process?

        ↓

A document + a sequence of steps + a decision at each step

        ↓

Everything else is configuration
```

The measure of success is that adding a new approval process requires **no new code**.

---

# Business Capability

## Workflow & Notification Engine

The engine provides:

- Workflow definition management.
- Workflow instance execution.
- Approval routing and delegation.
- Task management.
- Notification delivery.
- Template management.
- Audit trail.

---

# Domain Concepts

---

# Workflow Definition

A configured description of an approval process.

Example:

```text
Workflow:  Purchase Requisition Approval
Applies To: PurchaseRequisition

Step 1: Department Manager    (limit ≤ 50,000)
Step 2: Finance Officer       (limit > 50,000)
Step 3: Director              (limit > 500,000)
```

---

# Workflow Step

A single decision point within a definition.

Stores:

- Step Order.
- Approver Rule.
- Condition.
- Escalation Period.

Approver rules:

```text
Specific User
Role
Reporting Manager
Department Head
```

---

# Workflow Instance

A running execution of a definition against one document.

Status flow:

```text
Pending → In Progress → Approved → Rejected → Cancelled → Escalated
```

---

# Task

A unit of work assigned to a user by a workflow instance.

Status flow:

```text
Open → Completed → Delegated → Expired
```

---

# Notification

A message informing a user that something happened or that action is required.

Channels:

```text
In-App
Email
```

---

# Notification Template

A reusable message body with placeholders.

Example:

```text
Subject: Approval required: {{documentType}} {{documentNumber}}

Body:
{{requesterName}} submitted {{documentType}} {{documentNumber}}
for {{amount}}. Please review it in the task inbox.
```

---

# Audit Trail

An immutable record of every workflow action.

Records:

- Who acted.
- What decision was made.
- When it happened.
- What comment was given.
- What the state was before and after.

---

# Sprint Scope

---

# 1. Workflow Engine Core

## Objective

Build the state machine that executes configured workflows.

## Features

Administrators can:

- Create workflow definitions.
- Add ordered steps with conditions.
- Activate and deactivate definitions.
- Version a definition.

The engine can:

- Start an instance when a document is submitted.
- Advance to the next step on approval.
- Terminate on rejection.
- Complete when all steps are approved.

## Business Rules

- A document type can have only one active definition at a time.
- Changing a definition does not affect instances already running.
- Steps execute in order.
- A condition that matches no approver blocks the instance and raises an error.

## Acceptance Criteria

- Workflow definition CRUD available.
- Instance starts, advances, and completes correctly.
- Rejection terminates the instance.
- Running instances unaffected by definition changes.

---

# 2. Approval Routing and Delegation

## Objective

Determine who must act and allow that responsibility to be transferred.

## Features

Users can:

- Be routed a task based on role, hierarchy, or explicit assignment.
- Delegate their approvals for a date range.
- View who a task was delegated from.

The engine can:

- Escalate a task that is not actioned within its configured period.

## Business Rules

- Routing uses the employee reporting hierarchy from Sprint 03.
- A user cannot approve a document they submitted.
- Delegation has a start and end date.
- Delegated approvals record both the delegate and the original approver.
- Escalation moves the task to the next approver and records the reason.

## Acceptance Criteria

- Routing resolves the correct approver for each rule type.
- Self-approval blocked.
- Delegation works within its date range only.
- Escalation triggers after the configured period.

---

# 3. Task Inbox

## Objective

Give every user one place to see what needs their attention.

## Features

Users can:

- View tasks assigned to them.
- Filter by document type and status.
- Open the source document from a task.
- Approve or reject with a comment.
- View completed task history.

## Business Rules

- A task is visible only to its assignee and delegates.
- Rejection requires a comment.
- Completing a task advances the workflow instance.
- A completed task cannot be actioned again.

## Acceptance Criteria

- Task inbox lists pending tasks.
- Filtering works.
- Approve and reject actions advance or terminate the instance.
- Task history available.
- Access restricted to the assignee.

---

# 4. Notification Service

## Objective

Deliver messages reliably through multiple channels.

## Features

The system can:

- Send in-app notifications.
- Send email notifications.
- Queue notifications for background delivery.
- Retry failed deliveries.

Users can:

- View their notification centre.
- Mark notifications as read.

## Business Rules

- Notification dispatch runs asynchronously and never blocks the triggering request.
- Failed deliveries retry with backoff up to a configured limit.
- Permanently failed notifications are logged and visible to administrators.
- A notification records its channel, status, and delivery timestamp.

## Acceptance Criteria

- In-app and email notifications delivered.
- Delivery is asynchronous.
- Failures retried and logged.
- Notification centre shows read and unread state.

---

# 5. Notification Templates and Preferences

## Objective

Make message content configurable and let users control what they receive.

## Features

Administrators can:

- Create and edit templates.
- Use placeholders for document data.
- Preview a rendered template.

Users can:

- Choose which events notify them.
- Choose which channels to receive.

## Business Rules

- Templates are identified by event code.
- Unknown placeholders render as empty and are logged as a warning.
- Users cannot disable notifications for events marked mandatory.
- Preference changes apply to future notifications only.

## Acceptance Criteria

- Template CRUD available.
- Placeholders render correctly with document data.
- Preview works.
- User preferences respected during dispatch.
- Mandatory events cannot be disabled.

---

# 6. Workflow Audit Trail

## Objective

Make every workflow decision reconstructable.

## Features

Users can:

- View the full history of a workflow instance.
- See each step, approver, decision, comment, and timestamp.
- See delegations and escalations.

## Business Rules

- Audit records are append-only and cannot be edited or deleted.
- Every state transition writes an audit record.
- Audit records survive workflow definition changes.
- Audit history is visible to the document owner, approvers, and administrators.

## Acceptance Criteria

- Complete audit history displayed per document.
- Records immutable.
- Delegations and escalations visible.
- Access is role-based.

---

# Database Design

## New Entities

```text
WorkflowDefinition
WorkflowStep
WorkflowInstance
WorkflowTask
WorkflowAuditLog
Delegation
Notification
NotificationTemplate
NotificationPreference
```

---

# Workflow Definition Table

```text
WorkflowDefinition

id
code
name
documentType
version
isActive
createdBy
createdAt
```

---

# Workflow Step Table

```text
WorkflowStep

id
workflowDefinitionId
stepOrder
approverRuleType
approverRuleValue
condition
escalationHours
```

---

# Workflow Instance Table

```text
WorkflowInstance

id
workflowDefinitionId
documentType
documentId
currentStepOrder
status
startedBy
startedAt
completedAt
```

---

# Workflow Task Table

```text
WorkflowTask

id
workflowInstanceId
stepOrder
assigneeId
delegatedFromId
status
decision
comment
dueAt
completedAt
```

---

# Workflow Audit Log Table

```text
WorkflowAuditLog

id
workflowInstanceId
actorId
action
fromStatus
toStatus
comment
createdAt
```

---

# Notification Table

```text
Notification

id
recipientId
eventCode
channel
subject
body
status
retryCount
sentAt
readAt
```

---

# Notification Template Table

```text
NotificationTemplate

id
eventCode
channel
subjectTemplate
bodyTemplate
isActive
```

---

# Entity Relationships

```text
WorkflowDefinition → WorkflowStep

WorkflowDefinition → WorkflowInstance → WorkflowTask

WorkflowInstance → WorkflowAuditLog

WorkflowTask → Notification

NotificationTemplate → Notification

User → Delegation

User → NotificationPreference

WorkflowInstance → (any document: Requisition, Leave, Journal Entry, ...)
```

---

# API Requirements

## Workflow Definition APIs

```text
GET    /api/workflows/definitions
POST   /api/workflows/definitions
GET    /api/workflows/definitions/{id}
PUT    /api/workflows/definitions/{id}
POST   /api/workflows/definitions/{id}/activate
```

---

## Workflow Instance APIs

```text
POST   /api/workflows/instances
GET    /api/workflows/instances/{id}
GET    /api/workflows/instances/document/{documentType}/{documentId}
POST   /api/workflows/instances/{id}/cancel
```

---

## Task Inbox APIs

```text
GET    /api/workflows/tasks/inbox
GET    /api/workflows/tasks/history
POST   /api/workflows/tasks/{id}/approve
POST   /api/workflows/tasks/{id}/reject
```

---

## Delegation APIs

```text
GET    /api/workflows/delegations
POST   /api/workflows/delegations
DELETE /api/workflows/delegations/{id}
```

---

## Audit APIs

```text
GET    /api/workflows/audit/{workflowInstanceId}
```

---

## Notification APIs

```text
GET    /api/notifications
POST   /api/notifications/{id}/read
GET    /api/notifications/preferences
PUT    /api/notifications/preferences
```

---

## Notification Template APIs

```text
GET    /api/notifications/templates
POST   /api/notifications/templates
PUT    /api/notifications/templates/{id}
POST   /api/notifications/templates/{id}/preview
```

---

# GitHub Execution

---

# Epic

## Epic: Workflow & Notification Engine

Purpose:

Build the shared automation layer that makes business processes configurable and keeps users informed.

---

# GitHub Issues

---

# Issue 063 - Build Workflow Engine Core

Type:

```
Feature
```

Acceptance Criteria:

- Workflow definition CRUD completed.
- Instance starts, advances, and completes correctly.
- Rejection terminates the instance.
- Running instances unaffected by definition changes.

---

# Issue 064 - Implement Approval Routing and Delegation

Type:

```
Feature
```

Acceptance Criteria:

- Routing resolves approvers by role, hierarchy, and explicit assignment.
- Self-approval blocked.
- Delegation works within its date range.
- Escalation triggers after the configured period.

---

# Issue 065 - Create Task Inbox

Type:

```
Feature
```

Acceptance Criteria:

- Task inbox lists pending tasks.
- Approve and reject advance or terminate the instance.
- Rejection requires a comment.
- Access restricted to the assignee and delegates.

---

# Issue 066 - Implement Notification Service

Type:

```
Feature
```

Acceptance Criteria:

- In-app and email notifications delivered.
- Dispatch is asynchronous.
- Failures retried with backoff and logged.
- Notification centre shows read state.

---

# Issue 067 - Implement Notification Templates and Preferences

Type:

```
Feature
```

Acceptance Criteria:

- Template CRUD completed.
- Placeholders render with document data.
- User preferences respected.
- Mandatory events cannot be disabled.

---

# Issue 068 - Migrate Purchase Requisition Approval to the Workflow Engine

Type:

```
Improvement
```

Acceptance Criteria:

- Sprint 07 hard-coded routing removed.
- Requisition approval runs on a configured workflow definition.
- Existing approval behaviour unchanged.
- Audit trail available for requisitions.
- Regression tests pass.

---

# Development Workflow

Every change follows:

```text
GitHub Issue

        ↓

Feature Branch

        ↓

Development

        ↓

Commit

        ↓

Pull Request

        ↓

Code Review

        ↓

Merge

        ↓

Release
```

---

# Testing Requirements

## Unit Testing

Required:

- State transition rules.
- Approver resolution per rule type.
- Condition evaluation.
- Self-approval prevention.
- Delegation date range logic.
- Escalation timing.
- Template placeholder rendering.
- Retry and backoff calculation.

---

## Integration Testing

Test:

- Workflow definition APIs.
- Instance lifecycle APIs.
- Task inbox APIs.
- Delegation APIs.
- Notification dispatch and retry.
- Audit APIs.

---

## End-to-End Testing

### Multi-Step Approval Flow

```text
Submit Document

        ↓

Workflow Instance Starts

        ↓

Task Appears in Approver 1 Inbox

        ↓

Notification Received

        ↓

Approver 1 Approves

        ↓

Task Appears in Approver 2 Inbox

        ↓

Approver 2 Approves

        ↓

Document Approved

        ↓

Audit Trail Shows Both Decisions
```

---

### Delegation Flow

```text
Approver 1 Delegates to Approver 3

        ↓

Submit Document

        ↓

Task Appears in Approver 3 Inbox

        ↓

Approver 3 Approves

        ↓

Audit Records Delegate and Original Approver
```

---

### Rejection Flow

```text
Submit Document

        ↓

Approver Rejects With Comment

        ↓

Instance Status = Rejected

        ↓

Requester Notified

        ↓

Document Cannot Proceed
```

---

# Documentation Deliverables

## Business Documentation

- Approval matrix specification.
- Delegation and escalation policy.
- Notification event catalogue.

---

## Technical Documentation

- Workflow engine architecture.
- Updated ERD.
- Workflow and notification API documentation.
- ADR: workflow engine design.
- ADR: asynchronous notification delivery and retry strategy.
- Migration note for the Sprint 07 approval refactor.

---

# Sprint Deliverables

## Workflow and Notification Engine

Completed:

- Workflow engine core.
- Approval routing and delegation.
- Task inbox.
- Notification service.
- Notification templates and preferences.
- Workflow audit trail.
- Purchase requisition approval migrated to the engine.

---

## Engineering

Completed:

- APIs implemented.
- Database updated.
- Background workers implemented.
- Automated tests created.
- Sprint 07 hard-coded routing removed.

---

## Documentation

Completed:

- Workflow configuration documented.
- Notification events documented.

---

# Sprint Review

The learner demonstrates:

1. Configure a two-step workflow definition.
2. Submit a document and show the instance start.
3. Show the task appearing in the approver inbox.
4. Show the notification received.
5. Approve through both steps.
6. Demonstrate delegation.
7. Demonstrate rejection with a comment.
8. Show the complete audit trail.

---

# Sprint Retrospective

## Discussion Topics

- Generalizing a specific implementation.
- Configuration versus code trade-offs.
- Asynchronous processing and failure handling.
- Refactoring an existing module without changing behaviour.
- Lessons learned.

---

# Release

**Version:** `v0.11.0`

---

# Release Notes

```markdown
# v0.11.0

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

---

# Definition of Done

Sprint 10 is complete when:

- [ ] Workflow engine core completed.
- [ ] Approval routing and delegation completed.
- [ ] Task inbox completed.
- [ ] Notification service completed.
- [ ] Templates and preferences completed.
- [ ] Workflow audit trail completed.
- [ ] Purchase requisition approval migrated with no behaviour change.
- [ ] Adding a new approval process requires no new code.
- [ ] APIs documented.
- [ ] Tests passing.
- [ ] Documentation completed.
- [ ] Pull Request approved.
- [ ] Release v0.11.0 published.

---

# Skills Acquired

After completing Sprint 10, learners will understand:

## Business Analysis

- Workflow and approval modelling.
- Delegation and escalation policy design.
- Notification requirement gathering.

---

## Backend Development

- State machine implementation.
- Configuration-driven design.
- Asynchronous processing.
- Retry and failure handling.
- Template rendering.

---

## Frontend Development

- Task inbox interfaces.
- Notification centres.
- Workflow configuration screens.

---

## ERP Engineering

- Extracting shared capability from specific implementations.
- Refactoring without changing behaviour.
- Designing auditable automated processes.

---

# Next Sprint Preview

# Sprint 11 - Security Hardening

Planned:

- Threat modelling.
- Authentication hardening and MFA.
- Authorization review and least privilege.
- Input validation and injection defence.
- Secrets management.
- Security testing and dependency scanning.
