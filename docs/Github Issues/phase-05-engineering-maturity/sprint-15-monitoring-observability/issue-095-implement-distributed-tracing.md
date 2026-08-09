# [FEATURE] Implement Distributed Tracing

<!-- GitHub title: [FEATURE] Implement Distributed Tracing
     Labels: feature, backend, observability, priority: high
     Milestone: Sprint 15 - Monitoring & Observability
     Branch: feature/095-implement-distributed-tracing
     Epic: Monitoring & Observability
     Depends on: 093
     Blocks: 096
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [x] Feature
- [ ] Bug
- [ ] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [x] High
- [ ] Critical

## Module: backend
## Sprint: Sprint 15 - Monitoring & Observability

---

## Summary

Add tracing spans across frontend, backend, database calls, cache calls, and background workers,
propagate trace context across every async boundary, sample intelligently, and cross-link every
trace to the logs sharing its correlation ID.

## Background

Issue 094's metrics can tell you the invoice API's p95 latency just crossed budget. They cannot
tell you *where in that request* the time actually went — was it the ledger balance query (Issue
052, flagged in Sprint 12 as a join worth watching), the cache lookup (Issue 077), or something
else entirely? That's what a trace shows: a tree of timed spans for one specific request.

The place this is hardest, again, is **async boundaries** — the same challenge Issue 093 faced with
correlation IDs, now applied to trace context specifically. A trace that stops at the edge of a
background job (Issue 062's scheduled reports, Issue 066's notification dispatch) tells you nothing
about what happened after the job picked up the work, which is often exactly where the interesting
latency lives.

Tracing every request in full detail is expensive at scale, which is why **sampling** matters: keep
every trace that ended in an error (that's precisely the data needed to diagnose the failure), and
sample a percentage of successful ones (enough to understand normal latency distribution without
paying to store everything).

## User Story

As a Backend Developer,
I want to see exactly where time is spent within a request, across every service it touches,
So that I can find the actual bottleneck instead of guessing which layer is slow.

## Acceptance Criteria

```gherkin
Given a request that touches the backend, a database query, and a cache lookup
When its trace is inspected
Then each of those operations appears as a distinct, timed span within the trace
```

```gherkin
Given a request that triggers a background job (Issue 062 or Issue 066)
When the trace is inspected
Then the background job's work appears as part of the same trace, not a separate, disconnected one
```

```gherkin
Given a request that resulted in an error
When traces are sampled
Then that trace is retained regardless of the sampling rate applied to successful requests
```

```gherkin
Given a trace
When its correlation ID is used to search logs
Then the corresponding log lines for the same request are found
```

- [ ] Backend tracing instrumentation implemented
- [ ] Frontend tracing instrumentation implemented for user-initiated requests
- [ ] Trace context propagated into background workers (Issue 062's scheduled reports, Issue 066's notification dispatch), continuing the same async-boundary work started in Issue 093
- [ ] Database calls (Prisma queries) instrumented as spans
- [ ] Cache calls (Issue 077) instrumented as spans
- [ ] Sampling configured: all error traces retained, a configured percentage of successful traces retained
- [ ] Span names kept stable and low-cardinality, following the same discipline as Issue 094's metric labels
- [ ] Traces cross-linked to logs via the Issue 093 correlation ID, findable in both directions
- [ ] Issue 052's ledger balance query specifically traced and its actual time cost visible in a real trace
- [ ] Tracing overhead measured and confirmed acceptable

## Expected Result

Any request can be inspected as a tree of timed spans, showing exactly where its time went across
every layer it touched — including background work triggered along the way — and every trace links
directly to the log lines from the same request.

---

## Scope

### Included

- Backend, frontend, database, and cache span instrumentation
- Trace context propagation into background workers
- Error-biased sampling strategy
- Log/trace cross-linking via correlation ID
- Overhead verification

### Out of Scope

- Metrics (Issue 094) and structured logging (Issue 093) — this issue builds on both, doesn't replace them
- Health checks (Issue 096)
- Trace-based alerting (Issue 097 uses metrics and logs primarily; trace-based alerting is a possible future extension, not required here)

## Technical Requirements

**Span structure — example**

```text
Trace: POST /api/sales/invoices          [2,400 ms]
  ├─ auth.verify                         [   12 ms]
  ├─ invoice.validate                    [   30 ms]
  ├─ ledger.balance.query                [1,900 ms]   ← flagged by Sprint 12, now visible directly
  └─ invoice.persist                     [  450 ms]
```

**Async boundary propagation** — the specific gap this issue closes, mirroring Issue 093's work

```text
Issue 062 scheduled report execution:
    the trace that started when the schedule fired must continue into the
    report generation and export steps as child spans, not restart as an
    unrelated trace

Issue 066 notification dispatch:
    the span tree for "task assigned → notification queued → notification
    delivered" should be connected, even though delivery happens later
    in a different process — carry the trace context alongside the
    correlationId already stored on the Notification row per Issue 093
```

**Sampling**

```text
Trace resulted in an error       → always retained
Trace completed successfully      → retained at a configured sampling rate
                                     (e.g. 10%, tunable based on volume and storage cost)
```

**Span naming**

```text
Stable, low-cardinality names: <module>.<operation>
    e.g. ledger.balance.query, invoice.persist, cache.get, ...

Not: names embedding a specific ID or dynamic value
    (matches the cardinality discipline from Issue 094)
```

**Cross-linking**

```text
Every span carries the Issue 093 correlationId as an attribute

    → from a trace, jump to its logs by correlationId
    → from a log line, jump to its trace by the same identifier
```

**Priority target**

Issue 052's ledger balance join was already flagged in Sprint 12 as worth watching under load;
this issue is where it becomes directly observable in production traffic, not just in a load test.

## Dependencies

- Issue 093 — the correlation ID and async-boundary propagation pattern this issue extends to trace
  context specifically.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Backend, frontend, database, and cache spans verified present in a sample trace
- [ ] **Async propagation test**: a trace started by a request continues correctly into a triggered background job (Issue 062 or Issue 066)
- [ ] Sampling verified: error traces always retained, successful traces sampled at the configured rate
- [ ] Cross-linking verified: a trace's correlation ID locates the matching log lines
- [ ] Overhead measured and confirmed acceptable
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-15-monitoring-observability.md` § 3 |
| Epic | Monitoring & Observability |
| Extends the propagation pattern from | Issue 093 |
| Traces | Issue 052 (flagged in Sprint 12), Issue 077 (cache calls) |
| Async boundaries from | Issue 062, Issue 066 |
| Pull Request | _to be linked_ |
