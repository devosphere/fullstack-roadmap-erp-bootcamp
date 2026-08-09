# [FEATURE] Connect Users With Employees

<!-- GitHub title: [FEATURE] Connect Users With Employees
     Labels: feature, hr, auth, priority: high
     Milestone: Sprint 03 - Organization & Employee Management
     Branch: feature/020-connect-users-with-employees
     Epic: Organization & Employee Management
     Depends on: 019
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
## Sprint: Sprint 03 - Organization & Employee Management

---

## Summary

Link system users to employee records with an optional one-to-one relationship, so an authenticated
request can resolve the employee it represents.

## Background

Sprint 02 knows *who is logged in*. Issue 019 knows *who works here*. Nothing yet connects the two.

That connection is what makes self-service and approval routing possible:

```text
Authenticated User

        ↓

Linked Employee

        ↓

Department and Manager

        ↓

"Show my leave balance"  /  "Route this to my manager"
```

The relationship is deliberately **optional in both directions**. Some employees never receive a
login. Some accounts — integrations, service accounts — are not people. Forcing a link would mean
creating fake employee records for system accounts, which then pollute headcount reports.

## User Story

As an Employee,
I want my user account linked to my employee record,
So that the system knows who I am in the organization and can show me my own information.

## Acceptance Criteria

```gherkin
Given an unlinked user account and an unlinked employee record
When an administrator links them
Then requests authenticated as that user can resolve the employee record
```

```gherkin
Given a user already linked to an employee
When an administrator attempts to link them to a second employee
Then the request is rejected
```

```gherkin
Given an employee already linked to a user
When an administrator attempts to link a different user to that employee
Then the request is rejected
```

```gherkin
Given an authenticated user with no linked employee record
When they request their employee profile
Then the response is a clear, handled error rather than a crash
```

- [ ] `POST /api/employees/{id}/link-user` links a user to an employee
- [ ] `DELETE /api/employees/{id}/link-user` removes the link
- [ ] `GET /api/employees/me` returns the authenticated user's employee record
- [ ] `GET /api/users/{id}/employee` returns a user's linked employee
- [ ] Relationship is one-to-one and enforced in both directions
- [ ] A user cannot be linked to more than one employee
- [ ] An employee cannot be linked to more than one user
- [ ] The link is optional — users and employees can exist unlinked
- [ ] Unlinked access to `GET /api/employees/me` returns a handled error
- [ ] Deactivating a user does not delete the employee record
- [ ] Terminating an employee optionally deactivates the linked user
- [ ] Link and unlink actions written to the security audit log
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

An administrator can associate accounts with employee records. An authenticated employee can
retrieve their own profile. Accounts without an employee, and employees without an account, both
continue to work.

---

## Scope

### Included

- Link and unlink endpoints
- One-to-one enforcement in both directions
- Current-employee resolution endpoint
- Handled behaviour for unlinked accounts
- Termination-to-deactivation coordination
- Audit logging
- Permission enforcement
- ERD update

### Out of Scope

- Employee self-service portal UI (Sprint 04, Issue 027)
- Automatic user account creation on hire
- Bulk linking or import
- Approval routing that uses the link (Sprint 07, Issue 045)

## Technical Requirements

**Endpoints**

```text
POST   /api/employees/{id}/link-user
DELETE /api/employees/{id}/link-user
GET    /api/employees/me
GET    /api/users/{id}/employee
```

**Schema change**

```text
Employee

userId    → User, nullable, unique
```

A unique constraint on a nullable column gives one-to-one in both directions while allowing
unlinked records on either side.

**Relationship**

```text
User  ←──── 0..1 ────→  Employee

User without Employee      valid   (service account)
Employee without User      valid   (no system access)
User with one Employee     valid
User with two Employees    rejected
```

**Termination behaviour**

Terminating an employee prompts to deactivate the linked user. The two records stay linked so
history is preserved; only access is removed.

**Permissions to add**

```text
EMPLOYEE_LINK_USER
```

Restrict to Administrator and HR Officer.

## Dependencies

- Issue 019 — employee records must exist.
- Issue 011 — user management must exist.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for one-to-one enforcement in both directions
- [ ] Integration tests for link, unlink, and current-employee resolution
- [ ] Test for the unlinked-user path
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-01-core-platform/sprint-03-organization-employee-management.md` § 5 |
| Epic | Organization & Employee Management |
| Consumed by | Issue 027 (self-service), Issue 045 (approval routing) |
| Pull Request | _to be linked_ |
