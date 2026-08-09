# Sprint 01 - Application Foundation & Full-Stack Environment Setup

**Milestone:** Sprint 01 - Application Foundation  
**Release:** v0.2.0  
**Phase:** Phase 00 - Foundation  
**Duration:** 2-3 Weeks  
**Sprint Spec:** `academy/08-sprints/phase-00-foundation/sprint-01-application-foundation.md`

---

# Milestone Definition

| Field | Value |
|-------|-------|
| Title | `Sprint 01 - Application Foundation` |
| Due date | End of sprint |
| Description | Create the full-stack development environment, application architecture, and initial software structure that will support all future ERP modules. Release v0.2.0. |

---

# Sprint Goal

Establish the technical foundation of the ERP application by creating the full-stack
development environment, configuring the application architecture, and implementing the initial
software structure that will support future ERP modules.

---

# Epic

**[Application Foundation](epic-01-application-foundation.md)**

---

# Issue Roster

| # | File | GitHub Title | Type | Labels | Branch |
|---|------|--------------|------|--------|--------|
| 005 | [issue-005](issue-005-setup-frontend-application.md) | `[FEATURE] Setup Frontend Application` | Feature | `feature`, `frontend`, `priority: high` | `feature/005-setup-frontend-application` |
| 006 | [issue-006](issue-006-setup-backend-application.md) | `[FEATURE] Setup Backend Application` | Feature | `feature`, `backend`, `priority: high` | `feature/006-setup-backend-application` |
| 007 | [issue-007](issue-007-configure-database-layer.md) | `[FEATURE] Configure Database Layer` | Feature | `feature`, `database`, `priority: high` | `feature/007-configure-database-layer` |
| 008 | [issue-008](issue-008-setup-docker-environment.md) | `[TASK] Setup Docker Environment` | Task | `task`, `backend`, `priority: medium` | `feature/008-setup-docker-environment` |
| 009 | [issue-009](issue-009-configure-ci-pipeline.md) | `[TASK] Configure CI Pipeline` | Task | `task`, `ci`, `priority: high` | `feature/009-configure-ci-pipeline` |

All five issues take **Milestone:** `Sprint 01 - Application Foundation`.

---

# Dependency Order

```text
005 Frontend            006 Backend

                            ↓

                        007 Database

        └───────────┬───────────┘

                    ↓

            008 Docker Environment

                    ↓

            009 CI Pipeline
```

Issues 005 and 006 are independent and can run in parallel. Issue 007 requires 006. Issues 008
and 009 require all three.

---

# Scope Coverage Note

The sprint specification lists eight scope areas but defines only five issues. Three areas have
no dedicated issue and are folded into the issues above rather than renumbered, so that issue
numbers 001-104 stay stable across the programme:

| Sprint spec section | Covered by |
|---------------------|------------|
| § 4 Frontend and Backend Communication | Issue 006 (health endpoint) and Issue 005 (API client) |
| § 5 Project Configuration (`.env`) | Issues 005 and 006 |
| § 7 Code Quality Setup (ESLint, Prettier) | Issues 005 and 006 |

---

# Sprint Definition of Done

- [ ] Frontend application works.
- [ ] Backend application works.
- [ ] Database connection works.
- [ ] API communication works.
- [ ] Docker environment works.
- [ ] CI pipeline passes.
- [ ] Tests created.
- [ ] Documentation updated.
- [ ] Pull Requests reviewed.
- [ ] Release v0.2.0 published.

---

# Release Notes Draft

```markdown
# v0.2.0

Application Foundation Release

## Added

- Frontend application
- Backend API
- Database connection
- Docker environment
- CI pipeline
- Development standards
```
