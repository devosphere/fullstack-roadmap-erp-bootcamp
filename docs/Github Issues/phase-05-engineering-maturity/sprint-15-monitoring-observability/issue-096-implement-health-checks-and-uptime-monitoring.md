# [FEATURE] Implement Health Checks and Uptime Monitoring

<!-- GitHub title: [FEATURE] Implement Health Checks and Uptime Monitoring
     Labels: feature, backend, observability, priority: high
     Milestone: Sprint 15 - Monitoring & Observability
     Branch: feature/096-implement-health-checks-and-uptime-monitoring
     Epic: Monitoring & Observability
     Depends on: 081, 094, 095
     Blocks: 097
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

Implement distinct liveness, readiness, and info endpoints, configure external uptime monitoring,
and wire readiness into the deployment and load balancing decisions provisioned in Sprint 13 —
replacing the placeholder health check Issue 006 created before any real dependency existed to
check.

## Background

Issue 006 added a basic `GET /api/health` endpoint in Sprint 01, before the database (Issue 007),
cache (Issue 077), or any other dependency existed. It has been serving as a stand-in ever since,
answering only "is the process running," which is a different — and in production, a dangerously
incomplete — question from "can this instance actually serve traffic."

The distinction this issue draws matters specifically because of what each answer controls:

```text
Liveness failing     → the process should be restarted (it's stuck or crashed)
Readiness failing     → the process should be removed from load balancing,
                        but NOT restarted — the process itself is fine,
                        one of its dependencies (database, cache) is not
```

Getting this backwards is a specific, well-known failure mode: if liveness checks the database and
the database has a slow moment, every application instance restarts simultaneously, and a transient
database hiccup becomes a full outage. Liveness must never check dependencies; readiness must.

External uptime monitoring exists because it answers a question internal health checks structurally
cannot: is the system reachable **from outside** the production network at all — catching DNS,
network, and load balancer failures that an in-cluster check would never see.

## User Story

As a DevOps Engineer,
I want liveness and readiness checked separately, and the whole system watched from outside,
So that a slow dependency degrades gracefully instead of triggering a restart storm, and total outages are caught immediately.

## Acceptance Criteria

```gherkin
Given the database is temporarily unavailable
When the liveness endpoint is checked
Then it still reports healthy, because the process itself is fine
```

```gherkin
Given the database is temporarily unavailable
When the readiness endpoint is checked
Then it reports unhealthy
```

```gherkin
Given a readiness check fails
When the deployment infrastructure observes it
Then the instance is removed from load balancing without being restarted
```

```gherkin
Given the production environment becomes unreachable from outside the network
When the external uptime monitor checks it
Then the outage is detected and alerted within the configured window
```

```gherkin
Given the info endpoint
When it is queried
Then it returns the current build version, commit, environment, and uptime without requiring authentication or revealing sensitive detail
```

- [ ] `GET /health/live` implemented: checks process responsiveness only, no dependency checks
- [ ] `GET /health/ready` implemented: checks database, cache (Issue 077), and any other critical dependency
- [ ] `GET /health/info` implemented: returns version, commit SHA, environment, and uptime
- [ ] The original Issue 006 `/api/health` endpoint retired or redirected to the new endpoints, with references updated
- [ ] Issue 083's deployment pipeline configured to use readiness, not liveness, for traffic-shifting decisions
- [ ] Issue 081's load balancer configured to remove instances from rotation based on readiness
- [ ] Restart policies (Issue 081) configured to trigger only on liveness failure
- [ ] External uptime monitoring configured, running from outside the production network
- [ ] Uptime monitor alerts configured for outage detection
- [ ] All three endpoints require no authentication but reveal no sensitive internal detail
- [ ] Readiness failure verified not to trigger a restart, only removal from rotation

## Expected Result

A transient database hiccup removes the affected instance from traffic without restarting it and
without a restart storm. A genuinely stuck process gets restarted. A total outage — reachability
failure from outside the network — is caught immediately by external monitoring.

---

## Scope

### Included

- Distinct liveness, readiness, and info endpoints
- Retirement of the Issue 006 placeholder health check
- Deployment and load balancer integration with readiness
- Restart policy alignment with liveness
- External uptime monitoring and alerting

### Out of Scope

- Alert routing and runbooks for the alerts this issue's monitoring produces (Issue 097)
- Dashboards visualizing health/uptime history (Issue 098)
- Application performance monitoring beyond binary health (covered by Issues 094, 095)

## Technical Requirements

**Endpoint behavior**

```text
GET /health/live

    Checks: process is running and responsive
    Never checks: database, cache, or any external dependency
    Failure → the orchestrator should restart the process

GET /health/ready

    Checks: database connection (Issue 007), cache connection (Issue 077),
            and any other critical dependency introduced since
    Failure → the orchestrator should remove this instance from load
              balancing, but NOT restart it

GET /health/info

    Returns: { version, commit, environment, uptimeSeconds }
    No dependency checks — this is metadata, not a health signal
```

**Migration from Issue 006**

```text
The original GET /api/health return { "status": "healthy" } was correct for
its moment (Sprint 01, no dependencies existed yet) but is now insufficient
and ambiguous about which of the two distinct questions it answers.

Retire it, or make it an alias for /health/live specifically (never silently
redefine it to mean readiness, which would be a breaking behavior change for
anything still calling it) — document whichever choice is made, and update
any reference to the old endpoint (Issue 083's smoke tests currently check
"health endpoint responds," which needs updating to specify which one)
```

**Deployment integration**

```text
Issue 083's pipeline:
    post-deployment smoke test should specifically confirm /health/ready
    returns healthy before considering the deployment successful

Issue 081's load balancer:
    health check target changed from the old combined endpoint to
    /health/ready specifically

Restart policy (Issue 081):
    triggers only on /health/live failure, confirmed by testing that a
    readiness failure alone does not cause a restart
```

**External uptime monitoring**

```text
A monitor running outside the production network's own infrastructure,
checking reachability on a regular interval (e.g. every 1-5 minutes)

Detects what in-cluster health checks structurally cannot:
    DNS failures, network partition, load balancer misconfiguration,
    a total outage where nothing internal is even running to answer
    a health check
```

## Dependencies

- Issue 081 — the production infrastructure whose deployment and load balancing this issue's
  readiness check now governs.
- Issue 094 — informs what "critical dependency" means for readiness, alongside the direct database
  and cache checks.
- Issue 095 — tracing context for correlating a readiness failure with what's actually failing
  underneath it.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests confirming liveness never checks dependencies
- [ ] Unit tests confirming readiness checks database and cache
- [ ] **Integration test**: with the database unavailable, liveness reports healthy while readiness reports unhealthy
- [ ] **Integration test**: a readiness failure results in removal from load balancing without a restart
- [ ] Deployment pipeline (Issue 083) updated to check readiness specifically
- [ ] External uptime monitoring configured and verified to detect a simulated outage
- [ ] Old Issue 006 endpoint's fate documented and any remaining references updated
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-15-monitoring-observability.md` § 4 |
| Epic | Monitoring & Observability |
| Replaces the placeholder from | Issue 006 |
| Integrates with | Issue 081 (infrastructure), Issue 083 (deployment pipeline) |
| Pull Request | _to be linked_ |
