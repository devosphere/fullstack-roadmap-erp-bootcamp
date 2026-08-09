# [DOCS] Complete User Documentation

<!-- GitHub title: [DOCS] Complete User Documentation
     Labels: documentation, docs, priority: high
     Milestone: Sprint 16 - Final Capstone Release
     Branch: docs/101-complete-user-documentation
     Epic: Final Capstone Release
     Depends on: 100
     Blocks: 103
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [ ] Task
- [ ] Improvement
- [x] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [x] High
- [ ] Critical

## Module: docs
## Sprint: Sprint 16 - Final Capstone Release

---

## Summary

Write a complete manual for every ERP module, aimed at the business user who will actually operate
it — no engineering vocabulary, every procedure verified by executing it, screenshots matching the
released version.

## Background

Every document written so far in this programme — sprint specs, ADRs, API references, this very
issue tracker — was written for the people building the system. This is the first documentation set
written for the people **using** it: the HR officer approving leave, the sales representative
converting a quotation, the finance manager closing a period.

The verification standard here is the same one Issue 092 already applied to the setup guide and
Issue 084 applied to the disaster recovery runbook: **every documented procedure is executed to
confirm it works**, not written from memory of how the feature was supposed to behave. A manual
describing a button that moved, or a workflow step Issue 068's migration changed, is worse than no
manual — it actively misleads someone trying to follow it.

Screenshots specifically must reflect the **released** version — captured against the release
candidate that Issue 100 validated, not against whatever the UI looked like when the feature was
first built in an earlier sprint, since Issue 090's component refactor changed the visual
presentation of nearly every screen in the system.

## User Story

As an HR Officer, Sales Representative, or Finance Manager (or any other end user),
I want a manual written for someone like me, describing exactly what I'll see,
So that I can use the system correctly without needing an engineer to explain it.

## Acceptance Criteria

```gherkin
Given the user manual for any module
When it is read by someone unfamiliar with the system's internal implementation
Then they can complete the module's core workflows using only the manual, without engineering vocabulary getting in the way
```

```gherkin
Given a documented procedure in any manual
When it is executed exactly as written
Then it produces the described result
```

```gherkin
Given a screenshot in any manual
When compared to the actual released application
Then it matches exactly, not an earlier version's appearance
```

```gherkin
Given the getting-started guide
When a new user follows it
Then they reach a working, oriented starting point in the application
```

- [ ] Getting Started manual written: login, navigation, general orientation
- [ ] Identity and Access Management manual written: for administrators managing users, roles, and permissions
- [ ] Organization and Employee Management manual written
- [ ] Human Resources manual written: attendance, leave, self-service (Issue 027)
- [ ] Inventory manual written: products, warehouses, stock, adjustments
- [ ] Sales manual written: customers, quotations, orders, deliveries, invoices
- [ ] Purchasing manual written: suppliers, requisitions, approvals, orders, receipts
- [ ] Finance and Accounting manual written: chart of accounts, journal entries, receivables, payables, reports
- [ ] Reporting and Analytics manual written: running reports, the executive dashboard, export
- [ ] Workflows and Approvals manual written: the task inbox (Issue 065), notification preferences (Issue 067)
- [ ] Administration manual written: system configuration accessible to administrators
- [ ] Every manual written for a business audience, avoiding engineering vocabulary
- [ ] Every documented procedure executed and confirmed to produce the described result
- [ ] Screenshots captured against the actual release candidate, matching Issue 100's validated build
- [ ] User manuals published under `docs/User Manuals/`

## Expected Result

Every ERP module has a manual a business user can actually follow, verified to work exactly as
written, with screenshots that match what they will actually see.

---

## Scope

### Included

- Manuals for every module and getting-started orientation
- Business-audience writing standard
- Execution verification of every procedure
- Screenshots against the release candidate
- Publication under `docs/User Manuals/`

### Out of Scope

- Technical documentation (Issue 102)
- Video tutorials or interactive walkthroughs
- Translations (English only, for this programme's scope)
- In-app help/tooltips (a product feature, not a documentation deliverable)

## Technical Requirements

**Manual structure per module**

```text
docs/User Manuals/<module>.md

- Overview: what this module does, in business terms
- Getting started: how to reach this module in the application
- Core workflows: step-by-step, each verified by execution
- Common questions or troubleshooting
- Screenshots at each key step
```

**Writing standard**

```text
Avoid:    "The API returns a 403", "the endpoint validates the DTO"
Prefer:   "You'll see an error message if you don't have permission to do this"

Avoid:    "Navigate to the /procurement/requisitions route"
Prefer:   "Open the Purchasing menu and select Requisitions"
```

**Verification discipline**

```text
For every documented step:
    1. Actually perform it in the release candidate application
    2. Confirm the described result occurs
    3. Capture the screenshot at that exact point
    4. If the step doesn't work as described, fix the documentation
       (or, if it reveals an actual defect, route it back to Issue 100)
```

**Module coverage mapping**

| Manual | Covers issues |
|--------|---------------|
| Identity & Access | 010-015 |
| Organization & Employee | 016-021 |
| Human Resources | 022-028 |
| Inventory | 029-035 |
| Sales | 036-042 |
| Purchasing | 043-049 |
| Finance & Accounting | 050-056 |
| Reporting & Analytics | 057-062 |
| Workflows & Approvals | 063-068 |
| Administration | cross-cutting configuration surfaced across all sprints |

**Screenshot currency**

Capture against the exact release candidate build validated in Issue 100 — not against an earlier
sprint's UI, since Issue 090's component library refactor changed the visual appearance of tables,
forms, and navigation across the entire application.

## Dependencies

- Issue 100 — the validated, regression-tested release candidate this documentation describes and
  screenshots.

## Definition of Done

- [ ] All eleven manuals written (getting started + 9 module manuals + administration)
- [ ] Written for a business audience, verified by having someone unfamiliar with the codebase read at least one manual and confirm it's understandable
- [ ] Every procedure executed and verified to work as documented
- [ ] Screenshots captured against the release candidate
- [ ] Content accurate and complete
- [ ] Links resolve correctly
- [ ] Renders correctly on GitHub
- [ ] Code review completed
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-16-final-capstone-release.md` § 3 |
| Epic | Final Capstone Release |
| Describes the validated build from | Issue 100 |
| Same verification discipline as | Issue 092, Issue 084 |
| Used in | Issue 103 (capstone demonstration) |
| Pull Request | _to be linked_ |
