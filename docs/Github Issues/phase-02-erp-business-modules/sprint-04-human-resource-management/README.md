# Sprint 04 - Human Resource Management

**Milestone:** Sprint 04 - Human Resource Management  
**Release:** v0.5.0  
**Phase:** Phase 02 - ERP Business Modules  
**Duration:** 4 Weeks  
**Sprint Spec:** `academy/08-sprints/phase-02-erp-business-modules/sprint-04-human-resource-management.md`

---

# Milestone Definition

| Field | Value |
|-------|-------|
| Title | `Sprint 04 - Human Resource Management` |
| Due date | End of sprint |
| Description | Implement employee operations: profiles, employment lifecycle, attendance, leave, self-service, and HR reporting. Release v0.5.0. |

---

# Sprint Goal

Implement the Human Resource Management module by extending employee records into full HR
operations: employment lifecycle, attendance, leave, self-service, and HR visibility.

---

# Epic

**[Human Resource Management](epic-04-human-resource-management.md)**

---

# Issue Roster

| # | File | GitHub Title | Type | Labels | Branch |
|---|------|--------------|------|--------|--------|
| 022 | [issue-022](issue-022-enhance-employee-profile.md) | `[FEATURE] Enhance Employee Profile` | Feature | `feature`, `hr`, `priority: high` | `feature/022-enhance-employee-profile` |
| 023 | [issue-023](issue-023-implement-employment-lifecycle-management.md) | `[FEATURE] Implement Employment Lifecycle Management` | Feature | `feature`, `hr`, `priority: high` | `feature/023-implement-employment-lifecycle-management` |
| 024 | [issue-024](issue-024-implement-attendance-management.md) | `[FEATURE] Implement Attendance Management` | Feature | `feature`, `hr`, `priority: high` | `feature/024-implement-attendance-management` |
| 025 | [issue-025](issue-025-implement-leave-management.md) | `[FEATURE] Implement Leave Management` | Feature | `feature`, `hr`, `priority: critical` | `feature/025-implement-leave-management` |
| 026 | [issue-026](issue-026-implement-leave-balance-management.md) | `[FEATURE] Implement Leave Balance Management` | Feature | `feature`, `hr`, `priority: critical` | `feature/026-implement-leave-balance-management` |
| 027 | [issue-027](issue-027-create-employee-self-service-portal.md) | `[FEATURE] Create Employee Self-Service Portal` | Feature | `feature`, `hr`, `frontend`, `priority: high` | `feature/027-create-employee-self-service-portal` |
| 028 | [issue-028](issue-028-create-hr-dashboard.md) | `[FEATURE] Create HR Dashboard` | Feature | `feature`, `hr`, `priority: medium` | `feature/028-create-hr-dashboard` |

All seven issues take **Milestone:** `Sprint 04 - Human Resource Management`.

---

# Dependency Order

```text
022 Employee Profile

        ↓

023 Employment Lifecycle

        ↓

024 Attendance          026 Leave Balance

        ↓                       ↓

        └──────────┬────────────┘

                   ↓

           025 Leave Management

                   ↓

027 Self-Service Portal     028 HR Dashboard
```

Issue 026 should land before or with 025 — a leave request cannot be validated without a balance
to check against.

---

# Cross-Module Dependency

Issue 025 routes leave approval to the employee's manager using the reporting hierarchy from
**Issue 021**. This is the first consumer of that structure. If manager assignments are incomplete,
leave requests will have no approver.

Verify the hierarchy is populated before starting Issue 025.

---

# Sprint Definition of Done

- [ ] Employee profiles extended and complete.
- [ ] Employment status transitions enforced and recorded.
- [ ] Attendance recording and reporting working.
- [ ] Leave requests submitted, approved, and reflected in balances.
- [ ] Leave balances accurate and never negative.
- [ ] Employees can access only their own records through self-service.
- [ ] HR dashboard reflecting real data.
- [ ] Tests passing, including denial cases.
- [ ] Documentation and ERD updated.
- [ ] Release v0.5.0 published.

---

# Release Notes Draft

```markdown
# v0.5.0

Human Resource Management Release

## Added

- Extended employee profiles
- Employment lifecycle management
- Attendance recording and reporting
- Leave requests and approval
- Leave balance tracking
- Employee self-service portal
- HR dashboard
```
