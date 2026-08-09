# [FEATURE] Create Employee Self-Service Portal

<!-- GitHub title: [FEATURE] Create Employee Self-Service Portal
     Labels: feature, hr, frontend, priority: high
     Milestone: Sprint 04 - Human Resource Management
     Branch: feature/027-create-employee-self-service-portal
     Epic: Human Resource Management
     Depends on: 020, 024, 025, 026
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

## Module: hr
## Sprint: Sprint 04 - Human Resource Management

---

## Summary

Build the employee-facing portal where staff view their own profile, update their contact details,
record attendance, submit leave requests, and check their leave balance.

## Background

Every HR capability built in this sprint has so far been an API used by HR Officers. This issue is
where ordinary employees actually use the system.

The defining constraint is **record-level access**. Until now, permissions have been functional —
does this role have `EMPLOYEE_READ`? Here the question changes: an employee has read access to
*employee records*, but only to *their own*.

That distinction is exactly the vulnerability class Sprint 11 audits for (Issue 071). Changing an
id in a URL must not return someone else's payslip-adjacent data. The check belongs on the server;
a portal that filters client-side is not access control.

Managers get a second view — their team — resolved from the reporting hierarchy rather than from a
list they can edit.

## User Story

As an Employee,
I want a portal where I can see my own HR information and submit requests,
So that I can manage routine HR tasks without contacting the HR department.

## Acceptance Criteria

```gherkin
Given an authenticated employee
When they open the self-service portal
Then they see their own profile, attendance, leave balance, and leave requests
```

```gherkin
Given employee A is authenticated
When they request employee B's record by changing the id in the URL or API call
Then the request is rejected with 403, regardless of what the UI shows
```

```gherkin
Given an authenticated employee
When they update their contact information
Then the change is saved
```

```gherkin
Given an authenticated employee
When they attempt to update their position, department, or employment status
Then the request is rejected
```

```gherkin
Given a user account with no linked employee record
When they open the self-service portal
Then they see a clear message rather than an error page
```

- [ ] Portal home showing a personal summary
- [ ] Profile page showing the employee's own record
- [ ] Contact information editable by the employee
- [ ] Employment fields read-only to the employee
- [ ] Attendance page with clock in and clock out
- [ ] Attendance history for the employee
- [ ] Leave balance display per leave type
- [ ] Leave request submission form
- [ ] Leave request history and cancellation
- [ ] Manager view listing direct reports
- [ ] Manager approval queue for leave requests
- [ ] All record-level access enforced server-side
- [ ] Editable field allow-list enforced server-side
- [ ] Unlinked user accounts handled gracefully
- [ ] Loading, empty, and error states on every view
- [ ] Responsive layout
- [ ] Permissions declared and enforced

## Expected Result

Employees handle routine HR tasks themselves. They can reach their own records and nobody else's,
and the restriction holds even when the request bypasses the interface entirely.

---

## Scope

### Included

- Self-service portal shell and navigation
- Own-profile view and limited editing
- Attendance clock in, clock out, and history
- Leave balance display
- Leave request submission, history, and cancellation
- Manager team view and approval queue
- Server-side record-level access enforcement
- Editable field allow-list
- Unlinked account handling
- Loading, empty, and error states

### Out of Scope

- HR administration screens
- HR dashboard (Issue 028)
- Document upload by the employee
- Notification of approval decisions (Sprint 10, Issue 066)
- Payslip access

## Technical Requirements

**Routes**

```text
/portal                     summary
/portal/profile             own profile
/portal/attendance          clock in / out and history
/portal/leave               balance, requests, submission
/portal/team                manager only — direct reports
/portal/approvals           manager only — pending leave requests
```

**Endpoints consumed**

```text
GET    /api/employees/me
PUT    /api/employees/me/contact
GET    /api/attendance/me
POST   /api/attendance/clock-in
POST   /api/attendance/clock-out
GET    /api/leave/balances/me
GET    /api/leave/requests/me
POST   /api/leave/requests
POST   /api/leave/requests/{id}/cancel
GET    /api/employees/me/reports
GET    /api/leave/requests/pending
```

**New backend endpoint**

```text
PUT /api/employees/me/contact
```

Accepts only an explicit allow-list of fields:

```text
email
phone
address
emergencyContact
```

Any other field in the payload is rejected — not ignored. Silently dropping unexpected fields hides
client bugs and makes the endpoint's contract ambiguous.

**Record-level access rule**

Every `/me` endpoint resolves the employee from the authenticated user via the link created in
**Issue 020**. None of them accept an employee id parameter. That removes the IDOR surface entirely
rather than defending against it.

For manager views, the team is resolved server-side from `Employee.managerId`. The client never
sends the list of employees it wants.

**Frontend structure**

```text
frontend/src/
├── app/portal/
└── features/
    ├── self-service/
    ├── attendance/
    └── leave/
```

**Rules**

- Hiding a control is a usability choice; the server still rejects the request.
- Reuse the shared form, table, and state components rather than creating portal-specific variants.

## Dependencies

- Issue 020 — the user-to-employee link, required to resolve "me".
- Issue 024 — attendance endpoints.
- Issue 025 — leave request endpoints.
- Issue 026 — leave balance endpoints.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Component tests for each portal view
- [ ] Integration tests confirming `/me` endpoints resolve from the token, not a parameter
- [ ] Test confirming employee A cannot read employee B's records via the API
- [ ] Test confirming non-allow-listed fields are rejected on contact update
- [ ] Test confirming managers see only their own direct reports
- [ ] End-to-end test: log in, clock in, submit leave, view balance
- [ ] Test for the unlinked-account path
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-04-human-resource-management.md` § 6 |
| Epic | Human Resource Management |
| Audited by | Issue 071 (Sprint 11, IDOR and record-level access) |
| Pull Request | _to be linked_ |
