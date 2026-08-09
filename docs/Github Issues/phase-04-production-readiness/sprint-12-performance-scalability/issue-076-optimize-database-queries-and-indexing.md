# [IMPROVEMENT] Optimize Database Queries and Indexing

<!-- GitHub title: [IMPROVEMENT] Optimize Database Queries and Indexing
     Labels: improvement, database, performance, priority: critical
     Milestone: Sprint 12 - Performance & Scalability
     Branch: feature/076-optimize-database-queries-and-indexing
     Epic: Performance & Scalability
     Depends on: 075
     Blocks: 077
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
- [ ] High
- [x] Critical

## Module: database
## Sprint: Sprint 12 - Performance & Scalability

---

## Summary

Eliminate N+1 query patterns, add indexes justified by captured query plans, remove unused ones,
and tune connection pooling — fixing exactly the endpoints Issue 075 ranked as failing their budget.

## Background

Issue 075 produced a ranked list of endpoints that miss their performance budget. This issue works
that list, not a fresh search — every fix here traces back to a specific measured failure.

The most common cause, based on how the system was built module by module across twelve sprints, is
the N+1 pattern: fetch a list, then fetch a related record per row. Issue 052's ledger balance
query and every module dashboard from Issues 028 through 060 are natural candidates, since each was
built to answer its own module's questions correctly, not to minimize query count under load.

Every change in this issue follows one rule, restated from the sprint's overall principle: **no
optimization merges without a before-and-after measurement.** An index added without a captured
query plan justifying it is itself a future performance liability — it costs write throughput and
storage for a benefit nobody verified.

## User Story

As a Backend Developer,
I want every N+1 pattern eliminated and every index justified by a measured query plan,
So that the endpoints Issue 075 flagged actually meet their budgets, provably.

## Acceptance Criteria

```gherkin
Given an endpoint identified by Issue 075 as exhibiting an N+1 pattern
When its query count is measured before and after this issue's fix
Then the query count is reduced to a small, bounded number regardless of result set size
```

```gherkin
Given a newly added index
When its query plan is inspected
Then it shows an index scan replacing what was previously a sequential scan, on the query that justified adding it
```

```gherkin
Given the ten slowest endpoints identified in Issue 075
When they are re-measured after this issue's changes
Then each shows an improvement, recorded with its before and after figures
```

```gherkin
Given the connection pool configuration
When it is reviewed
Then pool size and timeout values are set deliberately and documented, not left at framework defaults
```

- [ ] Query plans captured for the ten slowest endpoints from the Issue 075 baseline
- [ ] N+1 patterns identified and eliminated via eager loading or a single joined query
- [ ] Query count assertions added as tests for previously N+1 endpoints, to catch regression
- [ ] Indexes added, each with its justifying query plan documented in the migration or Pull Request
- [ ] Unused and duplicate indexes identified and removed
- [ ] Write-heavy tables assessed for index overhead before any index is added to them
- [ ] Issue 052's ledger balance query specifically re-measured and optimized if it failed budget
- [ ] Every module dashboard's aggregation query (Issues 028, 035, 042, 049, 056, 060) specifically re-measured
- [ ] Connection pooling configured deliberately and documented
- [ ] Before-and-after measurements recorded in the Issue 075 baseline document for every change

## Expected Result

The endpoints Issue 075 flagged now meet their budgets, each improvement backed by a recorded
number, and query-count tests exist to catch a future regression back into the same N+1 patterns.

---

## Scope

### Included

- Query plan capture for the ranked failing endpoints
- N+1 elimination with regression-preventing test coverage
- Index additions, each justified by a query plan
- Unused index removal
- Connection pool tuning
- Re-measurement and documentation of every change

### Out of Scope

- Caching (Issue 077 — a different mechanism for a different class of cost)
- API-level pagination and payload changes (Issue 078)
- Read model materialization if the underlying database-level fix is insufficient (an escalation noted in Issue 057, out of this issue's scope)
- Schema redesign — this issue optimizes access patterns, not the data model

## Technical Requirements

**Process per flagged endpoint**

```text
1. Capture the current query plan and query count
2. Diagnose: N+1 pattern, missing index, or genuinely necessary heavy computation
3. Fix:
     N+1           → eager load the relation, or rewrite as a single joined query
     Missing index  → add it, capture the new plan showing an index scan
4. Re-measure: query count, p50/p95 response time
5. Record before/after in the Issue 075 baseline document
6. Add a regression test (query-count assertion or measured-latency assertion)
```

**Query count assertion pattern**

```text
Given a list of N sales orders, each with a customer

When the endpoint that lists orders with customer names is called

Then the number of database queries executed is constant (e.g. 1 or 2),
     not proportional to N
```

This is the test shape used across every module this issue touches — it is what prevents an N+1
pattern from silently returning once someone adds a new field to a response DTO later.

**Index justification requirement**

Every added index's Pull Request description or migration comment states:

```text
Query:        <the specific slow query>
Plan before:   Seq Scan on <table>, cost=...
Plan after:    Index Scan using <new index>, cost=...
Table size:    approximate row count at time of addition
Write impact:  assessed and accepted, or noted as a concern
```

**Priority targets, drawn from Issue 075's flagged list**

```text
Issue 052   General ledger balance:
                joins JournalEntryLine → JournalEntry, filtered by accountId and date range
                — verify Issue 052's (accountId, entryDate) index composition is sufficient
                  at production scale, not just present

Issues 028/035/042/049/056/060   Module dashboard aggregations:
                each was built with its own service in isolation;
                check each for N+1 patterns first, indexing second

Issue 024   Attendance queries at one-year scale:
                verify the (employeeId, attendanceDate) unique index (added in Issue 024
                for duplicate-prevention) also serves the range-query pattern used by
                team and report views efficiently
```

**Connection pooling**

```text
Document:
    - Pool size, chosen relative to expected concurrent request volume
    - Connection timeout and idle timeout
    - Behavior under pool exhaustion (queue vs. reject)
```

## Dependencies

- Issue 075 — the ranked list of endpoints this issue works from.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Query plans captured for the ten slowest baseline endpoints
- [ ] N+1 patterns eliminated and verified by query-count tests
- [ ] Every added index justified by a documented before/after query plan
- [ ] Unused indexes removed
- [ ] Connection pooling configured and documented
- [ ] All existing functional tests still pass — no behavior changed
- [ ] Before/after measurements recorded in the Issue 075 baseline document
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-04-production-readiness/sprint-12-performance-scalability.md` § 2 |
| Epic | Performance & Scalability |
| Works from | Issue 075 (ranked failures) |
| Specifically re-measures | Issue 052, Issues 028/035/042/049/056/060, Issue 024 |
| Pull Request | _to be linked_ |
