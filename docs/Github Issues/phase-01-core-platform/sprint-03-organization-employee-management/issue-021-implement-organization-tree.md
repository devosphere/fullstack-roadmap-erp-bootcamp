# [FEATURE] Implement Organization Tree

<!-- GitHub title: [FEATURE] Implement Organization Tree
     Labels: feature, hr, priority: high
     Milestone: Sprint 03 - Organization & Employee Management
     Branch: feature/021-implement-organization-tree
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

Implement the employee reporting hierarchy: assign a manager to each employee, traverse the
resulting structure, and display it as an organization tree.

## Background

This is the highest-leverage issue in the sprint, and its value is mostly invisible in Sprint 03.

The reporting line built here is the data source for approval routing in three later sprints:

| Consumer | Uses the hierarchy to |
|----------|----------------------|
| Sprint 04, Issue 025 | Route a leave request to the employee's manager |
| Sprint 07, Issue 045 | Route a purchase requisition up the chain by value |
| Sprint 10, Issue 064 | Resolve approvers generically in the workflow engine |

If the hierarchy is wrong, approvals go to the wrong person in three different modules, and the
defect will be reported as a workflow bug rather than a data bug.

Two correctness concerns matter more than the UI:

- **Cycles.** If A reports to B and B reports to A, any traversal loops forever. Approval routing
  would hang rather than fail visibly.
- **Orphans.** Every employee except the top of the tree needs a manager, or approval routing has
  nowhere to send the request.

## User Story

As a Manager,
I want to see the organizational reporting structure,
So that I know who reports to me and how approvals flow through the organization.

## Acceptance Criteria

```gherkin
Given an employee with an assigned manager
When the organization tree is requested
Then the employee appears nested beneath their manager
```

```gherkin
Given employee A reports to employee B
When an administrator attempts to set A as B's manager
Then the request is rejected because it would create a cycle
```

```gherkin
Given a deep reporting chain
When an administrator attempts to assign a manager that is a descendant of the employee
Then the request is rejected after checking the full chain, not just the direct manager
```

```gherkin
Given an employee is terminated
When the tree is requested
Then their direct reports are visible as needing reassignment rather than silently orphaned
```

- [ ] `PATCH /api/employees/{id}/manager` assigns or changes an employee's manager
- [ ] `GET /api/employees/{id}/reports` lists direct reports
- [ ] `GET /api/employees/{id}/reports/all` lists all descendants
- [ ] `GET /api/employees/{id}/chain` returns the management chain upward
- [ ] `GET /api/organization/tree` returns the full hierarchy
- [ ] Manager must be an active employee
- [ ] An employee cannot be their own manager
- [ ] Circular reporting relationships rejected at any depth
- [ ] Employees without a manager identified as top-level
- [ ] Terminating a manager surfaces their direct reports for reassignment
- [ ] Tree endpoint handles depth without unbounded recursion
- [ ] Organization tree rendered in the frontend
- [ ] Tree is expandable, collapsible, and searchable
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

The organization's reporting structure is stored, traversable in both directions, and displayed as
a tree. Invalid structures are rejected at write time rather than discovered during approval
routing two sprints later.

---

## Scope

### Included

- Manager assignment endpoint
- Upward and downward traversal endpoints
- Full tree endpoint
- Cycle prevention at any depth
- Orphan handling on termination
- Frontend organization tree component
- Permission enforcement
- ERD update

### Out of Scope

- Approval routing itself (Sprint 07, Issue 045; Sprint 10, Issue 064)
- Delegation of approval authority (Sprint 10, Issue 064)
- Dotted-line or matrix reporting
- Headcount and span-of-control reporting (Sprint 09)
- Historical hierarchy — the tree reflects the present, not a point in time

## Technical Requirements

**Endpoints**

```text
PATCH  /api/employees/{id}/manager
GET    /api/employees/{id}/reports
GET    /api/employees/{id}/reports/all
GET    /api/employees/{id}/chain
GET    /api/organization/tree
```

**Schema change**

```text
Employee

managerId   → Employee, nullable
```

**Structure**

```text
CEO                        managerId = null

    ↓

Department Director

    ↓

Manager

    ↓

Team Lead

    ↓

Employee
```

**Validation rules**

- `managerId` cannot equal the employee's own id.
- The proposed manager must not appear anywhere in the employee's descendant set — walk the full
  chain, not just the direct manager.
- The manager must be an employee with status `ACTIVE`.
- Multiple top-level employees are permitted but should be reportable, since more than one usually
  indicates missing data.

**Traversal**

- Downward traversal is bounded by a maximum depth to prevent runaway recursion on bad data.
- The tree endpoint returns a nested structure in a single query where possible; if the dataset
  grows, this becomes a Sprint 12 optimization target.

**Permissions to add**

```text
EMPLOYEE_MANAGER_ASSIGN
ORGANIZATION_TREE_READ
```

Grant `ORGANIZATION_TREE_READ` broadly — the org chart is normally visible to all employees.

## Dependencies

- Issue 019 — employee records must exist.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for cycle detection at depth 1, 2, and 3+
- [ ] Unit tests for self-assignment rejection
- [ ] Integration tests for all traversal endpoints
- [ ] Test confirming terminated managers surface their reports
- [ ] Frontend component test for tree rendering and expansion
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-01-core-platform/sprint-03-organization-employee-management.md` § 6 |
| Epic | Organization & Employee Management |
| Same pattern as | Issue 017 (department hierarchy) |
| Consumed by | Issues 025, 045, 064 |
| Pull Request | _to be linked_ |
