# [EPIC] Reporting & Analytics

<!-- GitHub title: [EPIC] Reporting & Analytics
     Labels: epic, backend
     Milestone: Sprint 09 - Reporting & Analytics
     Branch: none — epics are not worked on directly
     Create this epic AFTER issues 057-062 exist, then replace the placeholder
     numbers in the task list below with the real GitHub issue numbers.
     Copy everything below this comment into the issue body. -->

## Module: backend
## Sprint: Sprint 09 - Reporting & Analytics

---

## Purpose

Build the decision-support layer that turns ERP transaction data into business insight: a
dedicated reporting architecture, cross-module KPIs, an executive dashboard, export, and
scheduling.

```text
Transactional Model            Analytical Model

Normalized                     Aggregated
Row-level access               Set-level access
Optimized for writes           Optimized for reads
```

## Business Value

Every module has its own dashboard, but none can answer a question that spans modules. Running
analytics directly against transactional tables is also the most common cause of ERP performance
collapse — this epic separates the two workloads before that becomes a production problem.

## Issues

- [ ] #57 Establish Reporting Architecture and Read Models
- [ ] #58 Implement Report Definitions and Parameters
- [ ] #59 Implement Cross-Module KPIs
- [ ] #60 Create Executive Dashboard
- [ ] #61 Implement Report Export
- [ ] #62 Implement Scheduled Reports

## Architecture

```text
HR   Inventory   Sales   Purchasing   Finance

        ↓ (read models, never written to directly)

Reporting Query Layer

        ↓

Report Definitions → KPIs → Executive Dashboard → Export / Schedule
```

## Epic Acceptance Criteria

- [ ] All child issues closed
- [ ] Reporting module isolated from transactional modules
- [ ] Read models defined per source module
- [ ] Report catalogue with parameter validation and permission enforcement
- [ ] KPIs reconcile with the module-level dashboards they summarize
- [ ] Executive dashboard with drill-down that preserves filters
- [ ] CSV and PDF export, large exports processed in the background
- [ ] Scheduled reports execute reliably with retry on failure
- [ ] Reporting queries do not degrade transactional endpoint performance
- [ ] Release v0.10.0 published

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-09-reporting-analytics.md` |
| Phase overview | `academy/08-sprints/phase-03-enterprise-capabilities/phase-overview.md` |
| Supersedes | Issues 028, 035, 042, 049, 056 (module dashboards) |
| Optimized by | Issue 077 (Sprint 12, caching) |
| Release | v0.10.0 |
