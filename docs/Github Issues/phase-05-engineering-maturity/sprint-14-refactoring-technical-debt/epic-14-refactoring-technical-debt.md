# [EPIC] Refactoring & Technical Debt Reduction

<!-- GitHub title: [EPIC] Refactoring & Technical Debt Reduction
     Labels: epic, technical-debt
     Milestone: Sprint 14 - Refactoring & Technical Debt Reduction
     Branch: none — epics are not worked on directly
     Create this epic AFTER issues 087-092 exist, then replace the placeholder
     numbers in the task list below with the real GitHub issue numbers.
     Copy everything below this comment into the issue body. -->

## Module: backend
## Sprint: Sprint 14 - Refactoring & Technical Debt Reduction

---

## Purpose

Reduce the technical debt accumulated across thirteen sprints of delivery, measurably, without
changing what the system does.

```text
If the tests need to change, it is not a refactor.
```

## Business Value

Thirteen sprints of correct, individually-right decisions leave predictable residue: duplicated
document logic, inconsistent pagination, dashboards that will be replaced by Sprint 09's read
models but haven't been yet. This epic pays that down deliberately, before Sprint 15 instruments a
codebase that would otherwise multiply every duplication it touches.

## Issues

- [ ] #87 Create Technical Debt Register
- [ ] #88 Establish Code Quality Metrics and Baseline
- [ ] #89 Refactor Backend Shared Domain Layer
- [ ] #90 Refactor Frontend Component System
- [ ] #91 Improve Test Suite Coverage and Stability
- [ ] #92 Update Documentation and Consolidate ADRs

## Named Duplication to Consolidate

```text
Document validation/totalling/status machine   Issues 038, 039, 044, 046
Numbering + due date calculation                 Issues 041, 048
Self-referencing hierarchy + cycle prevention     Issues 017, 021, 030
Dashboard aggregation service                     Issues 028, 035, 042, 049, 056, 060
DataTable / Form / pagination patterns            Every list/form screen since Issue 011
```

## Epic Acceptance Criteria

- [ ] All child issues closed
- [ ] Debt register created and prioritized
- [ ] Code quality metrics gating CI regression
- [ ] Shared backend domain layer extracted with duplication measurably reduced
- [ ] Shared frontend component library extracted with no visual regression
- [ ] Zero flaky tests
- [ ] All existing tests pass unmodified — no behavior changed
- [ ] Documentation and ADRs current and indexed
- [ ] Release v1.1.0 published

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-14-refactoring-technical-debt.md` |
| Phase overview | `academy/08-sprints/phase-05-engineering-maturity/phase-overview.md` |
| Precedes | Sprint 15 (instrumenting duplicated code multiplies work) |
| Release | v1.1.0 |
