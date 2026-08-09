# [EPIC] Monitoring & Observability

<!-- GitHub title: [EPIC] Monitoring & Observability
     Labels: epic, observability
     Milestone: Sprint 15 - Monitoring & Observability
     Branch: none — epics are not worked on directly
     Create this epic AFTER issues 093-098 exist, then replace the placeholder
     numbers in the task list below with the real GitHub issue numbers.
     Copy everything below this comment into the issue body. -->

## Module: backend
## Sprint: Sprint 15 - Monitoring & Observability

---

## Purpose

Make the running system explain its own behavior: structured logs, metrics, distributed tracing,
health checks, alerting, and dashboards backed by service level objectives.

```text
Monitoring        Tells you something is wrong

Observability     Lets you find out why, without shipping new code
```

## Business Value

The system is live, secure, performant, and — after Sprint 14 — consolidated. It is still opaque.
This epic is what lets a production problem be diagnosed from telemetry alone, proven by a real
failure injection drill rather than assumed from the presence of dashboards.

## Issues

- [ ] #93 Implement Structured Logging and Correlation IDs
- [ ] #94 Implement Metrics and Instrumentation
- [ ] #95 Implement Distributed Tracing
- [ ] #96 Implement Health Checks and Uptime Monitoring
- [ ] #97 Implement Alerting and Incident Response
- [ ] #98 Build Observability Dashboards and Define SLOs

## The Three Pillars

| Pillar | Answers | Example |
|--------|---------|---------|
| Logs | What happened? | "Invoice 4821 posting failed: period closed" |
| Metrics | How much, how often? | "p95 invoice API latency = 2.4s" |
| Traces | Where did the time go? | "1.9s of 2.4s spent in the ledger balance query" |

All three share the correlation ID from Issue 093, which is what makes them navigable together.

## The Test

```text
Inject a failure

        ↓

Diagnose using only logs, metrics, and traces — no source code

        ↓

If you cannot identify what, where, for whom, and since when — the instrumentation is incomplete
```

## Epic Acceptance Criteria

- [ ] All child issues closed
- [ ] Correlation ID propagates end to end, including into background workers
- [ ] Metrics instrumented with bounded cardinality
- [ ] Traces cross-linked with logs across frontend, backend, and workers
- [ ] Readiness checks wired into deployment and load balancing
- [ ] Every alert has a runbook; incident drill completed
- [ ] SLOs defined and error budget tracked
- [ ] Failure injection drill successfully diagnosed from telemetry alone
- [ ] Release v1.2.0 published

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-15-monitoring-observability.md` |
| Phase overview | `academy/08-sprints/phase-05-engineering-maturity/phase-overview.md` |
| Instruments the consolidated codebase from | Sprint 14 |
| Release | v1.2.0 |
