# [FEATURE] Create Position Management

<!-- GitHub title: [FEATURE] Create Position Management
     Labels: feature, hr, priority: medium
     Milestone: Sprint 03 - Organization & Employee Management
     Branch: feature/018-create-position-management
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
- [x] Medium
- [ ] High
- [ ] Critical

## Module: hr
## Sprint: Sprint 03 - Organization & Employee Management

---

## Summary

Create position management: named job positions with a level and an owning department, assignable
to employees.

## Background

A position describes a job, not a person. "Senior Software Engineer" exists whether or not anyone
currently holds it.

Keeping positions as their own entity rather than a free-text field on the employee record avoids
the usual outcome: the same job spelled six different ways across the employee list, making it
impossible to report on headcount by role or to define approval rules by seniority.

The position level introduced here is used later for approval authority — a rule such as "requires
approval at manager level or above" reads the level rather than matching a job title string.

## User Story

As an HR Administrator,
I want to define job positions with levels and owning departments,
So that employees can be assigned consistent, reportable job roles.

## Acceptance Criteria

```gherkin
Given an authenticated HR administrator
When they create a position with a unique code and an existing department
Then the position is created and available for assignment to employees
```

```gherkin
Given a position currently assigned to at least one employee
When an administrator attempts to delete it
Then the request is rejected with a clear message
```

- [ ] `GET /api/positions` lists positions with filtering by department
- [ ] `POST /api/positions` creates a position
- [ ] `GET /api/positions/{id}` returns a position
- [ ] `PUT /api/positions/{id}` updates a position
- [ ] `DELETE /api/positions/{id}` deletes only when unassigned
- [ ] Position code uniqueness enforced
- [ ] Position belongs to a department
- [ ] Position level stored and validated against the defined scale
- [ ] Job description stored
- [ ] Positions can be deactivated without deletion
- [ ] A position assigned to an employee cannot be deleted
- [ ] Permissions declared and enforced on every endpoint
- [ ] ERD updated

## Expected Result

An administrator can define the organization's job positions once. Employee records reference them
rather than repeating job titles as free text.

---

## Scope

### Included

- Position CRUD endpoints
- Department association
- Position level scale
- Job description
- Deactivation
- Deletion guard
- Permission enforcement
- ERD update

### Out of Scope

- Employee assignment to positions (Issue 019)
- Salary bands and compensation (Sprint 04)
- Headcount planning and vacancy tracking
- Approval limits by level (Sprint 07, Issue 045)

## Technical Requirements

**Endpoints**

```text
GET    /api/positions
POST   /api/positions
GET    /api/positions/{id}
PUT    /api/positions/{id}
DELETE /api/positions/{id}
```

**Schema**

```text
Position

id
positionCode     unique
title
description
departmentId     → Department
level            enum
status
createdAt
updatedAt
```

**Position levels**

```text
ENTRY
JUNIOR
MID
SENIOR
LEAD
MANAGER
DIRECTOR
EXECUTIVE
```

Store the level as an enum, not free text, so later approval rules can compare seniority.

**Permissions to add**

```text
POSITION_READ
POSITION_CREATE
POSITION_UPDATE
POSITION_DELETE
```

## Dependencies

- Issue 016 — the company must exist.
- Issue 017 — positions belong to a department. If 017 is still in progress, the department
  reference can be made nullable and tightened once 017 merges.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for uniqueness and deletion guard rules
- [ ] Integration tests for all endpoints
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-01-core-platform/sprint-03-organization-employee-management.md` § 3 |
| Epic | Organization & Employee Management |
| Level used by | Issue 045 (approval limits) |
| Pull Request | _to be linked_ |
