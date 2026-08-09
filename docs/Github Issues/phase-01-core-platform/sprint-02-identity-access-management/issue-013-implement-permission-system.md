# [FEATURE] Implement Permission System

<!-- GitHub title: [FEATURE] Implement Permission System
     Labels: feature, auth, security, priority: critical
     Milestone: Sprint 02 - Identity & Access Management
     Branch: feature/013-implement-permission-system
     Epic: Identity & Access Management
     Depends on: 012
     Blocks: 014, 015
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

## Module: auth
## Sprint: Sprint 02 - Identity & Access Management

---

## Summary

Implement permissions and the authorization guard: define granular permissions, map them to roles,
and enforce them server-side on every protected endpoint.

## Background

Roles from Issue 012 are currently just labels. This issue gives them meaning and makes them
enforceable.

This is the most consequential issue in the sprint. Every endpoint built in the remaining 14
sprints declares a required permission and is checked by the guard created here. If the guard is
wrong, it is wrong roughly 90 times over.

Two rules matter more than the implementation:

- **Enforcement is server-side.** Hiding a button is a usability choice, not a security control. A
  request that bypasses the UI must still be rejected.
- **Permissions resolve per request, not from the token.** If permissions were baked into the JWT,
  revoking access would not take effect until the token expired.

Sprint 11 audits every endpoint against this system and adds record-level ownership checks.

## User Story

As a Security Administrator,
I want permissions defined granularly and enforced on every request,
So that users can only perform the actions their role permits, regardless of how the request is made.

## Acceptance Criteria

```gherkin
Given a user whose roles include the required permission
When they call a protected endpoint
Then the request succeeds
```

```gherkin
Given an authenticated user whose roles do not include the required permission
When they call that endpoint
Then the request is rejected with 403 and the action is not performed
```

```gherkin
Given a user is currently authenticated with a valid token
When an administrator removes their role
Then their next request is rejected without waiting for the token to expire
```

```gherkin
Given an endpoint with no declared permission
When the application starts
Then the omission is detectable rather than silently allowing access
```

- [ ] `GET /api/permissions` lists available permissions
- [ ] `POST /api/roles/{id}/permissions` assigns permissions to a role
- [ ] `DELETE /api/roles/{id}/permissions/{permissionId}` removes a permission from a role
- [ ] `GET /api/roles/{id}/permissions` lists a role's permissions
- [ ] `GET /api/auth/me/permissions` returns the current user's effective permissions
- [ ] Permission seed data created for all existing modules
- [ ] Permissions mapped to the baseline roles from Issue 012
- [ ] Authorization guard created and applied to protected endpoints
- [ ] A declarative decorator marks the permission each endpoint requires
- [ ] Permissions resolved per request, not read from the JWT
- [ ] Users with multiple roles receive the union of their permissions
- [ ] Denial returns 403 with a consistent body that does not leak resource existence
- [ ] Permission matrix documented in `docs/Architecture/`

## Expected Result

Every protected endpoint declares a required permission and rejects requests without it. Revoking a
role takes effect on the next request. The permission matrix is documented and reviewable.

---

## Scope

### Included

- Permission entity and seed data
- Role-to-permission mapping endpoints
- Effective permission resolution for a user
- Authorization guard and permission decorator
- Application of the guard to all existing endpoints
- Consistent denial response
- Permission matrix documentation

### Out of Scope

- Record-level ownership checks and IDOR defence (Sprint 11, Issue 071)
- Permission caching (Sprint 12, Issue 077)
- Role-aware UI navigation (Issue 014)
- Approval authorization limits (Sprint 07, Issue 045)

## Technical Requirements

**Endpoints**

```text
GET    /api/permissions
GET    /api/roles/{id}/permissions
POST   /api/roles/{id}/permissions
DELETE /api/roles/{id}/permissions/{permissionId}
GET    /api/auth/me/permissions
```

**Schema**

```text
Permission

id
code           unique, e.g. USER_CREATE
name
module
description

RolePermission  join table

roleId
permissionId
```

**Permission naming**

```text
<MODULE>_<ACTION>

USER_CREATE     USER_READ     USER_UPDATE     USER_DEACTIVATE
ROLE_CREATE     ROLE_READ     ROLE_UPDATE     ROLE_DELETE
PERMISSION_READ  PERMISSION_ASSIGN
```

Later sprints extend the same pattern: `EMPLOYEE_READ`, `INVOICE_APPROVE`, `REPORT_RUN`.

**Enforcement**

```text
Request

    ↓

JWT Guard          → authenticated?

    ↓

Permission Guard   → resolve user roles → resolve permissions → required permission present?

    ↓

Controller
```

**Rules**

- The required permission is declared on the handler with a decorator, not inferred from the route.
- The guard resolves permissions from the database or a cache invalidated on role change — never from the token.
- Denial responses are identical whether the resource exists or not.
- An endpoint with no declared permission must be a deliberate, visible choice.

## Dependencies

- Issue 012 — roles must exist to map permissions onto.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for permission resolution, including multi-role union
- [ ] Integration tests asserting **denial**, not only success
- [ ] Test proving role revocation takes effect before token expiry
- [ ] Every existing endpoint has a declared permission
- [ ] Code review completed
- [ ] CI green
- [ ] Permission matrix documented in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-01-core-platform/sprint-02-identity-access-management.md` § 6 |
| Epic | Identity & Access Management |
| Audited by | Issue 071 (Sprint 11) |
| Pull Request | _to be linked_ |
