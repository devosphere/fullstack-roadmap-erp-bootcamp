# [TASK] Execute Full Regression and User Acceptance Testing

<!-- GitHub title: [TASK] Execute Full Regression and User Acceptance Testing
     Labels: task, ci, testing, priority: critical
     Milestone: Sprint 16 - Final Capstone Release
     Branch: feature/100-execute-full-regression-and-user-acceptance-testing
     Epic: Final Capstone Release
     Depends on: 099
     Blocks: 101, 102
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
- [ ] High
- [x] Critical

## Module: ci
## Sprint: Sprint 16 - Final Capstone Release

---

## Summary

Run the complete automated suite against the release candidate, manually regress anything without
automated coverage, prepare and execute UAT scripts from every sprint's acceptance criteria, and
obtain written sign-off with no critical or high defect left open.

## Background

Issue 099 proved the four core business processes work as connected wholes. This issue proves
nothing *else* has broken along the way, and that the system is accepted by the people who will
actually judge whether it does its job — not just by the engineers who built it.

The distinction that matters: **developer testing asks "does the code do what I built?"** — every
sprint's own test suite already answers that, repeatedly, and Issue 091 stabilized it. **Acceptance
testing asks "does the system do what the business needs?"** — a different question, answered by
walking through each sprint's original Definition of Done from a business perspective, on a
production-like environment with realistic data, not the thin seed data most feature development
happens against.

**No critical or high defect may remain open at release** — carried over from the discipline
established for the v1.0.0 release in Sprint 13 (Issue 085), applied here as the final gate before
v2.0.0.

## User Story

As a Quality Assurance Lead,
I want the complete system regressed and formally accepted by the business,
So that v2.0.0 ships with confidence that nothing broke along the way and that it does what stakeholders actually need.

## Acceptance Criteria

```gherkin
Given the complete automated test suite
When it is run against the release candidate
Then it passes in full
```

```gherkin
Given areas of the system without automated coverage
When they are manually regressed
Then each is checked against its original acceptance criteria from the sprint that built it
```

```gherkin
Given UAT scripts prepared from every sprint's Definition of Done
When they are executed by someone approaching the system from a business perspective
Then each is signed off or logs a specific defect
```

```gherkin
Given the full set of findings from this issue
When release readiness is assessed
Then no critical or high defect remains open
```

```gherkin
Given UAT sign-off
When it is recorded
Then it names who signed off and when, not left implicit
```

- [ ] Full automated test suite (post-Issue 091 stabilization) run against the release candidate and passing
- [ ] Manual regression completed for areas without automated coverage, checked against their original sprint's acceptance criteria
- [ ] UAT scripts prepared from the Definition of Done of every sprint, 00 through 15
- [ ] UAT executed on a production-like environment with realistic data, not thin seed data
- [ ] UAT executed by someone approaching the system as a business user, not as its builder
- [ ] All findings logged and triaged by severity
- [ ] No critical or high defect open at the conclusion of this issue
- [ ] Medium and low defects documented and scheduled as follow-up, not silently dropped
- [ ] UAT sign-off recorded with named approver and date

## Expected Result

The system is proven not to have regressed anywhere across sixteen sprints of change, and it has
been formally accepted by someone judging it from a business perspective rather than a developer's.

---

## Scope

### Included

- Full automated suite execution
- Manual regression of uncovered areas
- UAT script preparation from every sprint's Definition of Done
- UAT execution on production-like data
- Defect logging, triage, and resolution to a critical/high-free state
- Sign-off recording

### Out of Scope

- The four end-to-end scenarios themselves (Issue 099 — this issue's regression is broader but
  shallower; 099's is narrower but deeper)
- Fixing defects unrelated to acceptance criteria already established in earlier sprints
- Performance regression (already covered by Sprint 12; this issue is functional, not load-based)

## Technical Requirements

**Automated suite execution**

```text
Run the complete suite (unit + integration, separated per Issue 091's structure)
against the release candidate build — the same artifact that will be tagged
and deployed in Issue 104, not a separate branch
```

**Manual regression scope**

```text
For each module, identify what automated coverage (per Issue 088's baseline
and Issue 091's improvements) does NOT reach, and regress those areas manually
against the acceptance criteria from the issue that originally built the feature —
e.g. re-verify Issue 022's field-group permission behavior, Issue 040's partial
delivery edge cases, anything flagged as thin in Issue 091's coverage review
```

**UAT script preparation**

```text
For every sprint (00-15):
    Pull the sprint's stated Definition of Done and each issue's acceptance criteria
    Convert into a UAT script: a business-perspective walkthrough, not a
    technical test case

Example — from Issue 025 (Leave Management):
    "As an employee, submit a leave request and confirm it appears in my
    manager's approval queue; as the manager, approve it and confirm the
    employee's balance updates correctly."
```

**UAT execution conditions**

```text
Environment: production-like, with realistic data volume and shape
             (can reuse the Issue 075 seed data generator's output,
             or a comparable realistic dataset)

Executor: someone evaluating the system as a business user would —
          following the documented business process, not the
          implementation details
```

**Defect handling**

```text
Every finding logged with severity

Critical/High    → must be resolved before this issue closes
Medium/Low        → documented, filed as follow-up work, does not block

At the end of this issue: zero critical or high defects remain open
```

**Sign-off**

```text
docs/Sprint Reports/ (or equivalent)

UAT Sign-off Record
    - Scope covered
    - Findings summary
    - Approver name and role
    - Date
```

## Dependencies

- Issue 099 — the end-to-end scenario validation this issue's broader regression complements.

## Definition of Done

- [ ] Full automated suite passes against the release candidate
- [ ] Manual regression completed and documented
- [ ] UAT scripts prepared covering every sprint's Definition of Done
- [ ] UAT executed on production-like data by a business-perspective evaluator
- [ ] All findings triaged
- [ ] Zero critical or high defects open
- [ ] Medium/low defects filed as follow-up
- [ ] UAT sign-off recorded with approver and date
- [ ] Code review completed (for any fixes made)
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-16-final-capstone-release.md` § 2 |
| Epic | Final Capstone Release |
| Builds on | Issue 099 (scenario validation), Issue 091 (stabilized test suite) |
| Same discipline as | Issue 085 (Sprint 13's v1.0.0 gate) |
| Pull Request | _to be linked_ |
