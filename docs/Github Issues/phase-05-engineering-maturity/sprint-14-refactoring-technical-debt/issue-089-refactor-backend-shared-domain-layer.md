# [IMPROVEMENT] Refactor Backend Shared Domain Layer

<!-- GitHub title: [IMPROVEMENT] Refactor Backend Shared Domain Layer
     Labels: improvement, backend, technical-debt, priority: high
     Milestone: Sprint 14 - Refactoring & Technical Debt Reduction
     Branch: feature/089-refactor-backend-shared-domain-layer
     Epic: Refactoring & Technical Debt Reduction
     Depends on: 087, 088
     Blocks: 091
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [ ] Task
- [x] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [x] High
- [ ] Critical

## Module: backend
## Sprint: Sprint 14 - Refactoring & Technical Debt Reduction

---

## Summary

Extract the multi-line document logic, numbering, and hierarchy patterns duplicated across four
sprints into a shared domain layer, standardize error handling and pagination, and move stray
reporting queries fully into the reporting module — with zero change in behavior, proven by the
existing test suite passing unmodified.

## Background

Four separate issues implemented essentially the same shape: a header record, a set of lines, a
calculated total, and a status machine.

```text
Issue 038  Sales Quotation      Issue 039  Sales Order
Issue 044  Purchase Requisition  Issue 046  Purchase Order
```

Each was correct when it was built and each was written without reference to the others, because
at the time, generalizing from one example would have been guessing. Now there are four, which is
enough to see the actual shared shape rather than impose an assumed one.

The same applies to two smaller patterns: **document numbering plus due-date calculation**
(Issues 041 and 048 each generate a sequence-based number and compute a due date from payment
terms) and **self-referencing hierarchy with cycle prevention** (Issues 017, 021, and 030 each
implement parent-child traversal and cycle detection independently).

The rule from the sprint's theme applies without exception here: **if a test needs to change, this
is not a refactor.** Every existing test for Issues 038, 039, 041, 044, 046, and 048 must pass
against the refactored code without modification.

## User Story

As a Backend Developer,
I want the duplicated document, numbering, and hierarchy logic consolidated into one place,
So that a bug fixed once is fixed everywhere it applies, instead of needing to be found and fixed four times.

## Acceptance Criteria

```gherkin
Given the full test suites for Issues 038, 039, 044, and 046
When they run against the refactored code
Then every test passes unmodified
```

```gherkin
Given the full test suites for Issues 041 and 048
When they run against the refactored numbering and due-date logic
Then every test passes unmodified
```

```gherkin
Given the full test suites for Issues 017, 021, and 030
When they run against the refactored hierarchy logic
Then every test passes unmodified, including cycle-detection cases
```

```gherkin
Given the duplication metric from Issue 088's baseline
When it is re-measured after this issue
Then it shows a measurable reduction
```

- [ ] Shared domain service extracted for multi-line document validation, line totalling, and status transitions
- [ ] Issues 038, 039, 044, and 046 refactored to use the shared service
- [ ] Shared numbering and due-date calculation service extracted
- [ ] Issues 041 and 048 refactored to use the shared numbering/due-date service
- [ ] Shared hierarchy traversal and cycle-prevention service extracted
- [ ] Issues 017, 021, and 030 refactored to use the shared hierarchy service
- [ ] Error handling standardized across all endpoints touched by this refactor
- [ ] Pagination standardized across all endpoints touched by this refactor, consistent with the standard already established
- [ ] Reporting queries still living inside feature modules moved fully into the Issue 057 reporting module
- [ ] Dead code and now-unused dependencies removed
- [ ] Public API contracts unchanged — no response shape, status code, or endpoint path altered
- [ ] Duplication metric measurably improved against the Issue 088 baseline

## Expected Result

Four sprints' worth of near-identical document logic, two implementations of numbering/due-date
calculation, and three implementations of hierarchy traversal now share one implementation each —
with every existing test still passing and no observable behavior change to any client of these
APIs.

---

## Scope

### Included

