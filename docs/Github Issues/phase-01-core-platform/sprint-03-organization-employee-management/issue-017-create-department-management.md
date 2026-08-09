# [FEATURE] Create Department Management

<!-- GitHub title: [FEATURE] Create Department Management
     Labels: feature, hr, priority: high
     Milestone: Sprint 03 - Organization & Employee Management
     Branch: feature/017-create-department-management
     Epic: Organization & Employee Management
     Depends on: 016
     Blocks: 019
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

Create department management with support for nested departments and assigned department heads, so
the organization's internal structure is represented in the system.

## Background

Departments are how work, budget, and approval responsibility are divided. Real organizations nest
them — a Sales division containing Domestic Sales and Export Sales — so a flat list does not
survive contact with an actual org chart.

This introduces the first **self-referencing hierarchy** in the system. The same pattern is reused
for the employee reporting line in Issue 021, so the traversal and cycle-prevention logic written
here is worth getting right once.

Departments are also the grouping used by procurement spend reporting in Sprint 07 and HR
analytics in Sprint 09.

## User Story

As an HR Administrator,
I want to define departments and organize them into a hierarchy,
So that employees, budgets, and approvals can be grouped by organizational unit.

## Acceptance Criteria

```gherkin
Given an authenticated HR administrator
When they create a department under an existing parent department
Then the department is created and appears nested beneath its parent
```

```gherkin
Given department A is the parent of department B
When an administrator attempts to set B as the parent of A
Then the request is rejected because it would create a cycle
```

```gherkin
Given a department that contains employees
When an administrator attempts to delete it
Then the request is rejected with a clear message
```

- [ ] `GET /api/departments` lists departments
- [ ] `POST /api/departments` creates a department
- [ ] `GET /api/departments/{id}` returns a department
- [ ] `PUT /api/departments/{id}` updates a department
- [ ] `DELETE /api/departments/{id}` deletes only when unreferenced
- [ ] `GET /api/departments/tree` returns the nested hierarchy
- [ ] Department code uniqueness enforced
- [ ] Parent department optional — top-level departments have no parent
- [ ] Circular parent references rejected
- [ ] A department cannot be its own parent
- [ ] Department head assignable (a user for now; an employee after Issue 019)
- [ ] A department with child departments or employees cannot be deleted
- [ ] Permissions declared and enforced on every endpoint
- [ ] ERD updated

## Expected Result

An administrator can build the organization's department structure to any depth, assign a head to
each, and retrieve it either flat or as a tree. Invalid structures are rejected rather than stored.

---

## Scope

### Included

- Department CRUD endpoints
- Self-referencing parent hierarchy
- Tree retrieval endpoint
- Cycle prevention
- Department head assignment
- Deletion guards
- Permission enforcement
- ERD update

### Out of Scope

- Positions (Issue 018) and employees (Issue 019)
- Employee reporting hierarchy (Issue 021)
- Department budgets (Sprint 08)
- Department-based spend reporting (Sprint 09)
- Organization tree UI (Issue 021)

## Technical Requirements

**Endpoints**

```text
GET    /api/departments
GET    /api/departments/tree
POST   /api/departments
GET    /api/departments/{id}
PUT    /api/departments/{id}
DELETE /api/departments/{id}
```

**Schema**

```text
Department

id
departmentCode      unique
name
description
companyId           → Company
parentDepartmentId  → Department, nullable
headUserId          → User, nullable
status
createdAt
updatedAt
```

**Hierarchy rules**

```text
Company

    ↓

Department (top level, parentDepartmentId = null)

    ↓

Department (child)

    ↓

Department (grandchild)
```

- A department cannot be its own parent.
- A department cannot be a descendant of itself at any depth — validate the full ancestor chain.
- Maximum depth is not limited, but the tree endpoint must not recurse without bound.

**Permissions to add**

```text
DEPARTMENT_READ
DEPARTMENT_CREATE
DEPARTMENT_UPDATE
DEPARTMENT_DELETE
```

## Dependencies

- Issue 016 — departments belong to a company.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for cycle detection, including multi-level cycles
- [ ] Unit tests for deletion guards
- [ ] Integration tests for all endpoints including the tree endpoint
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-01-core-platform/sprint-03-organization-employee-management.md` § 2 |
| Epic | Organization & Employee Management |
| Same pattern used by | Issue 021 (employee reporting hierarchy) |
| Pull Request | _to be linked_ |
