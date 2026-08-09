# [DOCS] Create Technical Debt Register

<!-- GitHub title: [DOCS] Create Technical Debt Register
     Labels: documentation, docs, technical-debt, priority: high
     Milestone: Sprint 14 - Refactoring & Technical Debt Reduction
     Branch: docs/087-create-technical-debt-register
     Epic: Refactoring & Technical Debt Reduction
     Blocks: 088, 089, 090
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [ ] Task
- [ ] Improvement
- [x] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [x] High
- [ ] Critical

## Module: docs
## Sprint: Sprint 14 - Refactoring & Technical Debt Reduction

---

## Summary

Review every module for accumulated debt, record each item with a concrete location and estimated
impact, prioritize the list, and select this sprint's scope from the top of it.

## Background

Ten feature sprints and two hardening sprints have each made individually reasonable decisions
under their own deadline. None of them left time to also fix what a later sprint would find
awkward — that is normal, and it is what this issue exists to catch up on.

The discipline that matters: **a debt item names a concrete location, not a general complaint.**
"The dashboards feel inconsistent" is not an entry; "HR, inventory, sales, procurement, and finance
each implement their own aggregation service (Issues 028, 035, 042, 049, 056, 060) with near-
identical structure" is. The second version can be prioritized, estimated, and assigned; the first
cannot.

This register is also where the debt that was **deliberately** taken on gets closed out or
explicitly re-flagged — Sprint 04's and Sprint 07's hard-coded approvals were already migrated in
Sprint 10 (Issue 068), but Issue 025's leave approval was explicitly left un-migrated as a noted
follow-up. This is where that follow-up either gets scheduled or consciously deferred again with a
reason.

## User Story

As an Engineering Lead,
I want a prioritized, concrete debt register,
So that this sprint's refactoring work targets the highest-impact problems instead of whichever ones happen to be top of mind.

## Acceptance Criteria

```gherkin
Given every module built through Sprint 13
When it is reviewed for debt
Then any finding is recorded with a specific file or module location, not a general description
```

```gherkin
Given the debt register
When items are prioritized
Then each carries an estimated impact and effort, and the list is ordered by impact against effort
```

```gherkin
Given the sprint's available capacity
When scope is selected
Then it comes from the top of the prioritized register, and everything not selected remains as a tracked backlog issue
```

```gherkin
Given Issue 025's leave approval, previously left un-migrated when Issue 068 migrated requisition approval
When the register is built
Then it is explicitly represented, either scheduled for this sprint or deferred again with a stated reason
```

- [ ] Every module reviewed for debt: identity, HR, organization, inventory, sales, procurement, finance, reporting, workflow
- [ ] Each item recorded with category, concrete location, impact, and effort estimate
- [ ] Named duplication explicitly captured: document logic (Issues 038, 039, 044, 046), numbering/due-date calculation (Issues 041, 048), hierarchy/cycle-prevention (Issues 017, 021, 030), dashboard aggregation (Issues 028, 035, 042, 049, 056, 060)
- [ ] Issue 025's un-migrated leave approval explicitly addressed in the register
- [ ] Items prioritized by impact against effort
- [ ] This sprint's scope selected and reflected in Issues 089, 090, 091
- [ ] Deferred items filed as backlog issues with an owner
- [ ] Register committed and structured for ongoing maintenance, not treated as a one-time artifact

## Expected Result

A committed, prioritized register exists naming exactly where debt lives across the system. This
sprint's refactoring issues (089, 090) work from it directly, and everything not addressed now has
a visible home rather than disappearing.

---

## Scope

### Included

- Debt review across every module
- Categorization, location, impact, and effort estimation per item
- Explicit capture of the named duplication patterns above
- Prioritization
- Scope selection for this sprint
- Backlog issue creation for deferred items

### Out of Scope

- Fixing any debt item (Issues 089, 090, 091)
- Establishing the code quality metrics that will make debt measurable going forward (Issue 088 — complementary, not the same artifact)

## Technical Requirements

**Register structure**

```text
docs/Architecture/technical-debt-register.md

Per item:
    Description
    Category:    Deliberate | Accidental | Structural | Documentation | Test
    Location:    specific file(s), module, or issue numbers
    Impact:      what it slows down or risks
    Effort:      rough sizing
    Priority:    derived from impact vs. effort
    Owner:       (once scheduled)
    Status:      Open | Scheduled (Sprint 14) | Backlog | Accepted
```

**Categories, with the definitions established when this sprint was planned**

```text
Deliberate       Knowingly taken to meet a deadline
                 Example: Issue 025's leave approval, left un-migrated when Issue 068
                 generalized approval routing

Accidental        Created by inexperience or drift across sprints
                  Example: five near-identical dashboard aggregation services

Structural         Architecture that no longer fits
                    Example: reporting logic partially still living inside feature
                    modules despite Sprint 09's read model architecture

Documentation       Docs no longer describing the system
                     Example: any ERD section not updated since a later sprint
                     changed the schema

Test                 Tests that do not protect
                      Example: flaky or assertion-weak tests — the specific inventory
                      for this category happens in Issue 091, this register only flags
                      that the category exists
```

**Review method**

```text
For each module:
    1. Read the module's issues from earlier sprints for any "Out of Scope" or
       "deliberate debt" notes already left behind (several issues across the
       programme flagged their own future debt explicitly)
    2. Check for duplication against sibling modules built to a similar shape
    3. Check code quality signals (this can run before Issue 088's formal
       tooling — a manual pass is enough to seed the register)
    4. Record findings
```

**Prioritization**

```text
Priority = f(Impact, Effort)

High impact, low effort    → do first
High impact, high effort    → schedule deliberately, likely this sprint's
                                headline items (Issues 089, 090)
Low impact, any effort       → backlog
```

## Dependencies

None — this is the starting issue for Sprint 14.

## Definition of Done

- [ ] Every module reviewed
- [ ] Register committed with concrete, located items
- [ ] Named duplications and Issue 025's deferred migration explicitly represented
- [ ] Items prioritized
- [ ] Sprint scope selected and communicated to Issues 089, 090, 091
- [ ] Deferred items filed as backlog issues
- [ ] Content accurate and complete
- [ ] Links resolve correctly
- [ ] Renders correctly on GitHub
- [ ] Code review completed
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-14-refactoring-technical-debt.md` § 1 |
| Epic | Refactoring & Technical Debt Reduction |
| Deferred debt referenced | Issue 025, resolved for requisitions by Issue 068 |
| Drives | Issues 089, 090, 091 |
| Pull Request | _to be linked_ |
