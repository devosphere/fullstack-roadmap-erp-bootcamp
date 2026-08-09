# Sprint 15 - Monitoring & Observability

**Sprint:** Sprint 15  
**Phase:** Phase 05 - Engineering Maturity  
**Duration:** 3-4 Weeks  
**Release Target:** v1.2.0  
**Status:** Planned

---

# Sprint Goal

Make the ERP platform observable by adding structured logging with correlation, application and business metrics, distributed tracing, health checks, actionable alerting, and dashboards backed by service level objectives.

At the end of this sprint, a production problem should be diagnosable from telemetry alone, without reproducing it locally and without asking a user what they clicked.

---

# Sprint Context

The system is live, secure, performant, and consolidated. But it is opaque:

```text
A user reports "the invoice page is slow"

        ↓

Which user?         Unknown
Which invoice?      Unknown
Which layer?        Frontend, API, database, or cache — unknown
When?               Approximately
Still happening?    Unknown
```

Sprint 12 measured performance in a test environment. Sprint 15 makes the running system explain itself continuously.

```text
Monitoring        Tells you something is wrong

Observability     Lets you find out why, without shipping new code
```

---

# Business Outcome

After completing this sprint, the ERP platform will have:

- Structured logs correlated across services.
- Application and business metrics.
- Distributed tracing across frontend, API, and workers.
- Health and readiness endpoints with uptime monitoring.
- Actionable alerts, each with a runbook.
- Operational dashboards.
- Defined and tracked service level objectives.

---

# Sprint Objectives

By the end of this sprint, learners should understand:

- The three pillars of observability: logs, metrics, and traces.
- Structured logging and correlation.
- Metric types and cardinality.
- Distributed tracing and span propagation.
- Health checks versus readiness checks.
- Alert design and alert fatigue.
- Service level indicators, objectives, and error budgets.
- Incident response practice.

---

# Sprint Theme

## "If You Cannot Explain It From Telemetry, You Are Guessing"

The test of this sprint is not whether dashboards exist.

It is this:

```text
Inject a failure in production-like conditions

        ↓

Do not look at the code

        ↓

Can you identify what broke, where, for whom, and since when

        ↓

using only logs, metrics, and traces?
```

If the answer is no, the instrumentation is incomplete.

---

# Business Capability

## Monitoring & Observability

This sprint delivers:

- Log aggregation and correlation.
- Metric collection.
- Distributed tracing.
- Health monitoring.
- Alerting and incident response.
- Dashboards and SLOs.

---

# Domain Concepts

---

# The Three Pillars

| Pillar | Answers | Example |
|--------|---------|---------|
| Logs | What happened? | "Invoice 4821 posting failed: period closed" |
| Metrics | How much, how often? | "p95 invoice API latency = 2.4s" |
| Traces | Where did the time go? | "1.9s of 2.4s spent in the ledger balance query" |

Each pillar answers a question the others cannot.

---

# Structured Logging

Logs emitted as machine-parseable records rather than prose.

```text
Unstructured:
  Error posting invoice for customer Acme

Structured:
  { "level": "error", "event": "invoice.post.failed",
    "invoiceId": 4821, "customerId": 112,
    "reason": "fiscal_period_closed",
    "correlationId": "b7f3...", "userId": 88 }
```

Only the second can be searched, grouped, and alerted on.

---

# Correlation ID

A single identifier attached to every log, metric, and span produced by one user action.

```text
Browser request

        ↓  correlationId: b7f3...

API request

        ↓  correlationId: b7f3...

Database query

        ↓  correlationId: b7f3...

Background job

        ↓  correlationId: b7f3...
```

Without it, distributed logs are unrelated noise.

---

# Metric Types

| Type | Behaviour | Example |
|------|-----------|---------|
| Counter | Only increases | Total requests, total failed logins |
| Gauge | Rises and falls | Active sessions, queue depth |
| Histogram | Distribution | Request latency, report duration |

---

# Cardinality

The number of distinct label combinations a metric produces.

