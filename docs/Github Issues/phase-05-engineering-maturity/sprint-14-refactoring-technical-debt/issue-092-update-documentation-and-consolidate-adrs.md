# [DOCS] Update Documentation and Consolidate ADRs

<!-- GitHub title: [DOCS] Update Documentation and Consolidate ADRs
     Labels: documentation, docs, priority: medium
     Milestone: Sprint 14 - Refactoring & Technical Debt Reduction
     Branch: docs/092-update-documentation-and-consolidate-adrs
     Epic: Refactoring & Technical Debt Reduction
     Depends on: 089, 090, 091
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [ ] Task
- [ ] Improvement
- [x] Documentation

## Priority:

- [ ] Low
- [x] Medium
- [ ] High
- [ ] Critical

## Module: docs
## Sprint: Sprint 14 - Refactoring & Technical Debt Reduction

---

## Summary

Audit every document against the system as it now exists after Issues 089-091, bring the ERD and
API documentation current, consolidate every ADR into an index with superseded decisions marked,
and verify the local setup guide by actually following it on a clean machine.

## Background

Thirteen sprints of feature work, plus this sprint's own refactoring, have moved faster than the
documentation describing them. This is the closing issue of Sprint 14 specifically because it needs
Issues 089 and 090's changes to already exist — documenting a domain layer or component library
before it's built would just need rewriting.

Two categories of documentation drift are worth calling out because they compound silently:

- **The ERD hasn't tracked every entity** added since it was last touched — Sprint 09's read models
  (Issue 057), Sprint 10's workflow entities (Issue 063), and this sprint's own refactoring may have
  introduced or removed tables the diagram doesn't reflect.
- **ADRs accumulate without ever being marked obsolete.** Issue 069's threat model, Issue 077's
  caching strategy, and Issue 089's own domain-layer extraction should each have produced a
  decision record — but if an earlier ADR's decision was later reversed (for instance, an approach
  Issue 089 replaced), the old ADR should say so, not sit unmarked next to its replacement looking
  equally current.

The setup guide gets the strongest verification standard in this issue — **followed on a clean
machine**, not read and judged plausible — because that is the one document whose failure mode is
immediately obvious to whoever hits it, and the one most likely to have quietly drifted since
Issue 008 first wrote it.

## User Story

As a New Contributor,
I want documentation that matches the system as it actually exists today,
So that I can set up, understand the architecture, and find API details without asking someone who was there when it was built.

## Acceptance Criteria

```gherkin
Given the ERD
When it is compared against the current Prisma schema
Then every entity and relationship matches, including everything added since Sprint 09
```

```gherkin
Given the API documentation
When it is checked against the actual current endpoints
Then every endpoint's path, parameters, and response shape are accurately documented
```

```gherkin
Given the full set of ADRs written since Issue 003 created the templates folder
When they are reviewed
Then each has a status, and any decision later reversed is explicitly marked superseded with a link to its replacement
```

```gherkin
Given the local setup guide
When followed exactly, step by step, on a machine with nothing pre-configured
Then the developer reaches a running application without needing undocumented knowledge
```

- [ ] Full documentation audit completed against the system as it exists after Issues 089-091
- [ ] ERD updated to include every entity through Sprint 14, including read models and workflow entities
- [ ] API documentation current for every endpoint, including response shape changes from Issue 078
- [ ] Architecture documentation updated to reflect the shared domain layer (Issue 089) and shared component system (Issue 090)
- [ ] Every ADR since Issue 003 reviewed and given a current status
- [ ] Superseded ADRs explicitly marked, with a link to whatever replaced the decision, never deleted
- [ ] An ADR index created listing every decision, its status, and its date
- [ ] Documentation with claims that cannot be verified against the current system removed rather than left misleading
- [ ] Setup guide followed literally on a clean environment and corrected wherever it failed
- [ ] Documentation index published pointing to every category (business, technical, operational)

## Expected Result

