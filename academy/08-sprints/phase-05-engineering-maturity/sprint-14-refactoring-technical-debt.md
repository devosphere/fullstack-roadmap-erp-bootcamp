# Sprint 14 - Refactoring & Technical Debt Reduction

**Sprint:** Sprint 14  
**Phase:** Phase 05 - Engineering Maturity  
**Duration:** 3-4 Weeks  
**Release Target:** v1.1.0  
**Status:** Planned

---

# Sprint Goal

Reduce the technical debt accumulated across thirteen sprints by building a debt register, establishing objective code quality metrics, consolidating duplicated backend and frontend code, stabilizing the test suite, and bringing documentation back into line with the system.

At the end of this sprint, the codebase should be measurably cleaner without any change in behaviour.

---

# Sprint Context

Thirteen sprints of delivery leave predictable residue:

```text
Sprint 02   Auth module written first, before conventions settled
Sprint 04   Employee logic partly duplicated from Sprint 03
Sprint 06   Sales document logic
Sprint 07   Purchasing document logic — nearly identical
Sprint 08   Finance posting written under schedule pressure
Sprint 09   Reporting queries duplicated per module
Sprint 11   Security fixes applied endpoint by endpoint
Sprint 12   Performance fixes applied query by query
```

None of this was wrong at the time. Each decision was correct for the sprint it was made in. Debt is the accumulated cost of decisions that were locally right and globally inconsistent.

Sprint 14 pays it down deliberately.

---

# Business Outcome

After completing this sprint, the ERP platform will have:

- A visible, prioritized technical debt register.
- Objective code quality measurements.
- A shared backend domain layer replacing duplicated logic.
- A consolidated frontend component system.
- A stable test suite with no flaky tests.
- Documentation and ADRs matching the current system.

---

# Sprint Objectives

By the end of this sprint, learners should understand:

- What technical debt is and how it accumulates.
- How to quantify debt rather than complain about it.
- How to prioritize debt against feature work.
- How to refactor without changing behaviour.
- Code quality metrics and their limits.
- Test suite health and flakiness.
- Why documentation drift is itself technical debt.

---

# Sprint Theme

## "Refactoring Changes Structure, Never Behaviour"

The single rule of this sprint:

```text
If the tests need to change, it is not a refactor.
```

A refactor and a behaviour change may both be necessary, but they must never be in the same commit. When something breaks after a mixed commit, nobody can tell which half caused it.

---

# Business Capability

## Engineering Maintainability

This sprint delivers:

- Debt visibility.
- Quality measurement.
- Code consolidation.
- Test reliability.
- Documentation accuracy.

---

# Domain Concepts

---

# Technical Debt

The future cost created by a present shortcut.

Categories:

| Type | Description | Example |
|------|-------------|---------|
| Deliberate | Knowingly taken to meet a deadline | Hard-coded approval routing in Sprint 07 |
| Accidental | Created by inexperience or drift | Three different pagination shapes |
| Structural | Architecture no longer fits the system | Reporting queries inside feature modules |
| Documentation | Docs no longer describe the system | ERD missing Sprint 10 entities |
| Test | Tests that do not protect | Flaky or assertion-free tests |

---

# Debt Register

A tracked list of debt items, each with a cost and an impact.

Each entry records:

```text
Description
Category
Location
Impact          (what it slows down or breaks)
Effort          (cost to fix)
Priority
Owner
```

Debt that is not written down does not get fixed.

---

# Code Duplication

The same logic implemented more than once.

```text
Sales Order        → validate lines, calculate totals, transition status

Purchase Order     → validate lines, calculate totals, transition status

Two implementations, two sets of bugs
```

---

# Cyclomatic Complexity

A count of independent paths through a function.

```text
Low complexity     → easy to test, easy to reason about

High complexity    → many branches, hard to cover, likely to hide defects
```

---

# Flaky Test

A test that passes and fails without the code changing.

A flaky test is worse than no test: it trains the team to ignore failures.

---

# Boy Scout Rule

Leave the code cleaner than you found it.