```text
Safe:      http_requests{method, route, status}

Dangerous: http_requests{method, route, status, userId, invoiceId}
```

High cardinality is the most common way to make a metrics system collapse.

---

# Span and Trace

A span is one timed operation. A trace is the tree of spans for one request.

```text
Trace: POST /api/sales/invoices          [2,400 ms]
  ├─ auth.verify                         [   12 ms]
  ├─ invoice.validate                    [   30 ms]
  ├─ ledger.balance.query                [1,900 ms]   ← the problem
  └─ invoice.persist                     [  450 ms]
```

---

# SLI, SLO, and Error Budget

```text
SLI  (Indicator)   What we measure       → % of requests under 500ms
SLO  (Objective)   The target            → 99% of requests under 500ms
Error Budget       Allowed failure       → 1% of requests may exceed it
```

An error budget turns reliability into a number the team can spend deliberately.

---

# Alert Fatigue

What happens when alerts fire without requiring action.

```text
Too many alerts → alerts ignored → the real alert is also ignored
```

Rule: every alert must be actionable and must have a runbook.

---

# Sprint Scope

---

# 1. Structured Logging and Correlation

## Objective

Make every log record searchable and connected to the action that produced it.

## Tasks

- Replace unstructured logging with a structured logger.
- Define a standard log schema and event naming convention.
- Generate a correlation ID at the entry point of every request.
- Propagate the correlation ID through services, database calls, and background jobs.
- Set log levels per environment.
- Aggregate logs to a searchable store.
- Verify that redaction from Sprint 11 still holds.

## Business Rules

- Every log record includes correlation ID, timestamp, level, event name, and service.
- No secret, password, token, or personal identifier appears in a log.
- Log level is configurable per environment without a code change.
- Errors log the cause, not only the message.
- Log volume is bounded; debug logging is off in production by default.

## Acceptance Criteria

- Structured logger implemented across backend and workers.
- Log schema documented.
- Correlation ID generated and propagated end to end.
- Logs aggregated and searchable by correlation ID.
- Redaction verified.
- Log levels configurable per environment.

---

# 2. Metrics and Instrumentation

## Objective

Measure the system's behaviour continuously.

## Tasks

- Add a metrics endpoint and collection.
- Instrument technical metrics.
- Instrument business metrics.
- Define labels carefully to control cardinality.
- Verify metric accuracy against known activity.

## Metrics

**Technical**

```text
http_requests_total{method, route, status}
http_request_duration_seconds{method, route}
db_query_duration_seconds{operation}
cache_operations_total{result}
job_executions_total{job, result}
job_queue_depth{queue}
active_sessions
```

**Business**

```text
sales_orders_created_total
invoices_posted_total
approvals_pending{documentType}
failed_logins_total
report_executions_total{reportCode}
notification_deliveries_total{channel, result}
```

## Business Rules

- Labels never include user IDs, document IDs, or free text.
- Business metrics must reconcile with the database.
- Metric collection must not measurably affect request latency.

## Acceptance Criteria

- Metrics endpoint exposed and collected.
- Technical and business metrics instrumented.
- Cardinality reviewed and bounded.
- Metric values verified against known activity.
- Collection overhead measured and acceptable.

---

# 3. Distributed Tracing

## Objective

Show where time is actually spent across service boundaries.

## Tasks

- Add tracing instrumentation to the backend.
- Add tracing to the frontend for user-initiated requests.
- Propagate trace context to background workers.
- Instrument database and cache calls as spans.
- Configure sampling.
- Connect traces to logs through the correlation ID.

## Business Rules

- Trace context propagates across every asynchronous boundary.
- Sampling keeps all error traces and a percentage of successful ones.
- Span names are stable and low cardinality.
- A trace can be found from a log record and a log record from a trace.

## Acceptance Criteria

- Backend, frontend, and worker tracing implemented.
- Database and cache calls appear as spans.
- Trace context propagates across async boundaries.
- Sampling configured with all errors retained.
- Traces and logs cross-linked.

