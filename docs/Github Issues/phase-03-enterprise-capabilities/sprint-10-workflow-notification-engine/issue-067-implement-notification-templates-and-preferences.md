# [FEATURE] Implement Notification Templates and Preferences

<!-- GitHub title: [FEATURE] Implement Notification Templates and Preferences
     Labels: feature, backend, priority: medium
     Milestone: Sprint 10 - Workflow & Notification Engine
     Branch: feature/067-implement-notification-templates-and-preferences
     Epic: Workflow & Notification Engine
     Depends on: 066
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
- [x] Medium
- [ ] High
- [ ] Critical

## Module: backend
## Sprint: Sprint 10 - Workflow & Notification Engine

---

## Summary

Make notification content configurable through templates with placeholders, and let users choose
which events and channels notify them — while events marked mandatory cannot be disabled.

## Background

Issue 066 can deliver a notification, but its content is currently hard-coded. Every new event type
that gets wired to it — and there will be more, beyond workflow assignment and escalation — would
otherwise require a code change just to word a message differently.

Templates fix content. Preferences fix volume: not every user wants an email for every event, and a
system with no way to reduce that trains people to ignore notifications entirely, which defeats
Issue 066's purpose.

The one constraint that overrides preference: **mandatory events cannot be disabled.** A workflow
task assignment notification is the mechanism by which the task inbox from Issue 065 gets checked
at all; a user should not be able to silence the one signal that tells them to look.

## User Story

As a System Administrator,
I want to edit notification wording without a code deployment,
So that message content can be corrected or improved independently of a release.

## Acceptance Criteria

```gherkin
Given a template for the workflow.task.assigned event
When a notification for that event is dispatched
Then the subject and body are rendered from the template with the document's actual data
```

```gherkin
Given a template references a placeholder that has no value in the given context
When it is rendered
Then it renders as empty and a warning is logged, rather than failing the send
```

```gherkin
Given a user disables email notifications for a non-mandatory event
When that event next fires for them
Then no email is sent, but the in-app notification (if not also disabled) still is
```

```gherkin
Given an event marked mandatory
When a user attempts to disable it
Then the preference change is rejected
```

```gherkin
Given a preference change made today
When a notification for an event that already fired yesterday is inspected
Then it was unaffected by today's change
```

- [ ] `GET /api/notifications/templates` lists templates
- [ ] `POST /api/notifications/templates` creates a template
- [ ] `PUT /api/notifications/templates/{id}` updates a template
- [ ] `POST /api/notifications/templates/{id}/preview` renders a template against sample data
- [ ] `GET /api/notifications/preferences` returns the current user's preferences
- [ ] `PUT /api/notifications/preferences` updates the current user's preferences
- [ ] Templates identified by event code and channel
- [ ] Placeholder rendering substitutes real document data
- [ ] Unknown placeholders render as empty and log a warning rather than failing delivery
- [ ] Preview renders a template with representative sample data without sending anything
- [ ] Users can enable or disable each channel per event, except mandatory events
- [ ] Mandatory events cannot be disabled on any channel; the API rejects the attempt
- [ ] Preference changes apply only to future notifications, never retroactively
- [ ] Issue 066's dispatch consults preferences before sending
- [ ] Permissions declared and enforced

## Expected Result

Notification wording can be corrected without a deployment, and users control their own volume
except where a signal is essential to using the system — which they cannot turn off.

---

## Scope

### Included

- Template CRUD with placeholder rendering
- Template preview
- User notification preferences per event and channel
- Mandatory-event protection
- Preference enforcement at dispatch time
- Permission enforcement

### Out of Scope

- Multi-language templates
- Rich HTML email design beyond basic formatting
- Digest or batched notification preferences
- Per-tenant or organization-wide default preference overrides

## Technical Requirements

**Endpoints**

```text
GET  /api/notifications/templates
POST /api/notifications/templates
PUT  /api/notifications/templates/{id}
POST /api/notifications/templates/{id}/preview

GET  /api/notifications/preferences
PUT  /api/notifications/preferences
```

**Schema**

```text
NotificationTemplate

id
eventCode          e.g. "workflow.task.assigned"
channel            enum: IN_APP | EMAIL
subjectTemplate
bodyTemplate
isActive

NotificationEventDefinition

id
eventCode          unique
description
isMandatory        boolean

NotificationPreference

id
userId             → User
eventCode
channel
isEnabled

unique (userId, eventCode, channel)
```

**Template example**

```text
Subject: Approval required: {{documentType}} {{documentNumber}}

Body:
{{requesterName}} submitted {{documentType}} {{documentNumber}}
for {{amount}}. Please review it in the task inbox.
```

**Rendering**

```text
render(template, context)

    → substitutes each {{placeholder}} with context[placeholder]
    → an unmatched placeholder becomes an empty string
    → the substitution logs a warning naming the missing key, so a template/context mismatch
      is discoverable without a failed send
```

Rendering never throws on a missing key — a formatting gap should not prevent an urgent
notification (a rejected requisition, an escalation) from reaching someone.

**Preference enforcement**

```text
Before Issue 066's dispatch sends a notification:

    1. Look up NotificationEventDefinition for the eventCode
    2. If isMandatory, send regardless of any preference
    3. Otherwise, look up NotificationPreference for (recipient, eventCode, channel)
       → default to enabled if no preference row exists
       → skip the channel if the preference is explicitly disabled
```

**Mandatory event protection**

`PUT /api/notifications/preferences` rejects any attempted update to a `(eventCode, channel)`
combination where `NotificationEventDefinition.isMandatory = true`. `workflow.task.assigned` is
seeded as mandatory for this reason.

**Retroactive isolation**

Preferences are read only at dispatch time for notifications created after the change — an
already-`QUEUED` or `SENT` notification (Issue 066) is never revisited by a later preference
change.

**Permissions to add**

```text
NOTIFICATION_TEMPLATE_MANAGE
NOTIFICATION_PREFERENCE_MANAGE_OWN
```

## Dependencies

- Issue 066 — the dispatch mechanism this issue's preferences gate and whose content this issue's
  templates supply.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for placeholder rendering, including the missing-key case
- [ ] Unit test confirming preview never triggers an actual send
- [ ] Unit tests for preference resolution, including the no-preference-row default
- [ ] Test confirming mandatory events reject a disable attempt
- [ ] Test confirming a preference change does not affect already-queued notifications
- [ ] Integration test confirming Issue 066's dispatch respects preferences end to end
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
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-10-workflow-notification-engine.md` § 5 |
| Epic | Workflow & Notification Engine |
| Gates | Issue 066 (dispatch) |
| Pull Request | _to be linked_ |