This sprint is the deliberate version of that habit, applied at scale.

---

# Sprint Scope

---

# 1. Technical Debt Inventory and Prioritization

## Objective

Make debt visible before deciding what to fix.

## Tasks

- Review every module for debt.
- Record each item in a debt register.
- Categorize and locate each item.
- Estimate impact and effort.
- Prioritize by impact against effort.
- Select the sprint's scope from the top of the list.
- Convert deferred items into backlog issues.

## Business Rules

- Every debt item names a concrete location, not a general complaint.
- Impact is described in terms of what it slows down or risks.
- Items not fixed this sprint remain in the register with an owner.
- The register is a living document, updated every sprint from here on.

## Acceptance Criteria

- Debt register created and committed.
- Every module reviewed.
- Items categorized, located, and estimated.
- Priority order agreed.
- Sprint scope selected from the register.
- Deferred items raised as backlog issues.

---

# 2. Code Quality Metrics and Baseline

## Objective

Replace opinion with measurement.

## Tasks

- Add code quality analysis to the pipeline.
- Measure duplication, complexity, file size, and coverage.
- Record the baseline.
- Agree target thresholds.
- Add a CI gate that fails on regression.

## Metrics

| Metric | Purpose |
|--------|---------|
| Duplication percentage | Finds copy-paste debt |
| Cyclomatic complexity | Finds hard-to-test logic |
| File and function length | Finds units doing too much |
| Test coverage on business logic | Finds unprotected code |
| Lint violations | Finds convention drift |

## Business Rules

- Metrics inform decisions; they are not targets to game.
- Coverage is measured on business logic, not on generated or configuration files.
- The gate blocks regression rather than demanding perfection.

## Acceptance Criteria

- Quality analysis running in CI.
- Baseline recorded and committed.
- Thresholds agreed and documented.
- CI fails on metric regression.

---

# 3. Backend Refactoring

## Objective

Extract shared logic and restore structural consistency.

## Tasks

- Extract a shared domain layer for common business document behaviour.
- Consolidate duplicated validation, totalling, and status transition logic.
- Standardize error handling and response shapes.
- Standardize pagination across all endpoints.
- Move reporting queries fully into the reporting module.
- Remove dead code and unused dependencies.

## Refactoring Targets

```text
Sales Order + Purchase Order + Quotation + Requisition

                        ↓

        Shared: line validation, totalling, status machine

Sales Invoice + Supplier Invoice

                        ↓

        Shared: document numbering, due date calculation
```

## Business Rules

- Behaviour must not change; existing tests must pass unmodified.
- Refactoring commits contain no feature or bug fixes.
- Each refactor is a separate, reviewable pull request.
- Public API contracts remain unchanged.

## Acceptance Criteria

- Shared domain layer extracted.
- Duplicated logic consolidated.
- Error handling and pagination standardized.
- Reporting queries moved out of feature modules.
- Dead code and unused dependencies removed.
- All existing tests pass without modification.
- Duplication metric improved against the baseline.

---

# 4. Frontend Refactoring

## Objective

Consolidate the component layer and remove duplicated feature code.

## Tasks

- Inventory components and identify duplicates.
- Extract a shared component library.
- Standardize form handling and validation patterns.
- Standardize data table, filter, and pagination components.
- Standardize loading, empty, and error states.
- Remove unused components and dependencies.

## Refactoring Targets

```text
Employee List + Product List + Customer List + Supplier List

                        ↓

              Shared DataTable component

Every create and edit form

                        ↓

              Shared Form primitives and validation
```

## Business Rules

- Visual behaviour must not change without explicit design approval.
- Component consolidation is verified by visual regression or manual review.
- Shared components are documented with their props and usage.

## Acceptance Criteria

- Shared component library extracted and documented.
- Duplicate components removed.
- Form, table, and state patterns standardized.
- Unused components and dependencies removed.
- No visual regressions.
- Bundle size not increased.

---

# 5. Test Suite Improvement

## Objective

Make the test suite trustworthy.

## Tasks

