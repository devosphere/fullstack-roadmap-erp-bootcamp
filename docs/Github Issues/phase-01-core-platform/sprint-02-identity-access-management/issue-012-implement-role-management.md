# [FEATURE] Implement Role Management

<!-- GitHub title: [FEATURE] Implement Role Management
     Labels: feature, auth, priority: high
     Milestone: Sprint 02 - Identity & Access Management
     Branch: feature/012-implement-role-management
     Epic: Identity & Access Management
     Depends on: 011
     Blocks: 013
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

Implement role management: create and maintain named roles, assign roles to users, and seed the
baseline ERP roles that later modules assume exist.

## Background

Assigning permissions directly to users does not survive contact with an organization. A company
with 200 employees and 40 permissions produces 8,000 individual grants that nobody can audit, and
onboarding a new hire means copying someone else's access by hand.

A role is the indirection that fixes this:

```text
Without roles:   User → Permission          (many-to-many, unmanageable)

With roles:      User → Role → Permission   (assign one role, get the right access)
```

Roles are the unit the business actually thinks in — "make her a Finance Officer" — which means the
model matches how access is really requested and approved.

## User Story

As a System Administrator,
I want to define roles and assign them to users,
So that access can be granted by job function instead of configured per person.

## Acceptance Criteria

```gherkin
Given an authenticated administrator
When they create a role with a unique name
Then the role is created and available for assignment
```

```gherkin
Given a user and an existing role
When the administrator assigns the role to the user
Then the user's role list includes it
```

```gherkin
Given a role that is currently assigned to at least one user
When an administrator attempts to delete it
Then the request is rejected with a clear message
```

- [ ] `GET /api/roles` lists roles
- [ ] `POST /api/roles` creates a role
- [ ] `GET /api/roles/{id}` returns a role
- [ ] `PUT /api/roles/{id}` updates a role
- [ ] `DELETE /api/roles/{id}` deletes a role only when unassigned
- [ ] `POST /api/users/{id}/roles` assigns roles to a user
- [ ] `DELETE /api/users/{id}/roles/{roleId}` removes a role from a user
- [ ] `GET /api/users/{id}/roles` lists a user's roles
- [ ] Role name uniqueness enforced
- [ ] A user can hold multiple roles
- [ ] Baseline roles seeded: Administrator, Manager, Employee, HR Officer, Finance Officer
- [ ] System roles cannot be deleted
- [ ] Role changes written to the security audit log
- [ ] Role model documented in `docs/Architecture/`

## Expected Result

An administrator can define roles once and grant access by assigning them. A user's roles are
retrievable and form the basis for the permission checks added in Issue 013.

---

## Scope

### Included

- Role CRUD endpoints
- User-to-role assignment and removal
- Role name uniqueness
- Baseline role seed data
- System role protection
- Audit logging of role changes
- Role model documentation

### Out of Scope

- Permissions and permission-to-role mapping (Issue 013)
- Enforcement of roles on endpoints (Issue 013)
- Role management UI
- Approval limits per role (Sprint 07, Issue 045)

## Technical Requirements

**Endpoints**

```text
GET    /api/roles
POST   /api/roles
GET    /api/roles/{id}
PUT    /api/roles/{id}
DELETE /api/roles/{id}

GET    /api/users/{id}/roles
POST   /api/users/{id}/roles
DELETE /api/users/{id}/roles/{roleId}
```

**Schema**

```text
Role

id
name           unique
description
isSystemRole   boolean
createdAt
updatedAt

UserRole       join table

userId
roleId
assignedAt
assignedBy
```

**Baseline roles to seed**

```text
Administrator     Full system configuration access
Manager           Team and approval access
Employee          Self-service access
HR Officer        Employee record access
Finance Officer   Financial record access
```

**Rules**

- The user-to-role relationship is many-to-many.
- `isSystemRole` roles are protected from deletion and rename.
- Assignment records who granted it and when, for audit.

## Dependencies

- Issue 011 — user management must exist so roles have something to attach to.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for uniqueness and deletion guard rules
- [ ] Integration tests for role CRUD and assignment
- [ ] Seed script verified on a clean database
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-01-core-platform/sprint-02-identity-access-management.md` § 5 |
| Epic | Identity & Access Management |
| Used by | Issue 045 (approval limits), Issue 064 (approval routing) |
| Pull Request | _to be linked_ |
