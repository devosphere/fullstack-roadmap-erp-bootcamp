# [EPIC] Organization & Employee Management

<!-- GitHub title: [EPIC] Organization & Employee Management
     Labels: epic, hr
     Milestone: Sprint 03 - Organization & Employee Management
     Branch: none — epics are not worked on directly
     Create this epic AFTER issues 016-021 exist, then replace the placeholder
     numbers in the task list below with the real GitHub issue numbers.
     Copy everything below this comment into the issue body. -->

## Module: hr
## Sprint: Sprint 03 - Organization & Employee Management

---

## Purpose

Build the organizational foundation required for ERP business processes: company structure,
departments, positions, employee records, and the reporting hierarchy.

Sprint 02 established who the user is. This epic establishes who they *represent* and where they
sit in the organization.

```text
Who the user is

        ↓

Who the user represents

        ↓

Where they belong in the organization

        ↓

What business structure they operate within
```

## Business Value

Employee and department data is a hard dependency for HR, approvals, and reporting. Specifically,
the reporting hierarchy built here resolves approvers in Sprint 04 (leave), Sprint 07
(requisitions), and Sprint 10 (the workflow engine).

Building those modules first would mean hard-coding approver lists and rewriting them later.

## Issues

- [ ] #16 Create Company Management Module
- [ ] #17 Create Department Management
- [ ] #18 Create Position Management
- [ ] #19 Create Employee Management Module
- [ ] #20 Connect Users With Employees
- [ ] #21 Implement Organization Tree

## Domain Model

```text
Company

    ↓

Department  (self-referencing hierarchy)

    ↓

Position

    ↓

Employee  ──→  User        (one-to-one, optional)

    ↓

Employee.managerId  ──→  Employee   (reporting line)
```

## Epic Acceptance Criteria

- [ ] All child issues closed
- [ ] Company profile maintained
- [ ] Departments organized hierarchically with assigned heads
- [ ] Positions defined and assignable
- [ ] Employee records complete and searchable
- [ ] Employees linked to user accounts where applicable
- [ ] Reporting hierarchy traversable and displayable
- [ ] All endpoints permission-protected
- [ ] ERD updated
- [ ] Release v0.4.0 published

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-01-core-platform/sprint-03-organization-employee-management.md` |
| Phase overview | `academy/08-sprints/phase-01-core-platform/phase-overview.md` |
| Consumed by | Issues 025, 045, 064 (approval routing) |
| Release | v0.4.0 |