- Measure current coverage on business logic.
- Identify and fix flaky tests.
- Remove tests that assert nothing.
- Add tests for uncovered critical paths.
- Reduce total suite runtime.
- Separate fast unit tests from slower integration tests.

## Business Rules

- A flaky test is fixed or deleted, never retried into passing.
- Every fixed flaky test records its root cause.
- Critical financial and authorization paths require coverage.
- Suite runtime must stay within the agreed budget so developers keep running it.

## Acceptance Criteria

- Coverage measured and improved on business logic.
- Zero flaky tests remain.
- Assertion-free tests removed or fixed.
- Critical paths covered.
- Suite runtime within budget.
- Unit and integration suites separated.

---

# 6. Documentation and ADR Cleanup

## Objective

Make the documentation describe the system that actually exists.

## Tasks

- Audit all documentation against the current implementation.
- Update the ERD with entities from Sprints 06-13.
- Update API documentation for all endpoints.
- Update architecture documentation.
- Consolidate ADRs into an index and mark superseded decisions.
- Verify the local setup guide by following it on a clean machine.

## Business Rules

- Documentation that cannot be verified is removed, not left to mislead.
- Superseded ADRs are marked, never deleted; the decision history has value.
- The setup guide is validated by execution, not by reading.

## Acceptance Criteria

- Documentation audit completed.
- ERD current and complete.
- API documentation current for every endpoint.
- Architecture documentation current.
- ADR index created and superseded decisions marked.
- Setup guide verified on a clean environment.

---

# Refactoring Log

Each refactor records:

| Field | Example |
|-------|---------|
| Target | Sales and Purchase order totalling |
| Debt type | Accidental duplication |
| Change | Extracted `DocumentTotalsService` into the shared domain layer |
| Behaviour change | None |
| Tests modified | None |
| Duplication before | 14.2% |
| Duplication after | 9.6% |

---

# Database Changes

## Cleanup

```text
Unused tables and columns removed
Missing foreign key constraints added
Inconsistent column naming corrected
Migration history documented
```

No new business entities are introduced in this sprint.

Any destructive schema change requires a reviewed migration, a backup, and a rollback path.

---

# GitHub Execution

---

# Epic

## Epic: Refactoring & Technical Debt Reduction

Purpose:

Reduce the accumulated cost of thirteen sprints of delivery without changing what the system does.

---

# GitHub Issues

---

# Issue 087 - Create Technical Debt Register

Type:

```
Documentation
```

Acceptance Criteria:

- Every module reviewed for debt.
- Items categorized, located, and estimated.
- Register committed and prioritized.
- Deferred items raised as backlog issues.

---

# Issue 088 - Establish Code Quality Metrics and Baseline

Type:

```
Task
```

Acceptance Criteria:

- Quality analysis running in CI.
- Baseline recorded and committed.
- Thresholds agreed and documented.
- CI fails on metric regression.

---

# Issue 089 - Refactor Backend Shared Domain Layer

Type:

```
Improvement
```

Acceptance Criteria:

- Shared domain layer extracted.
- Duplicated document logic consolidated.
- Error handling and pagination standardized.
- All existing tests pass unmodified.
- Duplication improved against the baseline.

---

# Issue 090 - Refactor Frontend Component System

Type:

```
Improvement
```

Acceptance Criteria:

- Shared component library extracted and documented.
- Duplicate components removed.
- Form, table, and state patterns standardized.
- No visual regressions.
- Bundle size not increased.

---

# Issue 091 - Improve Test Suite Coverage and Stability

Type:

```
Improvement
```

Acceptance Criteria:

- Coverage improved on business logic.
- Zero flaky tests remain.
- Assertion-free tests removed or fixed.
- Suite runtime within budget.
- Unit and integration suites separated.

---

# Issue 092 - Update Documentation and Consolidate ADRs

Type:

```
Documentation
```

Acceptance Criteria:

- Documentation audit completed.
- ERD and API documentation current.
- Architecture documentation current.
- ADR index created with superseded decisions marked.
- Setup guide verified on a clean environment.

