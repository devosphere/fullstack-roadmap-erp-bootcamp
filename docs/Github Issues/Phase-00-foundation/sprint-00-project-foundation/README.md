# Sprint 00 - Project Foundation & Engineering Setup

**Milestone:** Sprint 00 - Project Foundation  
**Release:** v0.1.0  
**Phase:** Phase 00 - Foundation  
**Duration:** 1-2 Weeks  
**Sprint Spec:** `academy/08-sprints/phase-00-foundation/sprint-00-project-foundation.md`

---

# Milestone Definition

Create this milestone in GitHub before creating the issues.

| Field | Value |
|-------|-------|
| Title | `Sprint 00 - Project Foundation` |
| Due date | End of sprint |
| Description | Establish the engineering environment, development workflow, documentation structure, and collaboration practices. Release v0.1.0. |

---

# Sprint Goal

Establish the foundation of the ERP Bootcamp project by creating the engineering environment,
development workflow, documentation structure, and collaboration practices required for the
entire software development lifecycle.

---

# Epic

**[Project Foundation & Engineering Setup](epic-00-project-foundation.md)**

Create the epic **after** issues 001-004 exist, so the task list can reference their GitHub
numbers.

---

# Issue Roster

Copy each row's values into the GitHub issue fields.

| # | File | GitHub Title | Type | Labels | Branch |
|---|------|--------------|------|--------|--------|
| 001 | [issue-001](issue-001-initialize-repository-structure.md) | `[TASK] Initialize Repository Structure` | Task | `task`, `docs`, `priority: critical` | `feature/001-initialize-repository-structure` |
| 002 | [issue-002](issue-002-setup-git-workflow-documentation.md) | `[DOCS] Setup Git Workflow Documentation` | Documentation | `documentation`, `docs`, `priority: high` | `docs/002-setup-git-workflow-documentation` |
| 003 | [issue-003](issue-003-configure-github-templates.md) | `[TASK] Configure GitHub Templates` | Task | `task`, `ci`, `priority: high` | `feature/003-configure-github-templates` |
| 004 | [issue-004](issue-004-create-engineering-documentation.md) | `[DOCS] Create Engineering Documentation` | Documentation | `documentation`, `docs`, `priority: high` | `docs/004-create-engineering-documentation` |

All four issues take **Milestone:** `Sprint 00 - Project Foundation`.

---

# Dependency Order

```text
001 Initialize Repository Structure

        ↓

002 Git Workflow Documentation

        ↓

003 Configure GitHub Templates

        ↓

004 Create Engineering Documentation
```

Issue 001 must land first — every other issue adds files inside the structure it creates.

---

# Sprint Definition of Done

- [ ] Repository exists with the agreed folder structure.
- [ ] Git workflow documented.
- [ ] GitHub templates configured.
- [ ] Engineering documentation created.
- [ ] CI workflow runs successfully.
- [ ] Pull Request workflow used for every issue.
- [ ] Sprint Review completed.
- [ ] Sprint Retrospective completed.
- [ ] Release v0.1.0 published.

---

# Release Notes Draft

```markdown
# v0.1.0

Initial ERP Bootcamp Foundation Release

## Added

- Repository structure
- Engineering documentation
- Git workflow
- GitHub project setup
- Development standards
```
