# Sprint 03 - Organization & Employee Management

**Milestone:** Sprint 03 - Organization & Employee Management  
**Release:** v0.4.0  
**Phase:** Phase 01 - Core Platform  
**Duration:** 3-4 Weeks  
**Sprint Spec:** `academy/08-sprints/phase-01-core-platform/sprint-03-organization-employee-management.md`

---

# Milestone Definition

| Field | Value |
|-------|-------|
| Title | `Sprint 03 - Organization & Employee Management` |
| Due date | End of sprint |
| Description | Create company structure, department management, employee profiles, and organizational relationships. Release v0.4.0. |

---

# Sprint Goal

Implement the organizational foundation of the ERP platform by creating company structure,
department management, employee profiles, and organizational relationships.

---

# Epic

**[Organization & Employee Management](epic-03-organization-employee-management.md)**

---

# Issue Roster

| # | File | GitHub Title | Type | Labels | Branch |
|---|------|--------------|------|--------|--------|
| 016 | [issue-016](issue-016-create-company-management-module.md) | `[FEATURE] Create Company Management Module` | Feature | `feature`, `hr`, `priority: high` | `feature/016-create-company-management-module` |
| 017 | [issue-017](issue-017-create-department-management.md) | `[FEATURE] Create Department Management` | Feature | `feature`, `hr`, `priority: high` | `feature/017-create-department-management` |
| 018 | [issue-018](issue-018-create-position-management.md) | `[FEATURE] Create Position Management` | Feature | `feature`, `hr`, `priority: medium` | `feature/018-create-position-management` |
| 019 | [issue-019](issue-019-create-employee-management-module.md) | `[FEATURE] Create Employee Management Module` | Feature | `feature`, `hr`, `priority: critical` | `feature/019-create-employee-management-module` |
| 020 | [issue-020](issue-020-connect-users-with-employees.md) | `[FEATURE] Connect Users With Employees` | Feature | `feature`, `hr`, `auth`, `priority: high` | `feature/020-connect-users-with-employees` |
| 021 | [issue-021](issue-021-implement-organization-tree.md) | `[FEATURE] Implement Organization Tree` | Feature | `feature`, `hr`, `priority: high` | `feature/021-implement-organization-tree` |

All six issues take **Milestone:** `Sprint 03 - Organization & Employee Management`.

---

# Dependency Order

```text
016 Company

        ↓

017 Department        018 Position

        └───────┬───────┘

                ↓

        019 Employee Management

                ↓

020 User-Employee Link    021 Organization Tree
```

Issues 017 and 018 can run in parallel once 016 lands. Issues 020 and 021 can run in parallel
once 019 lands.

---

# Scope Coverage Note

| Sprint spec section | Covered by |
|---------------------|------------|
| § 1 Company Management | Issue 016 |
| § 2 Department Management | Issue 017 |
| § 3 Position Management | Issue 018 |
| § 4 Employee Profile Management | Issue 019 |
| § 5 User-Employee Association | Issue 020 |
| § 6 Organizational Hierarchy | Issue 021 |
| § 7 Employee Search & Filtering | Issue 019 |

---

# Why This Sprint Matters Downstream

The reporting hierarchy built in Issue 021 is not a display feature. It is the data source for
approval routing:

| Consumer | Uses |
|----------|------|
| Sprint 04, Issue 025 | Leave approval routes to the employee's manager |
| Sprint 07, Issue 045 | Requisition approval routes up the hierarchy by value |
| Sprint 10, Issue 064 | The workflow engine resolves approvers from the same structure |

An incorrect hierarchy sends approvals to the wrong person in three later sprints.

---

# Sprint Definition of Done

- [ ] Company profile management completed.
- [ ] Department management with hierarchy completed.
- [ ] Position management completed.
- [ ] Employee CRUD and search completed.
- [ ] Users linked to employee records.
- [ ] Organization tree displayed.
- [ ] Permissions enforced on all new endpoints.
- [ ] Tests passing, including denial cases.
- [ ] Documentation and ERD updated.
- [ ] Release v0.4.0 published.

---

# Release Notes Draft

```markdown
# v0.4.0

Organization & Employee Foundation Release

## Added

- Company management
- Department management with hierarchy
- Position management
- Employee records and search
- User-to-employee association
- Organization tree
```
