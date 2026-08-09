# GitHub Issues

This folder holds the written form of every GitHub Issue in the ERP Bootcamp.

Each issue file is a **ready-to-paste GitHub issue body**. Nothing in a file needs to be
edited or deleted before it is pasted.

---

# Hierarchy

The academy roadmap defines the planning hierarchy:

```text
Phase → Sprint → Epic → User Story → GitHub Issue → Pull Request → Release
```

Mapped onto GitHub's actual objects:

| Planning concept | GitHub object | Where it lives here |
|------------------|---------------|---------------------|
| Phase | Project board / label group | A folder |
| **Sprint** | **Milestone** | A folder — the sprint *is* the milestone |
| Epic | Tracking Issue with a task list | `epic-XX-*.md` |
| User Story | A section inside the issue body | Inside the issue file |
| Issue | Issue | `issue-NNN-*.md` |
| Pull Request | Pull Request | Created from the issue's branch |
| Release | Git tag + GitHub Release | One per sprint |

Sprint and Milestone are the same level. There is no separate `milestone/` folder — that
would be a redundant tier.

---

# Folder Structure

```text
docs/Github Issues/

├── README.md                                   (this file)
│
├── phase-00-foundation/
│   ├── README.md                               (phase index)
│   ├── sprint-00-project-foundation/           (Milestone: v0.1.0)
│   │   ├── README.md                           (milestone definition + issue roster)
│   │   ├── epic-00-project-foundation.md
│   │   ├── issue-001-initialize-repository-structure.md
│   │   └── ...
│   └── sprint-01-application-foundation/       (Milestone: v0.2.0)
│
├── phase-01-core-platform/
├── phase-02-erp-business-modules/
├── phase-03-enterprise-capabilities/
├── phase-04-production-readiness/
└── phase-05-engineering-maturity/
```

---

# How to Create an Issue

1. Open the sprint folder's `README.md`.
2. Find the issue in the roster table. It gives the **title**, **labels**, **milestone**,
   and **branch name**.
3. Open the issue file.
4. Copy everything from `## Issue Type:` to the end of the file.
5. In GitHub: **New Issue** → paste the title → paste the body → set labels, milestone, and
   assignee from the roster table.

The HTML comment at the top of each file repeats the field values. It is invisible when
rendered, so pasting the whole file is harmless — but the clean copy starts at `## Issue Type:`.

---

# Issue Body Format

Every issue body follows `format/` in the repository root. The sections defined there appear
first, in that exact order:

```text
## Issue Type:          (checkbox block)
## Priority:            (checkbox block)
## Module:
## Sprint:
---
## Summary
## Background
## User Story           (Feature only)
## Steps to Reproduce   (Bug only)
## Acceptance Criteria
## Expected Result
```

Everything after the second `---` is an extension that the academy issue template
(`academy/07-templates/4-issue-template.md`) requires for traceability:

```text
## Scope                (Included / Out of Scope)
## Technical Requirements
## Dependencies
## Definition of Done
## Related Links
```

The extensions make the issue self-sufficient. You should not need to open the academy sprint
document to start work.

---

# Issue Types

| Type | Used For |
|------|----------|
| Feature | New user-facing or business capability |
| Bug | A defect in existing behaviour |
| Task | Engineering or infrastructure work with no direct user-facing change |
| Improvement | Refactoring, hardening, or optimizing existing behaviour |
| Documentation | Written deliverables |

These are the five types in `format/`. Sprint documents occasionally used informal types such
as "DevOps" or "Testing"; those map to **Task**.

---

# Labels

Create these once in the repository, under **Issues → Labels**.

## Type

```text
feature
bug
task
improvement
documentation
```

## Priority

```text
priority: low
priority: medium
priority: high
priority: critical
```

## Module

Matches the Conventional Commit scopes defined in `AGENTS.md`:

```text
auth
hr
inventory
sales
procurement
finance
frontend
backend
database
ci
docs
```

## Cross-Cutting

```text
security
testing
performance
technical-debt
observability
epic
```

---

# Milestones

