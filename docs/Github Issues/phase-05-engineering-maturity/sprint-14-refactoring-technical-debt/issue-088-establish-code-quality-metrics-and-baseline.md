# [TASK] Establish Code Quality Metrics and Baseline

<!-- GitHub title: [TASK] Establish Code Quality Metrics and Baseline
     Labels: task, ci, technical-debt, priority: high
     Milestone: Sprint 14 - Refactoring & Technical Debt Reduction
     Branch: feature/088-establish-code-quality-metrics-and-baseline
     Epic: Refactoring & Technical Debt Reduction
     Depends on: 074
     Blocks: 089, 090
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [x] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [x] High
- [ ] Critical

## Module: ci
## Sprint: Sprint 14 - Refactoring & Technical Debt Reduction

---

## Summary

Add code quality analysis to the pipeline, measure duplication, complexity, file size, and test
coverage, record the current baseline, and gate CI so those figures cannot silently regress.

## Background

Issue 087's register was built by manual review — reasonable for a one-time pass, but not something
to repeat every sprint by eye. This issue replaces "does this feel cleaner?" with a number that
Issues 089 and 090 can be measured against directly, and that every sprint after this one inherits
as a standing check.

The measurement that matters most for this sprint specifically is **duplication percentage** —
it's the metric that will move most visibly once Issue 089 extracts the shared domain layer and
Issue 090 extracts the shared component library, and it's the number that proves those refactors
actually reduced debt rather than just moving it.

The gate is deliberately a **regression** gate, not a **perfection** gate: it blocks a Pull Request
that makes duplication or complexity worse, but it does not demand every existing file meet an
aspirational standard on day one. That distinction is what keeps the gate usable rather than
something the team routes around.

## User Story

As an Engineering Lead,
I want objective code quality metrics running in CI with a regression gate,
So that "is this better than before?" has a number behind it, for this sprint and every one after.

## Acceptance Criteria

```gherkin
Given the CI pipeline
When a Pull Request is opened
Then code quality metrics are calculated and reported alongside the existing test and security results
```

```gherkin
Given the current baseline
When a Pull Request would measurably increase duplication or complexity beyond the agreed threshold
Then CI fails
```

```gherkin
Given the baseline measured at the start of this sprint
When Issues 089 and 090 complete
Then the same metrics show a measurable improvement, recorded against the original baseline
```

```gherkin
Given test coverage is measured
When the measurement runs
Then it excludes generated and configuration files and reports coverage on business logic specifically
```

- [ ] Code quality analysis tooling integrated into the CI pipeline (extending Issues 009 and 074's pipeline)
- [ ] Duplication percentage measured across the codebase
- [ ] Cyclomatic complexity measured per function/method
- [ ] File and function length measured
- [ ] Test coverage measured on business logic, excluding generated/configuration files
- [ ] Lint violation count tracked as a metric, not only a pass/fail gate
- [ ] Baseline recorded and committed before Issues 089/090 begin
- [ ] CI gate configured to fail on metric regression relative to the baseline
- [ ] Thresholds documented and agreed, distinguishing "must not regress" from "aspirational target"
- [ ] Baseline re-measured and compared at the end of the sprint, after Issues 089 and 090 land

## Expected Result

Every Pull Request from this point forward reports objective quality metrics, a regression is
caught automatically, and this sprint's refactoring work has a before/after number proving it
worked.

---

## Scope

### Included

- Code quality analysis integration in CI
- Duplication, complexity, file/function length, and coverage measurement
- Baseline recording
- Regression gate
- Threshold documentation
- End-of-sprint re-measurement

### Out of Scope

- Fixing any measured issue (Issues 089, 090, 091)
- Enforcing an absolute quality bar on existing, unchanged code (a regression gate only, not a rewrite mandate)
- Code review process changes (Issue 006, `academy/01-software-engineering/6-code-review.md`)

## Technical Requirements

**Metrics**

| Metric | Purpose | Measured how |
|--------|---------|---------------|
| Duplication percentage | Finds copy-paste debt (the Issue 087 named patterns) | Static analysis tool scan |
| Cyclomatic complexity | Finds hard-to-test logic | Per-function complexity score |
| File and function length | Finds units doing too much | Line count thresholds |
| Test coverage (business logic) | Finds unprotected code | Coverage tool, scoped to `src/`, excluding config/generated |
| Lint violation count | Finds convention drift | Existing ESLint/Prettier setup from Issue 005/006 |

**Pipeline integration**

```text
Extends .github/workflows/ci.yml (Issue 009), alongside the security job (Issue 074):

quality:
    - run duplication scan
    - run complexity analysis
    - run coverage report
    - compare against committed baseline
    - fail if any tracked metric regresses beyond its threshold
```

**Baseline recording**

```text
docs/Architecture/code-quality-baseline.md

- Metric values at the start of Sprint 14, before any refactoring
- Agreed regression thresholds per metric
- (Updated at sprint end) post-refactor values, showing the delta
```

**Regression rule, not perfection rule**

```text
A Pull Request fails if it makes a tracked metric measurably worse
    (e.g. duplication percentage increases, a new function exceeds the
    complexity threshold)

A Pull Request does not fail merely because some other, untouched part
    of the codebase is already above an aspirational target — that
    existing debt is Issue 087's register's job to track and schedule,
    not this gate's job to block on
```

**Coverage scoping**

```text
Included:    backend/src/modules/**/*.service.ts, *.controller.ts, and equivalent
             business logic; frontend feature and hook code

Excluded:    generated Prisma client code, configuration files, type
             definition files, migration files
```

## Dependencies

- Issue 074 — the CI pipeline structure this issue's quality job extends alongside the existing
  security gate.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Quality analysis running in CI on every Pull Request
- [ ] Baseline recorded and committed before Issues 089/090 begin
- [ ] Regression gate verified by intentionally introducing a duplication increase and confirming CI fails
- [ ] Thresholds documented and agreed
- [ ] Coverage scoping verified to exclude generated/configuration files
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-14-refactoring-technical-debt.md` § 2 |
| Epic | Refactoring & Technical Debt Reduction |
| Extends | Issue 009 (CI pipeline), Issue 074 (security gates) |
| Measures the effect of | Issue 089, Issue 090 |
| Pull Request | _to be linked_ |