Documentation matches the system that actually exists after this sprint's refactoring, ADRs show
which decisions are current and which were superseded and why, and the setup guide has been proven
to work by someone actually following it rather than assumed correct.

---

## Scope

### Included

- Full documentation audit against post-refactor reality
- ERD and API documentation currency
- Architecture documentation update reflecting Issues 089-090
- ADR review, status marking, and index creation
- Removal of unverifiable documentation
- Setup guide verification by execution
- Documentation index

### Out of Scope

- Writing new architecture from scratch (this issue updates existing documentation, it does not author net-new design)
- User-facing manuals (a Sprint 16 concern, Issue 101)
- Operational runbooks beyond what already exists from Sprint 13 (Issue 102 in Sprint 16 handles the final technical documentation pass)

## Technical Requirements

**Audit process**

```text
For each document under docs/ and academy/:
    1. Read it against the current codebase
    2. Every claim: still true?
    3. If verifiable and true → keep, correct minor drift
    4. If verifiable and false → correct
    5. If unverifiable → remove rather than leave as an unconfirmed claim
```

**ERD update**

```text
docs/Architecture/ (ERD document)

Confirm every entity from every sprint is represented, specifically checking
for gaps introduced by:
    Issue 057   read model entities (Sprint 09)
    Issue 063   WorkflowDefinition, WorkflowStep, WorkflowInstance, WorkflowTask (Sprint 10)
    Issue 089   any schema change from the shared domain layer extraction (if any —
                this refactor is behavior-preserving, so schema changes should be
                minimal, but confirm)
```

**API documentation**

```text
docs/API/

Cross-check against Issue 078's response shape changes (trimmed list payloads,
standardized pagination envelope) specifically, since that issue changed the
shape of many existing endpoints without necessarily updating every doc reference
```

**ADR consolidation**

```text
docs/ADR/

1. List every ADR written since Issue 003 set up the templates
2. For each: is the decision still in effect?
3. If a later decision reversed it (check specifically whether Issue 089's
   domain-layer extraction or Issue 077's caching strategy superseded anything
   earlier), mark it:

   Status: Superseded by ADR-0XX
   (link to the replacement, decision and reasoning preserved, never deleted)

4. Build docs/ADR/README.md as an index: number, title, status, date
```

**Setup guide verification**

```text
Provision a genuinely clean environment (mirroring Issue 084's "not staging,
truly clean" principle for its restore drill)

Follow the setup guide exactly as written, with no undocumented shortcuts
or prior knowledge

Every point where the guide is wrong, ambiguous, or assumes unstated
knowledge → fix it, right there, based on what was actually needed
```

**Documentation index**

```text
A single entry point (e.g. docs/README.md, if not already serving this role)
linking to: BRD, SRS, Architecture, ERD, API docs, ADR index, Release Notes,
User Manuals (once Sprint 16 populates them), and the setup guide
```

## Dependencies

- Issue 089 — the domain layer this issue's architecture documentation now describes.
- Issue 090 — the component system this issue's frontend documentation now describes.
- Issue 091 — confirms the codebase this documentation describes is in its final Sprint 14 state.

## Definition of Done

- [ ] Content accurate and complete against the current system
- [ ] ERD current, including every entity through Sprint 14
- [ ] API documentation current, including Issue 078's response shape changes
- [ ] Architecture documentation reflects Issues 089 and 090
- [ ] Every ADR has a current status; superseded ones link to their replacement
- [ ] ADR index created
- [ ] Unverifiable claims removed
- [ ] Setup guide verified by literal execution on a clean environment and corrected where needed
- [ ] Documentation index published
- [ ] Links resolve correctly
- [ ] Renders correctly on GitHub
- [ ] Code review completed
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-14-refactoring-technical-debt.md` § 6 |
| Epic | Refactoring & Technical Debt Reduction |
| Documents | Issue 089, Issue 090 |
| Verifies claims consistent with | Issue 091 |
| Extended in | Issue 102 (Sprint 16, final technical documentation pass) |
| Pull Request | _to be linked_ |
