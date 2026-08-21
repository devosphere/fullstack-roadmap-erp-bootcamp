# [IMPROVEMENT] Refactor Frontend Component System

<!-- GitHub title: [IMPROVEMENT] Refactor Frontend Component System
     Labels: improvement, frontend, technical-debt, priority: high
     Milestone: Sprint 14 - Refactoring & Technical Debt Reduction
     Branch: feature/090-refactor-frontend-component-system
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

## Module: frontend
## Sprint: Sprint 14 - Refactoring & Technical Debt Reduction

---

## Summary

Extract a shared component library from the duplicated list, table, and form patterns built once
per module since Issue 011, remove the resulting dead components, and confirm no visual regression
— with bundle size not increasing.

## Background

Every module built a list view, a create/edit form, and pagination controls independently, starting
with Issue 011's user management screen and repeated at least once per sprint since: employees,
products, customers, suppliers, sales orders, purchase requisitions. Each was reasonable to build
on its own — a second component only becomes obviously duplicative once a third and fourth exist to
compare it against.

By this point there are more than a dozen near-identical `DataTable` implementations and an equal
number of form scaffolds, each with its own small variations in loading state, empty state, and
error handling that were never deliberately different — they just drifted apart because nothing
forced them to stay aligned.

This issue is the frontend mirror of Issue 089: same discipline, same rule. **Visual behavior
change requires explicit design approval**, and the mechanism for catching an accidental change is
visual regression checking or, at minimum, careful manual review against the current rendered
output — not just "the code compiles."

## User Story

As a Frontend Developer,
I want one shared table, form, and pagination component used everywhere,
So that a UX fix or accessibility improvement applies across the whole application at once, instead of needing to be found and applied module by module.

## Acceptance Criteria

```gherkin
Given every list view built since Issue 011
When it is inspected after this refactor
Then it uses the shared DataTable component rather than a module-specific implementation
```

```gherkin
Given every create/edit form built across the programme
When it is inspected after this refactor
Then it uses shared form primitives and validation patterns
```

```gherkin
Given any screen touched by this refactor
When it is compared to its pre-refactor rendered output
Then there is no unintended visual difference
```

```gherkin
Given the application bundle
When its size is measured after this refactor
Then it has not increased, and duplication of component code has decreased
```

- [ ] Component inventory completed across every module, identifying duplicate list, table, form, and pagination implementations
- [ ] Shared `DataTable` component extracted, covering sorting, filtering, and the Issue 078 pagination standard
- [ ] Shared form primitives extracted, covering field layout, validation display, and submission state, built on the existing React Hook Form + Zod stack
- [ ] Shared loading, empty, and error state components extracted and applied consistently
- [ ] Every module's list view migrated to the shared `DataTable`
- [ ] Every module's create/edit form migrated to the shared form primitives
- [ ] Duplicate, now-unused components removed
- [ ] Unused dependencies removed
- [ ] Shared components documented with their props and usage examples
- [ ] No visual regression across any migrated screen, verified by visual comparison or automated visual regression tooling
- [ ] Bundle size not increased, measured before and after
- [ ] Duplication metric measurably improved against the Issue 088 baseline

## Expected Result

Every list and form in the application renders through one shared implementation. A future
accessibility fix, loading-state improvement, or pagination change is made once and applies
everywhere — with no visible difference to a user comparing before and after this issue.

---

## Scope

### Included

- Component inventory
- Shared DataTable, form primitives, and state components
- Migration of every module's list and form views
- Dead component and dependency removal
- Component documentation
- Visual regression verification
- Bundle size measurement

### Out of Scope

- Any new feature or visual redesign — this issue preserves existing behavior and appearance
- Backend refactoring (Issue 089)
- Design system documentation beyond component-level usage (a candidate for later, if the programme continues past Sprint 16)

## Technical Requirements

**Component inventory**

```text
List every list/table view since Issue 011:
    users, employees, departments, positions, products, categories, warehouses,
    customers, suppliers, sales orders, purchase requisitions, purchase orders,
    journal entries, and every other list-shaped screen

For each, note: current implementation, deviations from a "standard" shape,
    and whether those deviations are intentional (a genuine feature difference)
    or accidental drift
```

**Shared component structure**

```text
frontend/src/components/
├── data-table/
│   ├── data-table.tsx
│   ├── data-table-pagination.tsx    (implements the Issue 078 pagination standard)
│   ├── data-table-filters.tsx
│   └── data-table.stories.tsx        (or equivalent usage documentation)
├── form/
│   ├── form-field.tsx
│   ├── form-section.tsx
│   └── form-submit-bar.tsx
└── state/
    ├── loading-state.tsx
    ├── empty-state.tsx
    └── error-state.tsx
```

**Migration discipline**

```text
1. Confirm the target screen's current behavior via manual walkthrough (or existing
   component/E2E tests)
2. Migrate the screen to the shared component
3. Compare rendered output against step 1 — pixel-level differences beyond
   intentional consolidation (e.g. unifying two slightly different empty-state
   messages) require sign-off, not silent acceptance
4. Record any deliberate visual change explicitly in the Pull Request description,
   distinct from accidental change
```

**Genuine differences to preserve, not accidentally erase**

Some variation between modules is intentional, not drift, and must survive consolidation:

```text
- Issue 027's self-service portal restricts editable fields — the shared form
  primitive must support field-level read-only configuration, not assume every
  form is fully editable
- Issue 065's task inbox needs approve/reject actions distinct from a standard
  edit form's save/cancel — the shared primitives must accommodate custom
  action sets, not force every form into save/cancel
```

**Visual regression checking**

Use whatever tooling is practical at this stage of the programme — automated screenshot comparison
if available, otherwise a documented manual comparison pass against a checklist of the affected
screens. The requirement is that *some* systematic check happened, not a specific tool.

**Bundle size**

Measure using the same approach that will be formalized in Sprint 12's performance work (Issue 079)
if that issue has already established tooling; otherwise, a straightforward before/after build size
comparison is sufficient here.

## Dependencies

- Issue 087 — the debt register scoping this consolidation.
- Issue 088 — the baseline this issue's duplication reduction is measured against.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Component inventory completed and committed
- [ ] Shared components implemented and documented
- [ ] Every module's list and form views migrated
- [ ] Dead components and dependencies removed
- [ ] **No visual regression** verified across all migrated screens
- [ ] Genuine, intentional visual differences explicitly noted and approved, distinct from accidental drift being unified
- [ ] Bundle size not increased, measured and recorded
- [ ] Duplication metric improved against the Issue 088 baseline
- [ ] Code review completed
- [ ] CI green, including the Issue 088 quality gate
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-14-refactoring-technical-debt.md` § 4 |
| Epic | Refactoring & Technical Debt Reduction |
| Consolidates screens from | Issue 011 onward, across every module |
| Preserves special cases from | Issue 027, Issue 065 |
| Uses the pagination standard from | Issue 078 |
| Measured by | Issue 088 |
| Pull Request | _to be linked_ |
