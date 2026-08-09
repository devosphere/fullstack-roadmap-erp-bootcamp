# Phase 00 - Foundation

**Release Range:** v0.1.0 - v0.2.0  
**Sprints:** Sprint 00, Sprint 01  
**Issues:** 001 - 009  
**Phase Overview:** `academy/08-sprints/phase-00-foundation/phase-overview.md`

---

# Objective

Establish the engineering and technical foundation required to build the ERP platform, before
any business functionality is written.

---

# Milestones

| Milestone | Release | Issues | Epic |
|-----------|---------|--------|------|
| [Sprint 00 - Project Foundation](sprint-00-project-foundation/) | v0.1.0 | 001 - 004 | Project Foundation & Engineering Setup |
| [Sprint 01 - Application Foundation](sprint-01-application-foundation/) | v0.2.0 | 005 - 009 | Application Foundation |

---

# Issue Roster

| # | Title | Type | Module | Sprint |
|---|-------|------|--------|--------|
| 001 | Initialize Repository Structure | Task | docs | Sprint 00 |
| 002 | Setup Git Workflow Documentation | Documentation | docs | Sprint 00 |
| 003 | Configure GitHub Templates | Task | ci | Sprint 00 |
| 004 | Create Engineering Documentation | Documentation | docs | Sprint 00 |
| 005 | Setup Frontend Application | Feature | frontend | Sprint 01 |
| 006 | Setup Backend Application | Feature | backend | Sprint 01 |
| 007 | Configure Database Layer | Feature | database | Sprint 01 |
| 008 | Setup Docker Environment | Task | backend | Sprint 01 |
| 009 | Configure CI Pipeline | Task | ci | Sprint 01 |

---

# Dependency Order

```text
001 Repository Structure

        ↓

002 Git Workflow  →  003 GitHub Templates  →  004 Engineering Docs

        ↓

005 Frontend  ←→  006 Backend  →  007 Database

        ↓

008 Docker Environment

        ↓

009 CI Pipeline
```

Issues 005 and 006 can run in parallel. Issue 007 requires 006. Issues 008 and 009 require
both 005 and 006.

---

# Phase Exit Criteria

- [ ] All nine issues closed.
- [ ] Repository structure and documentation complete.
- [ ] Frontend, backend, and database running locally.
- [ ] Frontend can call the backend API.
- [ ] Docker environment starts the full stack.
- [ ] CI passes on Pull Requests.
- [ ] Releases v0.1.0 and v0.2.0 published.