---

# 4. Health Checks and Uptime Monitoring

## Objective

Know whether the system is up, and let the platform know too.

## Tasks

- Implement a liveness endpoint.
- Implement a readiness endpoint that checks dependencies.
- Expose build version and commit in a status endpoint.
- Configure external uptime monitoring.
- Wire readiness into deployment and load balancer decisions.

## Endpoint Behaviour

```text
/health/live      Is the process running?
                  No dependency checks. Fast.

/health/ready     Can it serve traffic?
                  Checks database, cache, and queue.

/health/info      Version, commit, environment, uptime.
```

## Business Rules

- Liveness never checks dependencies; a slow database must not restart the process.
- Readiness failure removes the instance from load balancing without killing it.
- Health endpoints require no authentication but reveal no sensitive detail.
- Uptime monitoring runs from outside the production network.

## Acceptance Criteria

- Liveness, readiness, and info endpoints implemented.
- Readiness checks all critical dependencies.
- Load balancer and deployment use readiness.
- External uptime monitoring configured and alerting.
- Endpoints leak no sensitive information.

---

# 5. Alerting and Incident Response

## Objective

Be told about problems before users report them, and know what to do.

## Tasks

- Define alert conditions from SLOs and failure modes.
- Set thresholds that avoid noise.
- Configure alert routing and escalation.
- Write a runbook for every alert.
- Define severity levels and response expectations.
- Run an incident drill.

## Alert Catalogue

| Alert | Condition | Severity |
|-------|-----------|----------|
| Service down | Readiness failing for 2 minutes | Critical |
| Error rate high | 5xx rate above threshold for 5 minutes | Critical |
| Latency breach | p95 above budget for 10 minutes | High |
| Database unreachable | Connection failures | Critical |
| Backup failed | Scheduled backup did not complete | Critical |
| Job queue backing up | Queue depth above threshold | High |
| Notification failures | Delivery failure rate above threshold | Medium |
| Failed login spike | Failed logins above baseline | High |
| Disk or connection pool exhaustion | Utilization above threshold | High |

## Business Rules

- Every alert has a runbook containing symptoms, likely causes, and first actions.
- An alert that cannot be acted on is deleted, not muted.
- Severity determines response time, not the loudness of the notification.
- Every fired alert is reviewed; repeated false positives are retuned.
- Incidents produce a written post-incident review without blame.

## Acceptance Criteria

- Alert catalogue defined and implemented.
- Every alert has a runbook.
- Routing and escalation configured.
- Severity levels and response expectations documented.
- Incident drill completed and reviewed.
- Post-incident review template created.

---

# 6. Observability Dashboards and SLOs

## Objective

Give the team one place to see system health, and a definition of "healthy enough".

## Dashboards

```text
System Health
  Uptime, error rate, request throughput, latency percentiles

Application Performance
  Latency by endpoint, database query time, cache hit rate

Background Processing
  Job success rate, queue depth, retry counts

Business Activity
  Orders, invoices, approvals pending, report executions

Reliability
  SLO attainment and remaining error budget
```

## Service Level Objectives

| SLI | SLO |
|-----|-----|
| Availability | 99.5% of requests succeed, measured monthly |
| Latency | 95% of API requests complete within budget |
| Job success | 99% of background jobs succeed within retry limits |
| Notification delivery | 99% delivered within 5 minutes |

## Business Rules

- SLOs are agreed with the business, not chosen by engineering alone.
- Error budget consumption is reviewed in every retrospective.
- Exhausting the error budget prioritizes reliability work over features.
- Dashboards are readable by someone who did not build the system.

## Acceptance Criteria

- All dashboards implemented and accessible.
- SLIs instrumented and SLOs defined.
- Error budget tracked and displayed.
- Dashboards reviewed for clarity by someone outside the build.
- SLO review added to the retrospective agenda.

---

# Observability Architecture