Create one milestone per sprint. The milestone title carries its release version so the
release and the sprint are never confused.

| Milestone | Release | Issues |
|-----------|---------|--------|
| Sprint 00 - Project Foundation | v0.1.0 | 001 - 004 |
| Sprint 01 - Application Foundation | v0.2.0 | 005 - 009 |
| Sprint 02 - Identity & Access Management | v0.3.0 | 010 - 015 |
| Sprint 03 - Organization & Employee Management | v0.4.0 | 016 - 021 |
| Sprint 04 - Human Resource Management | v0.5.0 | 022 - 028 |
| Sprint 05 - Inventory Management | v0.6.0 | 029 - 035 |
| Sprint 06 - Sales Management | v0.7.0 | 036 - 042 |
| Sprint 07 - Purchasing Management | v0.8.0 | 043 - 049 |
| Sprint 08 - Finance & Accounting | v0.9.0 | 050 - 056 |
| Sprint 09 - Reporting & Analytics | v0.10.0 | 057 - 062 |
| Sprint 10 - Workflow & Notification Engine | v0.11.0 | 063 - 068 |
| Sprint 11 - Security Hardening | v0.12.0 | 069 - 074 |
| Sprint 12 - Performance & Scalability | v0.13.0 | 075 - 080 |
| Sprint 13 - Production Release | v1.0.0 | 081 - 086 |
| Sprint 14 - Refactoring & Technical Debt Reduction | v1.1.0 | 087 - 092 |
| Sprint 15 - Monitoring & Observability | v1.2.0 | 093 - 098 |
| Sprint 16 - Final Capstone Release | v2.0.0 | 099 - 104 |

**Total: 17 milestones, 17 epics, 104 issues.**

---

# Issue Numbering

Issue numbers 001-104 are assigned by the academy sprint documents. They are the traceability
key between a sprint, a branch, a Pull Request, and a release.

Rules:

- Numbers are allocated once and never reused.
- The number in this folder is the **planning number**, written into the branch name.
- GitHub assigns its own sequential issue number when the issue is created. If you create the
  issues in order starting from a clean repository, the two numbers match.
- New work discovered later takes the next free number after 104.

---

# Branch Naming

Every issue produces one branch, named from its planning number:

```text
feature/<issue-number>-description
bugfix/<issue-number>-description
hotfix/<issue-number>-description
docs/<issue-number>-description
```

Example:

```text
feature/005-setup-frontend-application
```

The branch prefix follows the issue type:

| Issue Type | Branch Prefix |
|------------|---------------|
| Feature | `feature/` |
| Improvement | `feature/` |
| Task | `feature/` |
| Bug | `bugfix/` |
| Documentation | `docs/` |

---

# Epics

Each sprint has one epic. An epic is a GitHub Issue labelled `epic` that tracks its children
with a task list:

```markdown
- [ ] #5 Setup Frontend Application
- [ ] #6 Setup Backend Application
```

GitHub renders that list as a progress bar. Create the epic **after** its child issues so the
issue numbers exist to reference.

Epics are not worked on directly and have no branch.

---

# Workflow

```text
GitHub Issue

        ↓

Feature Branch

        ↓

Development

        ↓

Conventional Commits

        ↓

Pull Request (closes the issue)

        ↓

Code Review

        ↓

CI Green

        ↓

Squash Merge to development

        ↓

Release
```

Rules from `AGENTS.md`:

- Never commit directly to `main` or `development`.
- One issue → one branch → one Pull Request.
- Squash-merge feature and bugfix branches.
- A Pull Request must close its issue with `Closes #<number>`.

---

# Source of Truth

| Question | Document |
|----------|----------|
| Why does this sprint exist? What is the domain? | `academy/08-sprints/` sprint document |
| What exactly do I build, and when is it done? | The issue file in this folder |
| How do I build it? | `academy/04-development/` |
| How do I branch, commit, review, and merge? | `academy/01-software-engineering/` |
| What does the issue body look like? | `format/` |

When a sprint document and an issue file disagree, the sprint document wins and the issue is
corrected.
