# [FEATURE] Implement Cross-Module KPIs

<!-- GitHub title: [FEATURE] Implement Cross-Module KPIs
     Labels: feature, backend, priority: high
     Milestone: Sprint 09 - Reporting & Analytics
     Branch: feature/059-implement-cross-module-kpis
     Epic: Reporting & Analytics
     Depends on: 057, 058
     Blocks: 060
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
## Sprint: Sprint 09 - Reporting & Analytics

---

## Summary

Calculate business KPIs that span multiple modules — gross margin, inventory turnover, days sales
outstanding, and others — each with a documented formula and a comparison against the previous
period.

## Background

Every dashboard so far reports on its own module. A KPI is different: it is a single number whose
formula genuinely requires data from two or more modules, and getting it wrong is easy to do
silently, because the number still looks plausible.

Gross margin is the clearest example. It needs sales revenue (Sales) and cost of goods sold
(Inventory, via Finance's posted COGS entries). Compute it from the wrong source — say, the sales
order value instead of the invoiced value that Issue 042 was careful to distinguish — and the
figure is subtly wrong in a way nobody notices until finance's own numbers disagree with it.

That is why every KPI in this issue must **reconcile with the module-level dashboard it draws
from**. Gross margin's revenue component must match Issue 042's invoiced value; its COGS component
must match figures derivable from Issue 056. A KPI that cannot be traced back to an existing,
already-tested figure is not trustworthy just because the formula looks reasonable.

## User Story

As a Business Owner,
I want to see key performance indicators that draw from multiple modules,
So that I can understand overall business health, not just one department's activity.

## Acceptance Criteria

```gherkin
Given a KPI definition for gross margin
When it is calculated for a period
Then the revenue component matches the invoiced value from the sales dashboard for that period
```

```gherkin
Given a KPI is requested with a comparison period
When the response is returned
Then it includes both the current value and the percentage change from the prior period
```

```gherkin
Given the KPI catalogue
When a KPI's definition is inspected
Then its formula and source modules are documented and retrievable via the API
```

```gherkin
Given inventory turnover is calculated
When compared to a manual calculation from the same underlying inventory and sales data
Then the two values match
```

- [ ] `GET /api/analytics/kpis` lists available KPIs with their definitions
- [ ] `GET /api/analytics/kpis/{kpiCode}` returns a KPI's current value for a period
- [ ] Monthly Revenue KPI implemented, sourced from Finance
- [ ] Gross Margin KPI implemented, sourced from Sales and Finance
- [ ] Inventory Turnover KPI implemented, sourced from Inventory and Sales
- [ ] Days Sales Outstanding KPI implemented, sourced from Sales and Finance
- [ ] Spend by Supplier KPI implemented, sourced from Procurement and Finance
- [ ] Order Fulfillment Rate KPI implemented, sourced from Sales and Inventory
- [ ] Headcount and Attrition KPI implemented, sourced from HR
- [ ] Every KPI has a documented formula and named source modules
- [ ] Every KPI returns a value and a percentage comparison against the previous period
- [ ] Every KPI's figure reconciles with the equivalent module-level dashboard figure
- [ ] KPI calculation isolated in a dedicated service per KPI, not scattered across the reporting module
- [ ] Permissions declared and enforced

## Expected Result

Business-level KPIs are available with documented, auditable formulas, and every one of them
reconciles with the module dashboard it draws from — so the executive view and the departmental
view never contradict each other.

---

## Scope

### Included

- KPI catalogue endpoint
- The seven listed KPI calculations
- Period comparison
- Formula documentation
- Reconciliation with existing module dashboards
- Dedicated per-KPI calculation services
- Permission enforcement

### Out of Scope

- Executive dashboard visualization (Issue 060)
- Export and scheduling (Issues 061, 062)
- KPI target-setting and alerting
- Custom, user-defined KPIs
- Forecasting and trend projection

## Technical Requirements

**Endpoints**

```text
GET /api/analytics/kpis
GET /api/analytics/kpis/{kpiCode}?dateFrom=&dateTo=&compare=true
```

**Schema**

```text
KpiDefinition

id
kpiCode              unique
name
formula              human-readable description
unit                 e.g. "currency", "percent", "days", "ratio"
sourceModules         array, e.g. ["sales", "finance"]
comparisonPeriod      enum: PREVIOUS_PERIOD | PREVIOUS_YEAR
```

**KPI formulas**

```text
Monthly Revenue
    = SUM(SalesInvoice.totalAmount) where status = ISSUED, for the period
    ── must equal Issue 042's "Invoiced Value" for the same period

Gross Margin
    = (Revenue - COGS) / Revenue × 100
    Revenue = Monthly Revenue (above)
    COGS    = SUM of posted Cost of Goods Sold journal lines (Issue 054's expense postings) for the period

Inventory Turnover
    = COGS for the period / Average Inventory Value for the period
    Average Inventory Value = (opening + closing inventory value) / 2

Days Sales Outstanding
    = (Average Accounts Receivable / Total Credit Sales) × days in period
    ── must reconcile with Issue 053's aging totals

Spend by Supplier
    = SUM(Payable.originalAmount) grouped by supplier, for the period
    ── must equal Issue 049's "Invoiced Spend" figure per supplier

Order Fulfillment Rate
    = deliveredQuantity / orderedQuantity × 100, aggregated for the period
    ── must equal figures derivable from Issue 042's ordered/delivered distinction

Headcount and Attrition
    = active employee count at period end;
      attrition = terminations during the period / average headcount × 100
    ── must reconcile with Issue 028's HR dashboard figures
```

**Reconciliation requirement**

Each KPI's implementation must include an integration test that computes the same figure two ways
— once through the KPI service, once through the equivalent existing dashboard service or
financial report — and asserts they are equal on seeded data. This is the test that catches a
silently wrong formula before it reaches a business owner.

**Comparison period**

```text
value            the KPI for the requested date range
previousValue    the KPI for the immediately preceding period of equal length
percentChange    (value - previousValue) / previousValue × 100
```

**Structure**

```text
backend/src/modules/reporting/kpis/
├── kpi.controller.ts
├── kpi-catalogue.service.ts
└── calculators/
    ├── monthly-revenue.calculator.ts
    ├── gross-margin.calculator.ts
    ├── inventory-turnover.calculator.ts
    ├── days-sales-outstanding.calculator.ts
    ├── spend-by-supplier.calculator.ts
    ├── order-fulfillment-rate.calculator.ts
    └── headcount-attrition.calculator.ts
```

One calculator per KPI keeps each formula independently testable and independently reconcilable.

**Permissions to add**

```text
KPI_READ
```

## Dependencies

- Issue 057 — the read models each KPI queries.
- Issue 058 — the report execution and permission pattern this issue follows.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for each KPI's formula
- [ ] **Reconciliation test per KPI**: the KPI value matches the equivalent existing dashboard or report figure on identical seeded data
- [ ] Unit tests for period comparison calculation
- [ ] Integration tests for the catalogue and KPI endpoints
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and formula documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-09-reporting-analytics.md` § 3 |
| Epic | Reporting & Analytics |
| Reconciled against | Issues 028, 035, 042, 049, 053, 056 |
| Consumed by | Issue 060 (executive dashboard) |
| Pull Request | _to be linked_ |