```text
    Frontend            Backend API            Workers

        │                    │                    │

        └────────────────────┼────────────────────┘

                             │

        ┌────────────────────┼────────────────────┐

      Logs               Metrics               Traces

        │                    │                    │

   Log Store          Metrics Store         Trace Store

        └────────────────────┼────────────────────┘

                       Dashboards

                             │

                          Alerts

                             │

                        On-Call Response
```

All three signals share the correlation ID, which is what makes them navigable together.

---

# Infrastructure Requirements

```text
Log aggregation and search
Metrics collection and storage
Trace collection and storage
Dashboard and alerting platform
External uptime monitoring
Alert routing and escalation
```

---

# GitHub Execution

---

# Epic

## Epic: Monitoring & Observability

Purpose:

Make the running system explain its own behaviour, so problems are found and diagnosed from telemetry.

---

# GitHub Issues

---

# Issue 093 - Implement Structured Logging and Correlation IDs

Type:

```
Feature
```

Acceptance Criteria:

- Structured logger implemented across backend and workers.
- Log schema documented.
- Correlation ID generated and propagated end to end.
- Logs aggregated and searchable by correlation ID.
- Redaction verified.

---

# Issue 094 - Implement Metrics and Instrumentation

Type:

```
Feature
```

Acceptance Criteria:

- Metrics endpoint exposed and collected.
- Technical and business metrics instrumented.
- Cardinality reviewed and bounded.
- Metric values verified against known activity.

---

# Issue 095 - Implement Distributed Tracing

Type:

```
Feature
```

Acceptance Criteria:

- Backend, frontend, and worker tracing implemented.
- Database and cache calls appear as spans.
- Trace context propagates across async boundaries.
- Sampling configured with all errors retained.
- Traces and logs cross-linked.

---

# Issue 096 - Implement Health Checks and Uptime Monitoring

Type:

```
Feature
```

Acceptance Criteria:

- Liveness, readiness, and info endpoints implemented.
- Readiness checks all critical dependencies.
- Load balancer and deployment use readiness.
- External uptime monitoring configured.
- No sensitive information exposed.

---

# Issue 097 - Implement Alerting and Incident Response

Type:

```
Task
```

Acceptance Criteria:

- Alert catalogue defined and implemented.
- Every alert has a runbook.
- Routing and escalation configured.
- Incident drill completed and reviewed.
- Post-incident review template created.

---

# Issue 098 - Build Observability Dashboards and Define SLOs

Type:

```
Feature
```

Acceptance Criteria:

- All dashboards implemented and accessible.
- SLIs instrumented and SLOs defined.
- Error budget tracked and displayed.
- Dashboards reviewed for clarity.
- SLO review added to the retrospective.

---

# Development Workflow

Every change follows:

```text
GitHub Issue

        ↓

Feature Branch

        ↓

Instrument

        ↓

Verify Signal Appears in Telemetry

        ↓

Pull Request

        ↓

Code Review

        ↓

Merge

        ↓

Release
```

---

# Testing Requirements

## Unit Testing

Required:

- Log schema and field population.
- Correlation ID generation and propagation.
- Metric increment and observation logic.
- Health check dependency evaluation.
- Redaction of sensitive fields.

---

## Integration Testing

Test:

- Correlation ID survives an async boundary into a worker.
- Metrics reflect actual request counts and durations.
- Traces contain expected spans.
- Readiness fails when a dependency is unavailable.
- Liveness stays healthy when a dependency is unavailable.

---

## Observability Testing

### Failure Injection Drill

```text
Inject a failure (stop the cache, slow the database, break a job)

        ↓

Do not read the source code

        ↓

Use only logs, metrics, and traces

        ↓

Identify what broke, where, for whom, and since when

        ↓

If you cannot, the instrumentation is incomplete
```

---

### Alert Verification

```text
Trigger each alert condition artificially

        ↓

Confirm the alert fires

        ↓

Confirm routing reaches the responder

        ↓

Follow the runbook

        ↓

Confirm the runbook resolves it
```

---

## Performance Testing

Validate:

