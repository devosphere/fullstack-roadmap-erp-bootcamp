# Sprint 14 - Refactoring & Technical Debt Reduction

**Milestone:** Sprint 14 - Refactoring & Technical Debt Reduction  
**Release:** v1.1.0  
**Phase:** Phase 05 - Engineering Maturity  
**Duration:** 3-4 Weeks  
**Sprint Spec:** `academy/08-sprints/phase-05-engineering-maturity/sprint-14-refactoring-technical-debt.md`

---

# Milestone Definition

| Field | Value |
|-------|-------|
| Title | `Sprint 14 - Refactoring & Technical Debt Reduction` |
| Due date | End of sprint |
| Description | Make the codebase measurably cleaner without changing behavior. Release v1.1.0. |

---

# Sprint Goal

Reduce the technical debt accumulated across thirteen sprints, measurably, without any change in
behavior — every refactor separate from every fix.

---

# Epic

**[Refactoring & Technical Debt Reduction](epic-14-refactoring-technical-debt.md)**

---

# Issue Roster

| # | File | GitHub Title | Type | Labels | Branch |
|---|------|--------------|------|--------|--------|
| 087 | [issue-087](issue-087-create-technical-debt-register.md) | `[DOCS] Create Technical Debt Register` | Documentation | `documentation`, `docs`, `technical-debt`, `priority: high` | `docs/087-create-technical-debt-register` |
| 088 | [issue-088](issue-088-establish-code-quality-metrics-and-baseline.md) | `[TASK] Establish Code Quality Metrics and Baseline` | Task | `task`, `ci`, `technical-debt`, `priority: high` | `feature/088-establish-code-quality-metrics-and-baseline` |
| 089 | [issue-089](issue-089-refactor-backend-shared-domain-layer.md) | `[IMPROVEMENT] Refactor Backend Shared Domain Layer` | Improvement | `improvement`, `backend`, `technical-debt`, `priority: high` | `feature/089-refactor-backend-shared-domain-layer` |
| 090 | [issue-090](issue-090-refactor-frontend-component-system.md) | `[IMPROVEMENT] Refactor Frontend Component System` | Improvement | `improvement`, `frontend`, `technical-debt`, `priority: high` | `feature/090-refactor-frontend-component-system` |
| 091 | [issue-091](issue-091-improve-test-suite-coverage-and-stability.md) | `[IMPROVEMENT] Improve Test Suite Coverage and Stability` | Improvement | `improvement`, `ci`, `testing`, `priority: high` | `feature/091-improve-test-suite-coverage-and-stability` |
| 092 | [issue-092](issue-092-update-documentation-and-consolidate-adrs.md) | `[DOCS] Update Documentation and Consolidate ADRs` | Documentation | `documentation`, `docs`, `priority: medium` | `docs/092-update-documentation-and-consolidate-adrs` |

All six issues take **Milestone:** `Sprint 14 - Refactoring & Technical Debt Reduction`.

---

# Dependency Order

```text
087 Debt Register

        ↓

088 Code Quality Metrics & Baseline

        ↓

089 Backend Shared Domain Layer      090 Frontend Component System

        └─────────────┬──────────────────┘

                       ↓

              091 Test Suite Improvement

                       ↓

              092 Documentation & ADR Cleanup
```

Issues 089 and 090 can run in parallel once the baseline exists — one refactors backend document
logic, the other frontend components.

---

# The One Rule of This Sprint

```text
If the tests need to change, it is not a refactor.
```

Every Pull Request in Issues 089-090 must pass the **existing** test suite unmodified. A refactor
and a behavior change are never in the same commit — if something needs both, split it.

---

# What Gets Consolidated

Named duplication accumulated across nine feature sprints, specifically flagged for this sprint
when it was created:

| Duplication | Instances |
|---|---|
| Multi-line document validation, totalling, status machine | Issue 038 (quotation), 039 (order), 044 (requisition), 046 (purchase order) |
| Document numbering + due date calculation | Issue 041 (sales invoice), 048 (supplier invoice) |
| Self-referencing hierarchy + cycle prevention | Issue 017 (department), 021 (reporting line), 030 (category) |
| Module dashboard aggregation service | Issues 028, 035, 042, 049, 056, 060 |
| DataTable / Form / pagination UI patterns | Every list and form screen since Issue 011 |

---

# Sprint Definition of Done

- [ ] Debt register created, prioritized, and this sprint's scope selected from it.
- [ ] Code quality metrics gating CI on regression.
- [ ] Shared backend domain layer extracted; duplication measurably reduced.
- [ ] Shared frontend component library extracted; no visual regression.
- [ ] Zero flaky tests; suite runtime within budget.
- [ ] All existing tests pass unmodified.
- [ ] Documentation and ADRs current, indexed, and verified by execution.
- [ ] Release v1.1.0 published.

---

# Release Notes Draft

```markdown
# v1.1.0

## Changed

- Backend business document logic consolidated into a shared domain layer
- Error handling and pagination standardized across all endpoints
- Frontend components consolidated into a shared library
- Reporting queries moved fully into the reporting module

## Fixed

- Flaky tests eliminated
- Missing foreign key constraints added

## Removed

- Dead code, unused components, and unused dependencies

## Documentation

- ERD, API, and architecture documentation brought current
- ADRs consolidated and indexed
- Technical debt register published

No functional behaviour was changed in this release.
```
