# [FEATURE] Create Executive Dashboard

<!-- GitHub title: [FEATURE] Create Executive Dashboard
     Labels: feature, frontend, priority: high
     Milestone: Sprint 09 - Reporting & Analytics
     Branch: feature/060-create-executive-dashboard
     Epic: Reporting & Analytics
     Depends on: 058, 059
     Blocks: 061
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
## Sprint: Sprint 09 - Reporting & Analytics

---

## Summary

Build a single dashboard presenting the cross-module KPIs, trend charts, and top performers, with a
global date filter and drill-down from any KPI into its detailed report.

## Background

Five module dashboards already exist. This is the sixth, and it must behave differently from the
others: it is a **summary of summaries**, not another independent view.

The feature that makes it more than a KPI list is drill-down. A business owner looking at Gross
Margin dropping this month needs to get to the transactions behind it in one click — not open the
sales dashboard separately and re-apply the same date range by hand. Drill-down must therefore
carry the active filters forward into the Issue 058 report it opens, exactly as they were set on
the dashboard.

Role scoping here is simpler than in the module dashboards, because the executive dashboard is
inherently a summary view: what changes by role is which KPIs and widgets are visible, not how the
same widget's data is filtered per user.

## User Story

As a Business Owner,
I want a single dashboard showing key metrics across the whole business,
So that I can assess overall performance without visiting five separate module dashboards.

## Acceptance Criteria

```gherkin
Given an authenticated user with dashboard access
When they open the executive dashboard
Then KPI tiles, trend charts, and top-performer widgets are displayed
```

```gherkin
Given a global date range is set on the dashboard
When any widget renders
Then it reflects that same date range
```

```gherkin
Given a user clicks a KPI tile
When the detailed report opens
Then it opens with the same date range and filters active on the dashboard
```

```gherkin
Given a role without visibility into financial KPIs
When they open the dashboard
Then financial widgets are absent from the response, not merely hidden in the UI
```

- [ ] `GET /api/analytics/dashboard` returns the composed dashboard payload
- [ ] `GET /api/analytics/trends/revenue` returns a revenue trend series
- [ ] `GET /api/analytics/trends/spend` returns a spend trend series
- [ ] `GET /api/analytics/top/customers` returns top customers by value
- [ ] `GET /api/analytics/top/products` returns top products by value
- [ ] KPI summary tiles rendered for each KPI in Issue 059's catalogue the user can see
- [ ] Trend charts for revenue and spend over the selected range
- [ ] Top customers, products, and suppliers widgets
- [ ] Global date range filter applied to every widget
- [ ] Drill-down from a KPI tile opens the corresponding Issue 058 report with the same filters
- [ ] Widget visibility scoped server-side by the KPI's required permission
- [ ] Every visualization states its date range and unit explicitly
- [ ] Loading, empty, and error states present
- [ ] Permissions declared and enforced

## Expected Result

A business owner opens one page, sets a date range once, and sees the state of the business with
the ability to drill into any figure. Access to sensitive KPIs is enforced by the server, not the
client.

---

## Scope

### Included

- Dashboard composition endpoint
- Trend and top-performer endpoints
- KPI tile rendering with server-scoped visibility
- Trend charts
- Global date filtering across all widgets
- Drill-down that preserves filters into Issue 058 reports
- Loading, empty, and error states
- Permission enforcement

### Out of Scope

- Report export (Issue 061)
- Scheduled delivery (Issue 062)
- Custom, user-configurable dashboards
- Real-time or auto-refreshing widgets
- Mobile-specific layout

## Technical Requirements

**Endpoints**

```text
GET /api/analytics/dashboard?dateFrom=&dateTo=
GET /api/analytics/trends/revenue?dateFrom=&dateTo=&granularity=
GET /api/analytics/trends/spend?dateFrom=&dateTo=&granularity=
GET /api/analytics/top/customers?dateFrom=&dateTo=&limit=
GET /api/analytics/top/products?dateFrom=&dateTo=&limit=
```

**Dashboard composition**

```text
GET /api/analytics/dashboard returns:

  kpis: [ { kpiCode, name, value, unit, percentChange }, ... ]
        filtered server-side to KPIs whose requiredPermission the user holds

  trends: { revenue: [...], spend: [...] }

  topCustomers: [...]
  topProducts: [...]
```

Server-side filtering of the `kpis` array — not a client-side check on a flag — is what prevents a
user without financial visibility from ever receiving Gross Margin or Days Sales Outstanding in the
response payload.

**Drill-down mechanics**

Each KPI tile carries the `reportCode` of its Issue 058 equivalent (e.g. Gross Margin links to
`sales-by-product` or a dedicated margin report). Clicking it navigates to the report view with the
dashboard's active `dateFrom`/`dateTo` passed as query parameters, so the report opens already
scoped to what the user was looking at.

**Structure**

```text
frontend/src/features/analytics/
├── executive-dashboard/
├── trends/
└── top-performers/
```

Reuse the shared chart, stat tile, and table components established by every prior dashboard
(Issues 028, 035, 042, 049).

**Permissions to add**

```text
EXECUTIVE_DASHBOARD_READ
```

Individual KPI visibility is still governed by each `KpiDefinition.requiredPermission` from Issue
059 — this permission gates the dashboard page itself.

## Dependencies

- Issue 058 — report definitions, as drill-down targets.
- Issue 059 — the KPIs this dashboard displays.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for server-side KPI visibility filtering by permission
- [ ] Integration test confirming the dashboard payload omits KPIs the user cannot see
- [ ] Frontend test confirming drill-down passes the active date range to the target report
- [ ] Frontend component tests including loading and empty states
- [ ] Query cost of the composed dashboard endpoint measured and recorded for Sprint 12
- [ ] Denial tests for users without dashboard access
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-09-reporting-analytics.md` § 4 |
| Epic | Reporting & Analytics |
| Displays | Issue 059 (KPIs) |
| Drills into | Issue 058 (reports) |
| Pull Request | _to be linked_ |