- Instrumentation overhead is within the agreed budget.
- Log volume does not exhaust storage at expected traffic.
- Tracing sampling keeps cost bounded.

---

# Documentation Deliverables

## Business Documentation

- Service level objectives.
- Incident severity and response expectations.
- Post-incident review template.

---

## Technical Documentation

- Log schema and event naming convention.
- Metric catalogue with definitions.
- Alert catalogue with runbooks.
- Observability runbook.
- Dashboard guide.
- ADR: observability tooling and sampling strategy.

---

# Sprint Deliverables

## Observability

Completed:

- Structured logging with correlation.
- Technical and business metrics.
- Distributed tracing.
- Health checks and uptime monitoring.
- Alerting with runbooks.
- Dashboards and SLOs.

---

## Engineering

Completed:

- Instrumentation across frontend, backend, and workers.
- Telemetry verified by failure injection.
- Alert routing configured.

---

## Operations

Completed:

- Incident drill performed.
- Runbooks written for every alert.
- SLO review added to the retrospective cycle.

---

# Sprint Review

The learner demonstrates:

1. Trace one user action across logs, metrics, and traces using its correlation ID.
2. Show the business metrics reconciling with the database.
3. Show a trace identifying a slow database query.
4. Fail a dependency and show readiness failing while liveness stays healthy.
5. Trigger an alert and follow its runbook.
6. Walk through the dashboards.
7. Show SLO attainment and remaining error budget.

---

# Sprint Retrospective

## Discussion Topics

- What telemetry was missing when it was first needed.
- Which alerts were noise and which were valuable.
- What the failure injection drill revealed.
- Whether the error budget changes how work is prioritized.
- Lessons learned.

---

# Release

**Version:** `v1.2.0`

---

# Release Notes

```markdown
# v1.2.0

## Added

- Structured Logging with Correlation IDs
- Technical and Business Metrics
- Distributed Tracing across Frontend, API, and Workers
- Liveness, Readiness, and Info Health Endpoints
- External Uptime Monitoring
- Alert Catalogue with Runbooks
- Observability Dashboards
- Service Level Objectives and Error Budget Tracking

## Changed

- Deployment and load balancing now use readiness checks
```

---

# Definition of Done

Sprint 15 is complete when:

- [ ] Structured logging implemented and aggregated.
- [ ] Correlation IDs propagate end to end, including into workers.
- [ ] Technical and business metrics instrumented and verified.
- [ ] Metric cardinality reviewed and bounded.
- [ ] Distributed tracing implemented and cross-linked with logs.
- [ ] Health endpoints implemented and wired into deployment.
- [ ] External uptime monitoring configured.
- [ ] Alert catalogue implemented with a runbook per alert.
- [ ] Incident drill completed and reviewed.
- [ ] Dashboards implemented and reviewed for clarity.
- [ ] SLOs defined and error budget tracked.
- [ ] Failure injection drill diagnosed from telemetry alone.
- [ ] Instrumentation overhead within budget.
- [ ] Documentation completed.
- [ ] Pull Requests approved.
- [ ] Release v1.2.0 published.

---

# Skills Acquired

After completing Sprint 15, learners will understand:

## Observability Engineering

- Structured logging and correlation.
- Metric design and cardinality control.
- Distributed tracing and context propagation.
- Instrumentation cost management.

---

## Site Reliability

- Health check design.
- Alert design and fatigue avoidance.
- SLI, SLO, and error budget practice.
- Incident response and post-incident review.

---

## Operations

- Diagnosing problems from telemetry.
- Building dashboards others can read.
- Writing runbooks that work under pressure.

---

## Professional Practice

- Owning a system's behaviour in production.
- Blameless incident culture.
- Prioritizing reliability against features with evidence.

---

# Next Sprint Preview

# Sprint 16 - Final Capstone Release

Planned:

- End-to-end business scenario validation.
- Full regression and user acceptance testing.
- Complete user and technical documentation.
- Capstone demonstration and portfolio.
- The v2.0.0 release.
- Program retrospective and continuous improvement plan.
