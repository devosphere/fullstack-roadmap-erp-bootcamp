# [IMPROVEMENT] Improve Test Suite Coverage and Stability

<!-- GitHub title: [IMPROVEMENT] Improve Test Suite Coverage and Stability
     Labels: improvement, ci, testing, priority: high
     Milestone: Sprint 14 - Refactoring & Technical Debt Reduction
     Branch: feature/091-improve-test-suite-coverage-and-stability
     Epic: Refactoring & Technical Debt Reduction
     Depends on: 089, 090
     Blocks: 092
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

## Module: ci
## Sprint: Sprint 14 - Refactoring & Technical Debt Reduction

---

## Summary

Find and fix every flaky test, remove tests that assert nothing, add coverage to critical paths
still missing it, and separate fast unit tests from slower integration tests — so the suite is
trusted enough that people actually run it.

## Background

Issues 089 and 090 just finished proving themselves against the existing suite: every refactor
passed unmodified, by design. That proof is only as good as the suite itself. If a test is flaky —
passes and fails without the code changing — a genuine regression can hide behind "oh, that one's
just flaky" the same way a real alert gets ignored once false alarms train people to dismiss it.

**A flaky test is fixed or deleted, never retried into passing.** Retrying a flaky test until it
goes green doesn't fix the flakiness, it just hides the symptom that would have told someone to fix
it. Every fix in this issue records its root cause — usually one of: a shared test database state
leaking between tests, a timing assumption that doesn't hold under load, or a test order
dependency.

The financial and authorization paths get named coverage priority specifically because Sprint 08's
double-entry posting (Issue 051) and Sprint 11's permission checks (Issue 071) are exactly the code
where an untested edge case has the highest cost if it's wrong.

## User Story

As an Engineering Lead,
I want a fast, stable test suite with critical paths covered,
So that a green build actually means the code is correct, and the suite runs often enough to catch problems early.

## Acceptance Criteria

```gherkin
Given the full test suite run ten times in a row
When the results are compared
Then every test passes or fails consistently — no test flips outcome without a code change
```

```gherkin
Given a test that asserts nothing meaningful (executes code but checks no outcome)
When the suite is reviewed
Then it is either given a real assertion or removed
```

```gherkin
Given the financial posting logic (Issue 051) and the permission enforcement logic (Issue 071)
When their coverage is measured
Then it meets the coverage bar defined for critical paths
```

```gherkin
Given the full suite
When it is run
Then its total runtime is within the agreed budget
```

- [ ] Current coverage on business logic measured (baseline from Issue 088)
- [ ] Every flaky test identified by running the suite repeatedly under varied conditions
- [ ] Each flaky test's root cause diagnosed and recorded
- [ ] Each flaky test fixed or, if it protects nothing real, deleted — never left retried-until-green
- [ ] Assertion-free or trivially-passing tests identified and either strengthened or removed
- [ ] Coverage added for Issue 051's posting balance validation and reversal logic
- [ ] Coverage added for Issue 071's permission enforcement across previously under-tested endpoints
- [ ] Coverage added for any other critical path flagged as thin by the Issue 088 baseline
- [ ] Unit and integration suites separated so fast tests can run independently of slower ones
- [ ] Total suite runtime measured and brought within the agreed budget
- [ ] Zero flaky tests remain, verified by repeated runs

## Expected Result

The test suite can be trusted: a failure means something real broke, a pass means the tests that
exist actually protect what they claim to, and running it is fast enough that people run it often.

---

## Scope

### Included

- Flaky test identification and root-cause fixing
- Assertion-free test cleanup
- Coverage additions for financial and authorization critical paths
- Unit/integration suite separation
- Suite runtime optimization
- Verification via repeated runs

### Out of Scope

- New feature testing (this issue improves existing coverage, not new functionality)
- End-to-end test infrastructure changes (Playwright setup itself, if it needs work, is a separate concern)
- Performance/load testing (Sprint 12, Issue 080 — a different kind of testing entirely)

## Technical Requirements

**Flaky test detection**

```text
Run the full suite multiple times (e.g. 10-20 runs) in CI or locally,
    ideally with randomized test order enabled if the test runner supports it

Any test with inconsistent results across runs is flaky by definition —
    not a judgment call, an observation
```

**Common root causes to check for, given how the suite grew across thirteen sprints**

```text
Shared database state leaking between tests
    (a test from Issue 019's employee suite affecting a later test's
    assumed starting state)

Timing assumptions
    (Issue 070's token expiry tests, Issue 062's schedule timing tests
    are natural candidates — anything asserting "immediately" or
    "within X ms" without proper synchronization)

Test order dependency
    (a test that only passes because an earlier test happened to run first
    and left behind state it silently relies on)
```

**Fix, not retry**

```text
Flaky test found

    ↓

Diagnose root cause (one of the above, or another)

    ↓

Does it protect something real?
    → yes: fix the root cause (isolate state, fix the timing assumption,
            remove the order dependency)
    → no: delete it — it was never actually protecting anything
```

Explicitly do not add retry-on-failure logic to the test runner as a substitute for this — that
hides the signal this issue exists to restore.

**Coverage priorities**

```text
Issue 051 — Journal Entry Posting:
    balance validation edge cases (single-cent imbalance, exactly zero lines,
    minimum two-line requirement), reversal correctness, closed-period rejection

Issue 071 — Authorization Review findings:
    the three-identity matrix (no token / wrong permission / correct permission)
    for any endpoint the Issue 071 inventory found under-tested at the time
```

**Suite separation**

```text
test/unit/          fast, no database, no network — run on every save during development
test/integration/    database-backed, slower — run in CI and before pushing

package.json scripts distinguish `test:unit` from `test:integration`,
    with a combined `test` script for CI
```

**Runtime budget**

Document the agreed figure (e.g. unit suite under 30 seconds, full suite under 5 minutes) and
verify the suite meets it after this issue's changes — separation alone often achieves most of the
improvement, since developers can run just the fast suite locally.

## Dependencies

- Issue 089 — the refactored backend code this issue's coverage work now applies to.
- Issue 090 — the refactored frontend code this issue's coverage work now applies to.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Suite run repeatedly (10-20 times) with zero flaky results
- [ ] Every previously flaky test's root cause documented in its fix's commit or Pull Request
- [ ] Assertion-free tests removed or strengthened
- [ ] Coverage on Issue 051's posting logic meets the critical-path bar
- [ ] Coverage on Issue 071's authorization logic meets the critical-path bar
- [ ] Unit and integration suites separated and independently runnable
- [ ] Suite runtime within the agreed budget, measured
- [ ] Code review completed
- [ ] CI green, including the Issue 088 quality gate
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-14-refactoring-technical-debt.md` § 5 |
| Epic | Refactoring & Technical Debt Reduction |
| Coverage priorities from | Issue 051, Issue 071 |
| Runs against | Issue 089, Issue 090's refactored code |
| Pull Request | _to be linked_ |