---

# Development Workflow

Every refactor follows:

```text
GitHub Issue

        ↓

Confirm Test Suite Is Green

        ↓

Feature Branch

        ↓

Refactor (no behaviour change)

        ↓

Confirm Tests Pass Unmodified

        ↓

Record Metric Before and After

        ↓

Pull Request

        ↓

Code Review

        ↓

Merge

        ↓

Release
```

If a test must change, the change is split into a separate, clearly labelled pull request.

---

# Testing Requirements

## Regression Testing

The primary test of this sprint.

Validate:

- The full suite passes before and after every refactor.
- No test assertions were weakened to make a refactor pass.
- API contracts unchanged.

---

## Unit Testing

Required:

- New shared domain services fully covered.
- Extracted components covered.
- Previously uncovered critical paths covered.

---

## Integration Testing

Test:

- Every module still works through its API after consolidation.
- Standardized error and pagination shapes applied consistently.

---

## Visual Regression Testing

Validate:

- Consolidated frontend components render identically to the originals.

---

# Documentation Deliverables

## Business Documentation

- Technical debt register.
- Continuous improvement notes for future sprints.

---

## Technical Documentation

- Code quality baseline and report.
- Refactoring log with before and after metrics.
- Updated ERD.
- Updated API documentation.
- Updated architecture documentation.
- ADR index with superseded decisions marked.
- Shared component library documentation.

---

# Sprint Deliverables

## Engineering

Completed:

- Debt register created and prioritized.
- Quality metrics in CI with a regression gate.
- Backend shared domain layer.
- Frontend shared component library.
- Stable, faster test suite.

---

## Documentation

Completed:

- All documentation verified against the implementation.
- ADRs consolidated and indexed.

---

# Sprint Review

The learner demonstrates:

1. Walk through the technical debt register.
2. Show the code quality baseline and current metrics.
3. Show a backend duplication removed, with tests unmodified.
4. Show the shared component library in use.
5. Show a previously flaky test and its root cause fix.
6. Show the updated ERD and API documentation.
7. Show the CI gate failing on an intentional metric regression.

---

# Sprint Retrospective

## Discussion Topics

- Which debt proved most expensive and why it accumulated.
- Whether it could have been avoided at the time.
- The cost of refactoring late versus continuously.
- Whether the quality gate helps or obstructs.
- How to prevent the same drift in future work.

---

# Release

**Version:** `v1.1.0`

---

# Release Notes

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

---

# Definition of Done

Sprint 14 is complete when:

- [ ] Technical debt register created and prioritized.
- [ ] Code quality metrics running in CI.
- [ ] Baseline recorded and thresholds agreed.
- [ ] Backend shared domain layer extracted.
- [ ] Frontend component library extracted.
- [ ] Duplication reduced against the baseline.
- [ ] Zero flaky tests remain.
- [ ] Test suite runtime within budget.
- [ ] All existing tests pass without modification.
- [ ] No behaviour changed.
- [ ] Documentation verified and current.
- [ ] ADR index created.
- [ ] Setup guide verified on a clean environment.
- [ ] Pull Requests approved.
- [ ] Release v1.1.0 published.

---

# Skills Acquired

After completing Sprint 14, learners will understand:

## Engineering Craft

- Identifying and quantifying technical debt.
- Prioritizing debt against feature work.
- Refactoring safely behind a test suite.
- Extracting shared abstractions from duplicated code.

---

## Quality Engineering

- Objective code quality measurement.
- Test suite health and flakiness diagnosis.
- Coverage that protects rather than reassures.

---

## Professional Practice

- Separating structural change from behavioural change.
- Maintaining documentation as part of the system.
- Leaving a codebase better than it was found.

---

# Next Sprint Preview

# Sprint 15 - Monitoring & Observability

Planned:

- Structured logging with correlation IDs.
- Application and business metrics.
- Distributed tracing.
- Health checks and uptime monitoring.
- Alerting and incident response.
- Observability dashboards and service level objectives.
