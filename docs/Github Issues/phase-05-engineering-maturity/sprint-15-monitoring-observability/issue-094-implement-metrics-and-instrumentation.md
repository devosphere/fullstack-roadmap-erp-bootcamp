# [FEATURE] Implement Metrics and Instrumentation

<!-- GitHub title: [FEATURE] Implement Metrics and Instrumentation
     Labels: feature, backend, observability, priority: high
     Milestone: Sprint 15 - Monitoring & Observability
     Branch: feature/094-implement-metrics-and-instrumentation
     Epic: Monitoring & Observability
     Depends on: 077, 093
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

Instrument technical and business metrics — request counts, latency, cache performance, job
success rates, and domain events like invoices posted or approvals pending — with labels chosen
carefully to keep cardinality bounded, and verify every business figure reconciles with the
database.

## Background

Issue 093 answers "what happened for this one request." Metrics answer a different question:
"how is the system behaving in aggregate, right now." Neither replaces the other — a metric shows
that error rate spiked at 14:22; a correlated log line shows exactly which request failed and why.

The single most common way a metrics system fails in practice is **cardinality** — a label that
takes on effectively unlimited distinct values, like a user ID or an invoice ID, multiplies the
number of stored time series until the metrics backend collapses under its own bookkeeping. This
issue is explicit about which labels are safe (`route`, `status`, `documentType`) and which are not
(`userId`, `invoiceId`), because getting this wrong is expensive to notice and fix later.

Business metrics get the same reconciliation discipline that Sprint 09's KPIs (Issue 059) already
established: every business metric this issue exposes must match what a direct query against the
same data would show. A metric that silently drifts from reality is worse than no metric — Issue
059 already proved this discipline is achievable across the finance and sales modules, and this
issue applies it at a different layer.

## User Story

As a Backend Developer,
I want technical and business metrics collected with bounded cardinality,
So that I can see the system's behavior in aggregate and trust that business figures match reality.

## Acceptance Criteria

```gherkin
Given a metrics endpoint
When it is scraped
Then it returns current values for both technical and business metrics
```

```gherkin
Given a metric labeled by route and status
When traffic occurs across many different resource IDs (e.g. many different invoice IDs)
Then the number of distinct label combinations remains bounded, not growing with the number of resources
```

```gherkin
Given the invoices_posted_total business metric
When compared against a direct count from the Issue 051 posted journal entries
Then the two values match
```

```gherkin
Given metrics collection is active
When request latency is measured with and without instrumentation
Then the added overhead is negligible relative to the request's own processing time
```

- [ ] Metrics endpoint implemented and exposed for collection
- [ ] Technical metrics instrumented: request count, request duration, database query duration, cache hit/miss (extending Issue 077's existing cache metrics), job execution count and result, job queue depth, active session count
- [ ] Business metrics instrumented: sales orders created, invoices posted, approvals pending by document type, failed logins, report executions, notification deliveries by channel and result
- [ ] Every label reviewed for cardinality risk; no label carries an unbounded value (user ID, document ID, free text)
- [ ] Business metric values verified to reconcile with a direct database query, for at least one metric per module
- [ ] Metric collection overhead measured and confirmed acceptable
- [ ] Metrics documented: what each one means and how it's calculated

## Expected Result

The system's aggregate behavior is visible and queryable, cardinality stays bounded regardless of
data volume, and every business figure this issue exposes has been proven to match what the
database actually contains.

---

## Scope

### Included

- Metrics endpoint and collection integration
- Technical metric instrumentation
- Business metric instrumentation
- Cardinality review
- Reconciliation verification
- Overhead measurement
- Metric documentation

### Out of Scope

- Distributed tracing (Issue 095)
- Dashboards that visualize these metrics (Issue 098)
- Alerting on metric thresholds (Issue 097)
- Historical metric retention policy (an infrastructure decision alongside Issue 081's provisioning)

## Technical Requirements

**Technical metrics**

```text
http_requests_total{method, route, status}
http_request_duration_seconds{method, route}
db_query_duration_seconds{operation}
cache_operations_total{result}              -- extends Issue 077's existing metric
job_executions_total{job, result}
job_queue_depth{queue}
active_sessions
```

**Business metrics**

```text
sales_orders_created_total
invoices_posted_total                        -- must reconcile with Issue 051's posted entries
approvals_pending{documentType}              -- must reconcile with Issue 064's open WorkflowTask count
failed_logins_total
report_executions_total{reportCode}
notification_deliveries_total{channel, result}
```

**Cardinality rule**

```text
Safe labels:      method, route, status, documentType, reportCode, job, queue, channel, result
                   — a small, fixed, known set of values

Dangerous labels:  userId, invoiceId, orderId, or any free-text field
                   — unbounded, grows with data volume

If a metric would need a dangerous label to be useful (e.g. "which specific
invoice failed to post"), that detail belongs in a correlated log line
(Issue 093), found via the correlation ID — not in a metric label
```

**Reconciliation verification, per metric selected as a representative check**

```text
invoices_posted_total    vs.   SELECT COUNT(*) FROM JournalEntry
                                WHERE sourceType = 'SALES_INVOICE' AND status = 'POSTED'
                                (Issue 051)

approvals_pending{documentType: 'PurchaseRequisition'}
                          vs.   SELECT COUNT(*) FROM WorkflowTask
                                WHERE status = 'OPEN' AND ... documentType = 'PurchaseRequisition'
                                (Issue 064)
```

At least one such check per module, following the same discipline Issue 059 already applied to its
cross-module KPIs.

**Overhead measurement**

```text
Measure request latency with instrumentation enabled vs. disabled on a
representative sample of endpoints — confirm the difference is negligible,
consistent with the performance discipline established in Sprint 12
```

**Documentation**

```text
docs/Architecture/metrics-catalogue.md

Per metric: name, type (counter/gauge/histogram), labels, meaning, reconciliation source
```

## Dependencies

- Issue 077 — the existing cache hit/miss metric this issue extends rather than duplicates.
- Issue 093 — the correlation ID and logging infrastructure this issue's metrics complement (detail
  lives in logs, aggregates live in metrics).

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Metrics endpoint implemented and verified to expose all listed metrics
- [ ] Cardinality review completed and documented; no dangerous label present
- [ ] **Reconciliation test**: at least one business metric per module verified against a direct database query
- [ ] Overhead measured and confirmed negligible
- [ ] Metrics catalogue documented
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-15-monitoring-observability.md` § 2 |
| Epic | Monitoring & Observability |
| Extends | Issue 077 (cache metrics) |
| Reconciled against | Issue 051, Issue 064 |
| Same reconciliation discipline as | Issue 059 |
| Consumed by | Issue 098 (dashboards) |
| Pull Request | _to be linked_ |
