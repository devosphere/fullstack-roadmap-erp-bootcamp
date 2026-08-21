# [FEATURE] Build Observability Dashboards and Define SLOs

<!-- GitHub title: [FEATURE] Build Observability Dashboards and Define SLOs
     Labels: feature, frontend, observability, priority: high
     Milestone: Sprint 15 - Monitoring & Observability
     Branch: feature/098-build-observability-dashboards-and-define-slos
     Epic: Monitoring & Observability
     Depends on: 093, 094, 095, 097
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

## Module: frontend
## Sprint: Sprint 15 - Monitoring & Observability

---

## Summary

Build the dashboards that make Issues 093-097's telemetry usable by the whole team — system health,
application performance, background processing, and business activity — and define service level
objectives with a tracked error budget, agreed with the business rather than chosen by engineering
alone.

## Background

This is the sixth kind of dashboard built in this programme, following the module dashboards from
Sprints 04-08 (Issues 028, 035, 042, 049, 056) and Sprint 09's executive dashboard (Issue 060). It
is a different kind of dashboard from all of them: those showed **business** state — how much was
sold, what's pending approval. This one shows **system** state — is the system itself healthy,
fast, and reliable.

The requirement that distinguishes this issue from the earlier ones: **dashboards must be readable
by someone who did not build the system.** A dashboard the author understands but nobody else can
interpret under pressure is not actually observability — it's a private reference. This gets tested
directly, not assumed.

**SLOs are the number that turns "is the system reliable enough" from a feeling into a decision.**
An error budget converts a vague sense of "things have felt shaky lately" into a specific,
spendable quantity — and, per this issue's own requirement, it gets reviewed in every retrospective
going forward, which means it needs to be agreed with a business stakeholder now, not defined
unilaterally by engineering and then imposed.

## User Story

As an Engineering Lead,
I want observability dashboards anyone can read, and SLOs that turn reliability into a trackable number,
So that the team has one place to see system health and a shared, agreed definition of "reliable enough."

## Acceptance Criteria

```gherkin
Given the System Health dashboard
When it is reviewed by someone who did not build the observability instrumentation
Then they can correctly interpret what it shows without needing it explained
```

```gherkin
Given the defined SLOs
When they are reviewed
Then each was agreed with a named business stakeholder, not set unilaterally by engineering
```

```gherkin
Given the current error budget for an SLO
When it is inspected
Then it reflects actual measured performance against the objective, calculated from Issue 094's metrics
```

```gherkin
Given the SLO review process
When a retrospective occurs (starting with this sprint's own)
Then error budget status is a standing agenda item
```

- [ ] System Health dashboard: uptime, error rate, request throughput, latency percentiles
- [ ] Application Performance dashboard: latency by endpoint, database query time, cache hit rate
- [ ] Background Processing dashboard: job success rate, queue depth, retry counts
- [ ] Business Activity dashboard: consolidating figures already exposed by Issues 028, 035, 042, 049, 056, 060 into one system-level view, rather than duplicating their logic
- [ ] Reliability dashboard: SLO attainment and remaining error budget
- [ ] SLIs instrumented from Issue 094's metrics
- [ ] SLOs defined and agreed with a named business stakeholder
- [ ] Error budget calculated and displayed
- [ ] Every dashboard reviewed for clarity by someone outside the observability build specifically
- [ ] SLO and error budget review added as a standing item to the retrospective process
- [ ] Alert catalogue (Issue 097) cross-referenced from the relevant dashboard, so a fired alert can be traced to its dashboard context

## Expected Result

The team has one place to see system health at a glance, readable by anyone, and a concrete,
business-agreed definition of what "reliable enough" means — tracked as a number, not a feeling.

---

## Scope

### Included

- System Health, Application Performance, Background Processing, Business Activity, and Reliability dashboards
- SLI instrumentation from existing metrics
- SLO definition with business agreement
- Error budget calculation and display
- Dashboard clarity review by an outside reader
- SLO review process integration into retrospectives

### Out of Scope

- New metric instrumentation beyond what Issue 094 already provides (this issue visualizes existing metrics, it doesn't add new ones)
- Predictive/anomaly-based dashboards
- Automated SLO-breach response (Issue 097 covers alerting; this issue covers visibility)

## Technical Requirements

**Dashboards**

```text
System Health
    Uptime (from Issue 096's readiness history), error rate,
    request throughput, latency percentiles (from Issue 094)

Application Performance
    Latency by endpoint, database query time (surfaced via Issue 095's traces),
    cache hit rate (Issue 077, Issue 094)

Background Processing
    Job success rate, queue depth, retry counts
    (Issue 062's report scheduling, Issue 066's notification dispatch)

Business Activity
    A system-level rollup, NOT a reimplementation — links out to or embeds
    the existing dashboards (Issues 028, 035, 042, 049, 056, 060) rather
    than duplicating their aggregation logic, avoiding yet another
    parallel implementation of figures that already exist elsewhere

Reliability
    SLI current values, SLO targets, and remaining error budget
```

**Service Level Objectives**

| SLI | SLO |
|-----|-----|
| Availability | 99.5% of requests succeed, measured monthly |
| Latency | 95% of API requests complete within Sprint 12's budget |
| Job success | 99% of background jobs succeed within retry limits |
| Notification delivery | 99% delivered within 5 minutes |

These are starting figures to agree, not fixed values — document who actually agreed the final
numbers and when.

**Error budget**

```text
errorBudget = 1 - SLO

e.g. Availability SLO 99.5%  →  0.5% error budget per month

Consumed budget tracked from Issue 094's actual measured metrics over
the SLO's measurement window; displayed as remaining budget, not just
current attainment, so the team can see how much room is left to spend
```

**Clarity review**

```text
Have someone who did not build the observability instrumentation
(ideally someone outside engineering, if practical, or at minimum a
different engineer) look at each dashboard cold and explain back what
it shows — any dashboard that fails this gets simplified or relabeled,
not defended as "it makes sense once you know the system"
```

**SLO review integration**

```text
Add "SLO attainment and error budget" as a standing agenda item to the
retrospective template (academy/07-templates/7-retrospective-template.md),
starting with this sprint's own retrospective — the phase overview
explicitly names this as an expected outcome of the sprint
```

## Dependencies

- Issue 093 — structured logs feed dashboard drill-down.
- Issue 094 — the metrics every SLI and most dashboard widgets are built from.
- Issue 095 — traces feed the Application Performance dashboard's query-time breakdown.
- Issue 097 — the alert catalogue this issue's dashboards cross-reference.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] All five dashboards implemented and accessible
- [ ] Business Activity dashboard links to or embeds existing module dashboards rather than duplicating their logic
- [ ] SLIs instrumented and SLOs defined
- [ ] SLOs confirmed agreed with a named business stakeholder
- [ ] Error budget calculated correctly from real metrics, verified against a manual calculation
- [ ] **Clarity review performed** by someone outside the observability build, with dashboards adjusted based on their feedback
- [ ] SLO review added to the retrospective template
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-15-monitoring-observability.md` § 6 |
| Epic | Monitoring & Observability |
| Visualizes | Issue 093, Issue 094, Issue 095 |
| Cross-references | Issue 097 (alerts) |
| Rolls up (without duplicating) | Issues 028, 035, 042, 049, 056, 060 |
| Retrospective template | `academy/07-templates/7-retrospective-template.md` |
| Pull Request | _to be linked_ |
