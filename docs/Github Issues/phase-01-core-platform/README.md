# Phase 01 - Core Platform

**Release Range:** v0.3.0 - v0.4.0  
**Sprints:** Sprint 02, Sprint 03  
**Issues:** 010 - 021  
**Phase Overview:** `academy/08-sprints/phase-01-core-platform/phase-overview.md`

---

# Objective

Build the reusable platform capabilities that every ERP business module depends on: knowing who
the user is, what they are allowed to do, who they represent in the organization, and where they
sit within it.

---

# Milestones

| Milestone | Release | Issues | Epic |
|-----------|---------|--------|------|
| [Sprint 02 - Identity & Access Management](sprint-02-identity-access-management/) | v0.3.0 | 010 - 015 | Identity & Access Management |
| [Sprint 03 - Organization & Employee Management](sprint-03-organization-employee-management/) | v0.4.0 | 016 - 021 | Organization & Employee Management |

---

# Issue Roster

| # | Title | Type | Module | Sprint |
|---|-------|------|--------|--------|
| 010 | Create User Authentication API | Feature | auth | Sprint 02 |
| 011 | Implement User Management | Feature | auth | Sprint 02 |
| 012 | Implement Role Management | Feature | auth | Sprint 02 |
| 013 | Implement Permission System | Feature | auth | Sprint 02 |
| 014 | Create Authentication UI | Feature | frontend | Sprint 02 |
| 015 | Add Security Testing | Task | testing | Sprint 02 |
| 016 | Create Company Management Module | Feature | hr | Sprint 03 |
| 017 | Create Department Management | Feature | hr | Sprint 03 |
| 018 | Create Position Management | Feature | hr | Sprint 03 |
| 019 | Create Employee Management Module | Feature | hr | Sprint 03 |
| 020 | Connect Users With Employees | Feature | hr | Sprint 03 |
| 021 | Implement Organization Tree | Feature | hr | Sprint 03 |

---

# Dependency Order

```text
010 Authentication API

        ↓

011 User Management  →  012 Role Management  →  013 Permission System

        ↓                                              ↓

014 Authentication UI  ←───────────────────────────────┘

        ↓

015 Security Testing

        ↓

016 Company  →  017 Department  →  018 Position

                                        ↓

                              019 Employee Management

                                        ↓

                    020 User-Employee Link    021 Organization Tree
```

---

# Why This Phase Comes Before Business Modules

Every module in Phase 02 and beyond needs three things this phase provides:

| Need | Provided by |
|------|-------------|
| Know who is making a request | Sprint 02 authentication |
| Know what they may do | Sprint 02 permissions |
| Know which employee and department they belong to | Sprint 03 organization |

Approval routing in Sprint 07 and Sprint 10 resolves approvers from the reporting hierarchy
built in Issue 021. Building business modules first would mean retrofitting access control into
every one of them.

---

# Phase Exit Criteria

- [ ] All twelve issues closed.
- [ ] Authentication and authorization working end to end.
- [ ] Role and permission model implemented and enforced server-side.
- [ ] Company, department, position, and employee modules complete.
- [ ] Users linked to employee records.
- [ ] Organization hierarchy displayed.
- [ ] Negative authorization tests passing.
- [ ] Releases v0.3.0 and v0.4.0 published.
