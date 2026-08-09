# Sprint 09 - Reporting & Analytics

**Milestone:** Sprint 09 - Reporting & Analytics  
**Release:** v0.10.0  
**Phase:** Phase 03 - Enterprise Capabilities  
**Duration:** 3-4 Weeks  
**Sprint Spec:** `academy/08-sprints/phase-03-enterprise-capabilities/sprint-09-reporting-analytics.md`

---

# Milestone Definition

| Field | Value |
|-------|-------|
| Title | `Sprint 09 - Reporting & Analytics` |
| Due date | End of sprint |
| Description | Build the reporting architecture, cross-module KPIs, executive dashboard, and export/scheduling capability. Release v0.10.0. |

---

# Sprint Goal

Build a dedicated reporting architecture with read models, parameterized report definitions,
cross-module KPIs, an executive dashboard, report export, and scheduled delivery.

---

# Epic

**[Reporting & Analytics](epic-09-reporting-analytics.md)**

---

# Issue Roster

| # | File | GitHub Title | Type | Labels | Branch |
|---|------|--------------|------|--------|--------|
| 057 | [issue-057](issue-057-establish-reporting-architecture-and-read-models.md) | `[FEATURE] Establish Reporting Architecture and Read Models` | Feature | `feature`, `backend`, `priority: high` | `feature/057-establish-reporting-architecture-and-read-models` |
| 058 | [issue-058](issue-058-implement-report-definitions-and-parameters.md) | `[FEATURE] Implement Report Definitions and Parameters` | Feature | `feature`, `backend`, `priority: high` | `feature/058-implement-report-definitions-and-parameters` |
| 059 | [issue-059](issue-059-implement-cross-module-kpis.md) | `[FEATURE] Implement Cross-Module KPIs` | Feature | `feature`, `backend`, `priority: high` | `feature/059-implement-cross-module-kpis` |
| 060 | [issue-060](issue-060-create-executive-dashboard.md) | `[FEATURE] Create Executive Dashboard` | Feature | `feature`, `frontend`, `priority: high` | `feature/060-create-executive-dashboard` |
| 061 | [issue-061](issue-061-implement-report-export.md) | `[FEATURE] Implement Report Export` | Feature | `feature`, `backend`, `priority: medium` | `feature/061-implement-report-export` |
| 062 | [issue-062](issue-062-implement-scheduled-reports.md) | `[TASK] Implement Scheduled Reports` | Task | `task`, `backend`, `priority: medium` | `feature/062-implement-scheduled-reports` |

All six issues take **Milestone:** `Sprint 09 - Reporting & Analytics`.

---

# Dependency Order

```text
057 Reporting Architecture & Read Models

        ↓

058 Report Definitions & Parameters

        ↓

059 Cross-Module KPIs

        ↓

060 Executive Dashboard

        ↓

061 Report Export

        ↓

062 Scheduled Reports
```

Strictly sequential — each issue builds on the query layer and definitions established before it.

---

# Why This Sprint Exists

Every module built so far has its own dashboard: HR (Issue 028), Inventory (Issue 035), Sales
(Issue 042), Procurement (Issue 049), and Finance (Issue 056). None of them can answer a question
that spans modules — "which products generate the most revenue and the lowest stock turnover?"

This sprint does not replace those dashboards' underlying data. It replaces **how the data is
queried**: analytical questions move off the transactional tables and onto dedicated read models,
so heavy reporting queries stop competing with the live application for the same database
resources.

---

# What Gets Superseded

Every prior dashboard issue documented itself as superseded here. Issue 057's read models and
Issue 059's KPIs are expected to reproduce — and eventually replace — the aggregation logic in:

| Superseded dashboard service | From |
|---|---|
| `hr-dashboard.service.ts` | Issue 028 |
| `inventory-dashboard.service.ts` | Issue 035 |
| `sales-dashboard.service.ts` | Issue 042 |
| `procurement-dashboard.service.ts` | Issue 049 |
| Financial report queries | Issue 056 |

This sprint does not delete those services. It builds the architecture that will eventually let
them be retired — that consolidation is a candidate for Sprint 14's technical debt work.

---

# Sprint Definition of Done

- [ ] Reporting module isolated from transactional modules.
- [ ] Read models defined per source module with documented indexes.
- [ ] Report catalogue with validated parameters and enforced permissions.
- [ ] KPI formulas documented and reconciling with module-level dashboards.
- [ ] Executive dashboard with working drill-down.
- [ ] CSV and PDF export with background processing for large results.
- [ ] Scheduled reports executing and delivering reliably with retry.
- [ ] Reporting queries do not measurably degrade transactional endpoint performance.
- [ ] Documentation and ERD updated.
- [ ] Release v0.10.0 published.

---

# Release Notes Draft

```markdown
# v0.10.0

Reporting & Analytics Release

## Added

- Reporting architecture and read models
- Report definitions and parameters
- Cross-module KPIs
- Executive dashboard
- Report export (CSV, PDF)
- Scheduled reports
```