- Shared domain service for document validation/totalling/status
- Shared numbering and due-date calculation service
- Shared hierarchy traversal and cycle-prevention service
- Refactoring Issues 017, 021, 030, 038, 039, 041, 044, 046, 048 onto the shared services
- Error handling and pagination standardization on touched endpoints
- Reporting query relocation into Issue 057's module
- Dead code and dependency removal

### Out of Scope

- Any feature enhancement or bug fix — this issue changes structure only
- Frontend refactoring (Issue 090)
- Test suite improvements beyond what's needed to confirm zero behavior change (Issue 091)
- Extending the shared services to modules not yet built (future sprints, if any, inherit them for free)

## Technical Requirements

**Shared domain service — multi-line documents**

```text
backend/src/common/domain/document/
├── document-lines.service.ts    validation, line totalling
└── document-status.service.ts    generic status transition enforcement

Consolidates the near-identical logic currently duplicated in:
    sales/quotation.service.ts     (Issue 038)
    sales/order.service.ts          (Issue 039)
    procurement/requisition.service.ts   (Issue 044)
    procurement/order.service.ts    (Issue 046)
```

Each of the four keeps its own domain-specific rules (e.g. Issue 039's credit limit check, Issue
046's requisition-quantity ceiling) — only the genuinely shared mechanics (line total = quantity ×
price − discount; document total = sum of line totals; status transition validated against an
allowed-transitions map) move into the shared service.

**Shared numbering and due-date service**

```text
backend/src/common/domain/document-numbering.service.ts

Consolidates:
    sales/invoice.service.ts        (Issue 041 — INV-YYYY-NNNNN, due date from customer terms)
    procurement/invoice.service.ts   (Issue 048 — internal numbering, due date from supplier terms)
```

Both already used a sequence-or-locked-counter pattern independently; this extracts the shared
mechanism while leaving the entity-specific prefix (`INV-`, etc.) and terms source (customer vs.
supplier) as configuration.

**Shared hierarchy service**

```text
backend/src/common/domain/hierarchy.service.ts

Consolidates the cycle-prevention and traversal logic from:
    hr/department.service.ts         (Issue 017)
    hr/employee-hierarchy.service.ts  (Issue 021)
    inventory/product-category.service.ts  (Issue 030)
```

Genericized over the entity type and its self-referencing foreign key, since all three follow the
identical shape: validate no cycle across the full ancestor chain, traverse up or down, prevent
self-parenting.

**Refactoring discipline**

```text
1. Confirm the existing test suite for the target issue(s) is green
2. Extract the shared service with tests of its own
3. Refactor the target issue's service to delegate to the shared service
4. Run the target issue's original test suite — it must pass unmodified
5. Record the before/after duplication metric for that piece
6. Separate Pull Request per logical group (document logic / numbering / hierarchy),
   not one enormous change
```

**Reporting query relocation**

Any query written directly against transactional tables for reporting purposes, inside a feature
module, that duplicates or bypasses Issue 057's read model layer, moves fully into
`modules/reporting/`. This closes the gap Issue 057 itself flagged as a possible finding when it
was built.

## Dependencies

- Issue 087 — the debt register identifying and scoping exactly this consolidation.
- Issue 088 — the baseline this issue's improvement is measured against.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Shared services have their own unit tests
- [ ] **Regression discipline**: every existing test for Issues 017, 021, 030, 038, 039, 041, 044, 046, 048 passes unmodified
- [ ] No public API contract changed — verified by an integration test sample against each refactored endpoint
- [ ] Duplication metric improved against the Issue 088 baseline, recorded
- [ ] Dead code and unused dependencies removed
- [ ] Code review completed
- [ ] CI green, including the Issue 088 quality gate
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-14-refactoring-technical-debt.md` § 3 |
| Epic | Refactoring & Technical Debt Reduction |
| Consolidates | Issues 017, 021, 030, 038, 039, 041, 044, 046, 048 |
| Measured by | Issue 088 |
| Pull Request | _to be linked_ |
