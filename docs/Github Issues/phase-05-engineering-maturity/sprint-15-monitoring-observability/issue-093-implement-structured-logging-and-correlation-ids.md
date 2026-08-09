# [FEATURE] Implement Structured Logging and Correlation IDs

<!-- GitHub title: [FEATURE] Implement Structured Logging and Correlation IDs
     Labels: feature, backend, observability, priority: high
     Milestone: Sprint 15 - Monitoring & Observability
     Branch: feature/093-implement-structured-logging-and-correlation-ids
     Epic: Monitoring & Observability
     Depends on: 073
     Blocks: 094, 095
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

Replace unstructured logging with a structured logger, define a standard log schema, generate a
correlation ID at every request entry point, and propagate it through services, database calls, and
background jobs — including into the workers introduced by Sprint 09 and Sprint 10.

## Background

Every module logged whatever seemed useful at the time it was built — a message string, sometimes
an object, with no consistent shape across thirteen sprints of code. That is fine for a developer
reading their own terminal during local development; it is unusable for searching production logs
for one specific failed request among thousands.

This issue is the foundation every other issue in this sprint depends on. Metrics (Issue 094)
answer "how often" but not "which specific request." Traces (Issue 095) show where time went within
one request but need something to link that trace back to the log lines the same request produced.
The correlation ID is that link — generated once at the entry point, carried through every layer,
attached to every log line, every metric label where relevant, and every trace span.

The hardest part is not the HTTP request path — it's **propagation across an async boundary**. When
Issue 062's scheduled report or Issue 066's notification dispatch picks up work from a queue,
nothing automatically carries the correlation ID from whoever originally triggered it. That has to
be threaded through explicitly, or the trail goes cold exactly where background processing begins.

## User Story

As a Backend Developer,
I want every log line structured and correlated to the request that produced it,
So that I can find every log line related to one user action, across every service and background job it touched.

## Acceptance Criteria

```gherkin
Given any incoming request
When it is processed
Then a correlation ID is generated (or extracted, if already present from an upstream caller) and attached to every log line produced while handling it
```

```gherkin
Given a request that triggers a background job (e.g. a scheduled report, Issue 062, or a notification dispatch, Issue 066)
When the job runs
Then its log lines carry the same correlation ID as the request that triggered it
```

```gherkin
Given a log line containing a password, token, or a field from Issue 043's SupplierBankDetail
When it is inspected
Then the sensitive value is redacted, consistent with Issue 073's requirements
```

```gherkin
Given the configured log level for an environment
When it is changed
Then it takes effect without a code change
```

- [ ] Structured logger integrated across the backend and workers, replacing ad hoc `console.log`/string logging
- [ ] Standard log schema defined: correlation ID, timestamp, level, event name, service, and structured context fields
- [ ] Event naming convention documented (e.g. `domain.action`, following the pattern already used for Issue 066's `eventCode`)
- [ ] Correlation ID generated at every HTTP request entry point
- [ ] An incoming correlation ID from an upstream caller is respected rather than always overwritten
- [ ] Correlation ID propagated through service calls, database calls, and background job execution
- [ ] Correlation ID explicitly threaded into Issue 062's scheduled report jobs and Issue 066's notification dispatch jobs
- [ ] Log aggregation configured so logs are searchable by correlation ID
- [ ] Redaction verified for every field already identified in Issue 073 (passwords, tokens, MFA secrets, `SupplierBankDetail` fields)
- [ ] Errors log their cause and context, not only a message string
- [ ] Log level configurable per environment without a code change
- [ ] Debug-level logging off in production by default

## Expected Result

Every log line can be traced back to the exact request that caused it, across every service and
into every background job — and no sensitive value from Issue 043 or Issue 070 ever appears in a
log, in production or otherwise.

---

## Scope

### Included

- Structured logger integration
- Log schema and event naming convention
- Correlation ID generation and full-stack propagation, including into workers
- Log aggregation configuration
- Redaction verification (extending Issue 073)
- Per-environment log level configuration

### Out of Scope

- Metrics (Issue 094)
- Distributed tracing (Issue 095) — though this issue's correlation ID is the link tracing depends on
- Log-based alerting (Issue 097)
- Long-term log retention and archival policy (an infrastructure decision, informed by whatever storage was chosen in Issue 081)

## Technical Requirements

**Log schema**

```text
{
  "timestamp": "2026-08-09T14:22:01.483Z",
  "level": "error",
  "event": "invoice.post.failed",
  "service": "backend",
  "correlationId": "b7f3a1c2-...",
  "userId": 88,
  "context": {
    "invoiceId": 4821,
    "reason": "fiscal_period_closed"
  }
}
```

**Correlation ID generation and propagation**

```text
Incoming HTTP request

    → Check for an incoming correlation ID header (from a client or upstream service)
    → If absent, generate one (e.g. a UUID)
    → Attach it to the request context for the duration of the request
    → Every log call within that request context includes it automatically
      (via async local storage or the equivalent mechanism for the chosen framework)
```

**Propagation into background jobs — the part most likely to be missed**

```text
Issue 062's scheduled report execution:
    the job that actually runs the report and generates the export currently
    has no request context, since it fires from a scheduler, not an HTTP call
    → generate a correlation ID when the schedule fires, or, when a schedule
      run was itself triggered by a user action, carry that user's ID through
      for context even if a fresh correlation ID is used for the job's own logs

Issue 066's notification dispatch:
    a notification queued during request A's handling and delivered later
    by a background worker must log its delivery attempt with a reference
    back to the correlation ID of the request that queued it, even though
    delivery itself happens outside that request's lifetime
    → store the originating correlationId on the Notification row (schema
      addition) so the background worker can retrieve and log with it
```

**Redaction** (extends Issue 073's list)

```text
password, passwordHash
JWT_SECRET, refresh token values
UserMfaSetting.secret
SupplierBankDetail.accountNumber, .accountName, .swiftCode

Verify via a test that logs a request containing each of these
and asserts the log output does not contain the raw value —
the same test pattern Issue 073 already established, re-run here
against the new structured logger specifically
```

**Log level configuration**

```text
LOG_LEVEL environment variable (extends the Issue 082 configuration reference)

    debug   — development only, off by default in staging/production
    info    — default for staging and production
    warn, error   — always emitted
```

## Dependencies

- Issue 073 — the redaction rules this issue's logger must enforce for the sensitive fields already
  identified.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for log schema and correlation ID generation/extraction
- [ ] Integration test confirming a correlation ID survives from an HTTP request into a triggered background job (Issue 062 or Issue 066)
- [ ] Redaction test suite passing for every listed sensitive field
- [ ] Log level configuration verified changeable per environment without a code change
- [ ] Logs verified searchable by correlation ID in the aggregation tooling
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-15-monitoring-observability.md` § 1 |
| Epic | Monitoring & Observability |
| Extends redaction from | Issue 073 |
| Propagates into | Issue 062, Issue 066 |
| Consumed by | Issue 094, Issue 095 |
| Pull Request | _to be linked_ |
