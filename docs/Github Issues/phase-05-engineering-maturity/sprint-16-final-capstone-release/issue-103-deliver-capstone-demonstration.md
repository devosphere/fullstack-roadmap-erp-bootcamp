# [TASK] Deliver Capstone Demonstration

<!-- GitHub title: [TASK] Deliver Capstone Demonstration
     Labels: task, docs, priority: high
     Milestone: Sprint 16 - Final Capstone Release
     Branch: feature/103-deliver-capstone-demonstration
     Epic: Final Capstone Release
     Depends on: 101, 102
     Blocks: 104
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

## Module: docs
## Sprint: Sprint 16 - Final Capstone Release

---

## Summary

Present the completed ERP platform to a stakeholder audience: the business problem it solves, a
live demonstration of one full business scenario, the architecture and engineering process behind
it, the quality evidence accumulated across sixteen sprints, and how it's operated in production —
then assemble the portfolio artifacts that make the work reviewable afterward.

## Background

Sixteen sprints of correct, individually-tested work has produced a system nobody outside the
programme has actually seen work, end to end, presented as a coherent whole. This issue is where
that changes — the moment the work stops being a sequence of merged Pull Requests and becomes
something demonstrated and defended in front of an audience.

The demonstration is deliberately **live against production**, not a recorded video or a staged
local environment — because Sprint 13 built a real production system specifically so that claims
about it could be verified in real time rather than taken on faith. Running the demo against
anything less would undercut the entire premise of Phase 04.

**Technical decisions must be defended, not only described.** A presentation that walks through
what was built without being able to explain *why* — why Sprint 08's ledger is derived from
transactions rather than stored as a mutable balance, why Sprint 10 generalized the approval pattern
only after seeing two concrete implementations — has not actually demonstrated understanding, only
familiarity.

## User Story

As the Programme's Engineer,
I want to present the completed system live, defend its design, and leave behind a reviewable portfolio,
So that the work stands on its own evidence rather than requiring someone to trust a summary of it.

## Acceptance Criteria

```gherkin
Given the capstone presentation
When it is delivered
Then it covers the business problem, solution overview, live demonstration, architecture, engineering process, quality evidence, operations, and lessons learned
```

```gherkin
Given the live demonstration segment
When it is performed
Then it runs against the actual production environment, not a recording or a local copy
```

```gherkin
Given a technical decision raised during the presentation
When a question is asked about why it was made that way
Then the presenter can explain the reasoning and trade-off, not just restate what was built
```

```gherkin
Given the portfolio artifacts
When assembled
Then they are accessible and organized well enough for someone to review the work independently afterward
```

- [ ] Presentation structured across all eight required segments
- [ ] Live demonstration rehearsed and performed against the actual production environment (Issue 081/086)
- [ ] Architecture explanation covers frontend, backend, database, workers, and the observability layer (Sprint 15)
- [ ] Engineering process explanation covers Issues → branches → Pull Requests → review → CI → releases, referencing the actual workflow used throughout
- [ ] Quality evidence presented: test results, security posture (Sprint 11), performance results (Sprint 12), SLO attainment (Issue 098)
- [ ] Operations explanation covers deployment, rollback, backup/recovery, and monitoring/incident response (Sprints 13, 15)
- [ ] Lessons learned segment prepared honestly, not only favorably
- [ ] Questions from the audience answered, including defending specific technical decisions
- [ ] Portfolio artifacts assembled: repository history, all 17 releases, sprint documents, this Github Issues folder, architecture docs, quality reports, dashboards
- [ ] Portfolio accessible and organized for independent review

## Expected Result

Stakeholders see the system work live, understand why it was built the way it was, and can review
the complete body of evidence — code, documentation, releases, and quality reports — independently
after the presentation ends.

---

## Scope

### Included

- Presentation preparation across all eight segments
- Live production demonstration
- Defense of technical decisions under questioning
- Portfolio assembly and organization

### Out of Scope

- Building any new feature or fix specifically for the demonstration (the system presented is the
  one Issues 099-102 already validated and documented, not a specially prepared version)
- External marketing materials
- Recording/video production beyond what's naturally captured, if anything

## Technical Requirements

**Demonstration structure**

```text
1. Business Problem
     What an ERP solves and for whom — grounded in the domain concepts
     established across every sprint (Sprint 02's "who are you, what can
     you access", Sprint 06-07's order-to-cash and procure-to-pay, etc.)

2. Solution Overview
     Modules delivered and the business value each provides

3. Live Demonstration
     One complete business scenario end to end — reuse Issue 099's
     Order to Cash scenario, since it is already documented, rehearsed,
     and verified to work correctly

4. Architecture
     Frontend, backend, database, workers, telemetry (Sprint 15) —
     drawing on Issue 102's current architecture documentation

5. Engineering Process
     Issues, branches, Pull Requests, reviews, CI, releases — the actual
     workflow followed throughout, not an idealized description of it

6. Quality Evidence
     Tests (Issue 091), security findings (Issue 074), performance
     results (Issue 080), SLOs (Issue 098)

7. Operations
     Deployment (Issue 083), rollback, backup/recovery (Issue 084),
     monitoring and incident response (Issue 097)

8. Lessons Learned
     What was hard, what changed along the way, what would be done
     differently — prepared honestly as input to Issue 104's retrospective
```

**Live demonstration requirements**

```text
Runs against: the actual production environment (Issue 081, deployed via Issue 086)

Not: a recorded video, a local development instance, or a staged
     environment presented as if it were production

Rehearsed beforehand against the real environment to confirm the
scenario executes cleanly and within a reasonable time for a live audience
```

**Defending decisions — prepare answers for likely questions**

```text
Why is the general ledger balance derived from transactions rather
    than stored as a mutable figure? (Issue 052 — auditability)

Why was approval routing hard-coded twice (Issues 025, 045) before
    being generalized (Issue 063)? (deliberate — the right abstraction
    needed two real examples first)

Why does inventory reservation exist separately from on-hand quantity?
    (Issue 032 — committed vs. available stock)

Why is the reporting layer built on separate read models rather than
    querying transactional tables directly? (Issue 057 — workload separation)
```

**Portfolio artifacts**

```text
Repository with full commit and Pull Request history
17 releases, v0.1.0 through v2.0.0
16 sprint documents (academy/08-sprints/)
This complete docs/Github Issues/ folder — 104 issues, 17 epics, all readable
Architecture documentation, ERD, ADR index (Issue 102)
Test, security, and performance reports (Issues 074, 080)
Observability dashboards and SLO evidence (Issue 098)
User manuals (Issue 101)
```

## Dependencies

- Issue 101 — the user documentation referenced during the demonstration.
- Issue 102 — the technical documentation the architecture segment draws from.

## Definition of Done

- [ ] Presentation prepared covering all eight segments
- [ ] Live demonstration rehearsed against production and performed successfully
- [ ] Architecture, process, quality, and operations segments delivered accurately
- [ ] Lessons learned prepared honestly
- [ ] Audience questions answered, including defense of specific decisions
- [ ] Portfolio artifacts assembled and verified accessible
- [ ] Pull Request squash-merged into `development` (for any presentation materials committed to the repository)

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-16-final-capstone-release.md` § 4 |
| Epic | Final Capstone Release |
| Demonstration scenario from | Issue 099 |
| Draws on | Issue 101, Issue 102 |
| Feeds | Issue 104 (retrospective) |
| Pull Request | _to be linked_ |
