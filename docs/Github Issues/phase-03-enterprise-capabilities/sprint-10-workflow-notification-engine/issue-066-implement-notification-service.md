# [FEATURE] Implement Notification Service

<!-- GitHub title: [FEATURE] Implement Notification Service
     Labels: feature, backend, priority: high
     Milestone: Sprint 10 - Workflow & Notification Engine
     Branch: feature/066-implement-notification-service
     Epic: Workflow & Notification Engine
     Depends on: 064
     Blocks: 067
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

## Module: backend
## Sprint: Sprint 10 - Workflow & Notification Engine

---

## Summary

Deliver in-app and email notifications asynchronously, retrying failed deliveries with backoff, so
users learn a task is waiting on them without a request ever blocking to send it.

## Background

The task inbox in Issue 065 is pull — a user has to go look. This issue is push: tell them.

The rule that governs the whole design: **dispatch must never block the request that triggered
it.** A workflow task being created, an escalation firing, a scheduled report completing (Issue
062) — none of these can wait on an email server responding before returning to the caller. Every
notification is therefore queued and delivered by a background worker, the same infrastructure
pattern Issue 062's scheduled reports already established.

The second concern is failure. Email delivery fails routinely — a mail server hiccup, a full
inbox, a bad address. A notification that fails once and vanishes is a silent gap; this issue
retries with backoff up to a limit, and anything that still fails after that is logged and visible
to administrators rather than lost.

## User Story

As a User,
I want to be notified when I have a task or an important event occurs,
So that I don't have to keep checking the application to find out.

## Acceptance Criteria

```gherkin
Given a workflow task is created
When the assignment happens
Then a notification is queued and the triggering request returns without waiting for delivery
```

```gherkin
Given a notification delivery fails
When the failure is transient
Then it retries automatically with backoff up to the configured limit
```

```gherkin
Given a notification exhausts its retry limit
When the final attempt fails
Then the failure is logged and visible to administrators, not silently dropped
```

```gherkin
Given a user has unread notifications
When they open their notification centre
Then unread notifications are visually distinct from read ones
```

```gherkin
Given a user marks a notification as read
When they reload the notification centre
Then it reflects the read state
```

- [ ] `GET /api/notifications` returns the current user's notifications
- [ ] `POST /api/notifications/{id}/read` marks a notification as read
- [ ] In-app notification delivery implemented
- [ ] Email notification delivery implemented
- [ ] Dispatch is queued and processed by a background worker, never inline with the triggering request
- [ ] Failed deliveries retry automatically with exponential backoff
- [ ] Deliveries that exhaust the retry limit are logged and queryable by administrators
- [ ] Each notification records its channel, status, and delivery timestamp
- [ ] Notification centre distinguishes read from unread
- [ ] Workflow task assignment (Issue 064) triggers a notification
- [ ] Workflow escalation (Issue 064) triggers a notification
- [ ] Permissions declared and enforced

## Expected Result

Users are notified of tasks and events without any part of the application waiting on delivery.
Failures are retried automatically and, if they persist, remain visible rather than disappearing.

---

## Scope

### Included

- In-app and email notification delivery
- Asynchronous, queued dispatch
- Retry with backoff
- Failure visibility for administrators
- Notification centre with read state
- Wiring workflow assignment and escalation as notification triggers
- Permission enforcement

### Out of Scope

- Notification content and templates (Issue 067)
- User channel and event preferences (Issue 067)
- SMS or push notification channels
- Notification digest/batching
- Real-time delivery via websockets (in-app notifications are pull-on-load for this issue)

## Technical Requirements

**Endpoints**

```text
GET  /api/notifications
POST /api/notifications/{id}/read
```

**Schema**

```text
Notification

id
recipientId       → User
eventCode          e.g. "workflow.task.assigned", "workflow.task.escalated"
channel            enum: IN_APP | EMAIL
subject
body
status             enum: QUEUED | SENT | FAILED
retryCount
sentAt             nullable
readAt             nullable
createdAt
```

**Dispatch flow**

```text
Triggering event occurs (e.g. WorkflowTask created)

        ↓

Notification row(s) created with status QUEUED
                                           (this write IS synchronous — creating the record is cheap;
                                            actually sending it is not)

        ↓

Triggering request returns immediately

        ↓

Background worker picks up QUEUED notifications

        ↓

Attempts delivery per channel

        ↓

Success → status SENT, sentAt set
Failure → retryCount incremented, retried with backoff

        ↓

Retry limit exhausted → status FAILED, logged for administrator visibility
```

**Backoff**

```text
Attempt 1    immediate
Attempt 2    after 1 minute
Attempt 3    after 5 minutes
Attempt 4    after 30 minutes
Attempt 5    after 2 hours       final attempt
```

Exact intervals are configurable; the requirement is that they increase, not that they match this
schedule precisely.

**Trigger wiring**

Two call sites are added in this issue:

```text
Issue 064: WorkflowTask created         → notify the assignee (or delegate)
Issue 064: WorkflowTask escalated       → notify the new assignee, and optionally the original
```

Both call a single `notificationService.send(eventCode, recipientId, context)` method — the workflow
module never constructs a `Notification` row directly, matching the pattern already established for
cross-module calls throughout the programme (e.g. sales calling finance in Issue 053).

**Permissions to add**

```text
NOTIFICATION_READ_OWN
NOTIFICATION_ADMIN_READ_FAILURES
```

## Dependencies

- Issue 064 — the workflow events (task assignment, escalation) this issue delivers notifications
  for.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for backoff interval calculation
- [ ] Unit tests for retry-limit exhaustion and failure logging
- [ ] Integration test confirming notification creation does not block the triggering request
- [ ] Integration test confirming a queued notification is eventually delivered
- [ ] Test confirming a permanently failed notification is visible to administrators
- [ ] Test confirming read/unread state updates correctly
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
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-10-workflow-notification-engine.md` § 4 |
| Epic | Workflow & Notification Engine |
| Triggered by | Issue 064 (task assignment, escalation) |
| Extended by | Issue 067 (templates and preferences) |
| Same background-job pattern as | Issue 062 (scheduled reports) |
| Pull Request | _to be linked_ |
