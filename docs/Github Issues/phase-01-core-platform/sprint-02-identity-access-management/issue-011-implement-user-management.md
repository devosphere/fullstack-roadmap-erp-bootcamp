# [FEATURE] Implement User Management

<!-- GitHub title: [FEATURE] Implement User Management
     Labels: feature, auth, priority: high
     Milestone: Sprint 02 - Identity & Access Management
     Branch: feature/011-implement-user-management
     Epic: Identity & Access Management
     Depends on: 010
     Blocks: 012
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

## Module: auth
## Sprint: Sprint 02 - Identity & Access Management

---

## Summary

Create user administration: an authorized administrator can create, view, update, deactivate, and
search system users, with validation and a defined account status lifecycle.

## Background

Issue 010 lets a user authenticate. Somebody has to create those accounts, disable them when
people leave, and correct details when they change.

Deactivation rather than deletion is the important decision here. A deleted user breaks every
record that references them — audit logs, created-by fields, approval history. Every ERP system
that allows hard deletion of users eventually has orphaned records nobody can explain. Users are
therefore deactivated, and remain referenceable forever.

This is also the first module that needs to answer "who is allowed to do this?" — answered
provisionally here and properly in Issue 013.

## User Story

As a System Administrator,
I want to create and manage user accounts,
So that people joining, changing roles, or leaving the organization have correct system access.

## Acceptance Criteria

```gherkin
Given an authenticated administrator
When they create a user with a valid email and password
Then the user is created with a hashed password and can log in
```

```gherkin
Given an existing user account
When an administrator deactivates it
Then the user can no longer log in but all records referencing them remain intact
```

```gherkin
Given a non-administrator user
When they request the user list
Then the request is rejected with 403
```

- [ ] `GET /api/users` lists users with pagination and search
- [ ] `POST /api/users` creates a user
- [ ] `GET /api/users/{id}` returns a single user
- [ ] `PUT /api/users/{id}` updates a user
- [ ] `PATCH /api/users/{id}/deactivate` deactivates a user
- [ ] `PATCH /api/users/{id}/activate` reactivates a user
- [ ] Email uniqueness enforced with a clear validation error
- [ ] Password hash never returned in any response
- [ ] Deactivated users cannot log in
- [ ] Users are never hard-deleted
- [ ] A user cannot deactivate their own account
- [ ] Search by email and name supported
- [ ] All endpoints require authentication
- [ ] User status lifecycle documented
- [ ] API documentation updated

## Expected Result

An administrator can manage the full lifecycle of a user account through the API. Ordinary users
cannot. Deactivated accounts lose access without losing history.

---

## Scope

### Included

- User CRUD endpoints
- Pagination and search
- Activate and deactivate
- Validation and uniqueness rules
- Response serialization excluding the password hash
- API documentation

### Out of Scope

- Role assignment (Issue 012)
- Permission enforcement beyond an authentication check (Issue 013)
- User management UI (Issue 014 covers login only; admin screens come later)
- Linking users to employee records (Issue 020)
- Self-service profile editing (Sprint 04, Issue 027)

## Technical Requirements

**Endpoints**

```text
GET    /api/users
POST   /api/users
GET    /api/users/{id}
PUT    /api/users/{id}
PATCH  /api/users/{id}/deactivate
PATCH  /api/users/{id}/activate
```

**User status**

```text
Active → Inactive
```

**Schema addition**

```text
User

status       enum: ACTIVE | INACTIVE, default ACTIVE
firstName
lastName
lastLoginAt
```

**Module structure**

```text
backend/src/modules/users/
├── users.controller.ts
├── users.service.ts
├── users.module.ts
└── dto/
    ├── create-user.dto.ts
    ├── update-user.dto.ts
    └── user-response.dto.ts
```

**Rules**

- Controllers handle request, validation, and response; logic lives in `users.service.ts`.
- Pagination shape must match the standard used by every later list endpoint.
- The response DTO explicitly excludes `password`.

## Dependencies

- Issue 010 — authentication and the JWT guard must exist.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for validation and status transition rules
- [ ] Integration tests for all endpoints
- [ ] Negative test confirming the password hash is never serialized
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-01-core-platform/sprint-02-identity-access-management.md` § 4 |
| Epic | Identity & Access Management |
| Pull Request | _to be linked_ |
