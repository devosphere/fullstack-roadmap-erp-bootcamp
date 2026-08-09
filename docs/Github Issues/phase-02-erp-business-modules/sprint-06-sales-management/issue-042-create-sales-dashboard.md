# [FEATURE] Create Sales Dashboard

<!-- GitHub title: [FEATURE] Create Sales Dashboard
     Labels: feature, sales, priority: medium
     Milestone: Sprint 06 - Sales Management
     Branch: feature/042-create-sales-dashboard
     Epic: Sales Management
     Depends on: 039, 040, 041
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [x] Feature
- [ ] Bug
- [ ] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [x] Medium
- [ ] High
- [ ] Critical

## Module: sales
## Sprint: Sprint 06 - Sales Management

---

## Summary

Build the sales dashboard: sales value, open orders, pending deliveries, unpaid invoices, top
products and customers, presented with date filtering and role-appropriate scoping.

## Background

Sales data now spans customers, quotations, orders, deliveries, and invoices. Answering "what is
outstanding?" means querying four of them.

The judgement call in this dashboard is **which figure counts as "sales"**. Confirmed order value,
delivered value, and invoiced value are three different numbers, and using them interchangeably is
how sales reports come to disagree with finance reports:

```text
Confirmed order value    what customers committed to buy
Delivered value          what actually shipped
Invoiced value           what was billed
```

Each is legitimate. The dashboard must label which one it shows rather than presenting an
unqualified "total sales". Sprint 08 will produce financial figures from the ledger, and if this
dashboard's definitions are vague, the two will appear to contradict each other.

As with the HR and inventory dashboards, aggregation goes in a dedicated service — Sprint 09
replaces these queries with read models.

## User Story

As a Sales Manager,
I want a dashboard showing sales performance and outstanding work,
So that I can see what has sold, what is pending delivery, and what remains unpaid.

## Acceptance Criteria

```gherkin
Given an authenticated sales manager
When they open the sales dashboard
Then sales value, open orders, pending deliveries, and unpaid invoices are displayed
```

```gherkin
Given the dashboard displays a sales value figure
When the figure is read
Then it is explicitly labelled as ordered, delivered, or invoiced value
```

```gherkin
Given a date range filter is applied
When the dashboard reloads
Then every time-based widget reflects only that range
```

```gherkin
Given the dashboard displays total invoiced value
When compared against the invoice records for the same period
Then the two agree exactly
```

```gherkin
Given a sales representative rather than a manager
When they open the dashboard
Then figures are scoped to their own orders only
```

- [ ] `GET /api/sales/dashboard` returns dashboard metrics
- [ ] `GET /api/sales/reports/by-customer` returns sales grouped by customer
- [ ] `GET /api/sales/reports/by-product` returns sales grouped by product
- [ ] Total ordered, delivered, and invoiced value displayed as distinct figures
- [ ] Each value figure explicitly labelled with its basis
- [ ] Open sales orders count and value displayed
- [ ] Pending deliveries displayed
- [ ] Unpaid invoices count and value displayed
- [ ] Overdue invoices highlighted
- [ ] Top selling products displayed
- [ ] Top customers by value displayed
- [ ] Sales trend over the date range displayed
- [ ] Quotation conversion rate displayed
- [ ] Date range filter applied to all time-based widgets
- [ ] Metrics scoped by role: manager sees all, representative sees their own
- [ ] Every figure reconciles with its source records
- [ ] Aggregation logic isolated in a dedicated service
- [ ] Metric definitions documented
- [ ] Loading, empty, and error states present
- [ ] Permissions declared and enforced

## Expected Result

Sales staff see performance and outstanding work on one page. Every value figure states what it
measures, so it can be reconciled against both the source documents and, later, the finance module.

---

## Scope

### Included

- Dashboard metrics endpoint
- Ordered, delivered, and invoiced value as distinct labelled figures
- Open orders, pending deliveries, unpaid and overdue invoices
- Top products and customers
- Sales trend over time
- Quotation conversion rate
- Date range filtering
- Role-based scoping
- Sales reports by customer and product
- Dedicated aggregation service
- Frontend dashboard with charts
- Metric definition documentation

### Out of Scope

- Cross-module KPIs such as gross margin and days sales outstanding (Sprint 09, Issue 059)
- Executive dashboard (Sprint 09, Issue 060)
- Report export (Sprint 09, Issue 061)
- Scheduled report delivery (Sprint 09, Issue 062)
- Sales forecasting and targets
- Commission calculation
- Query caching (Sprint 12, Issue 077)

## Technical Requirements

**Endpoints**

```text
GET /api/sales/dashboard?dateFrom=&dateTo=
GET /api/sales/reports/by-customer?dateFrom=&dateTo=
GET /api/sales/reports/by-product?dateFrom=&dateTo=
```

**Metrics**

| Metric | Definition |
|--------|-----------|
| Ordered Value | Sum of `totalAmount` for orders confirmed in the period, excluding cancelled |
| Delivered Value | Sum of delivered line values for deliveries in the period |
| Invoiced Value | Sum of `totalAmount` for invoices issued in the period, excluding cancelled |
| Open Orders | Count and value of orders with status Confirmed or Partially Delivered |
| Pending Deliveries | Order lines where `deliveredQuantity < quantity` on confirmed orders |
| Unpaid Invoices | Count and value of invoices with status Issued or Overdue |
| Overdue Invoices | Issued invoices where `dueDate < today` |
| Top Products | Products ranked by delivered quantity and value |
| Top Customers | Customers ranked by invoiced value |
| Sales Trend | Invoiced value grouped by day, week, or month across the range |
| Conversion Rate | Quotations converted ÷ quotations sent, for the period |

Document every formula. Sprint 09 must reproduce the same figures, and Sprint 08 must be able to
reconcile invoiced value against the general ledger.

**Labelling requirement**

No widget may display an unqualified "Total Sales". Each value tile states its basis — ordered,
delivered, or invoiced — in its label, not only in a tooltip.

**Role scoping**

```text
Sales Manager           → all orders and invoices
Sales Representative    → documents where createdBy is the current user
```

Applied in the query, not by filtering results afterwards.

**Structure**

```text
backend/src/modules/sales/dashboard/
├── sales-dashboard.controller.ts
└── sales-dashboard.service.ts       all aggregation lives here
```

**Performance note**

Top-products and trend widgets join orders, deliveries, and invoices across a date range. Measure
their query cost during development and record it — a named input to Sprint 12, Issue 075.

**Frontend**

```text
frontend/src/features/sales/dashboard/
```

Reuse the shared chart, stat, and table components from the HR and inventory dashboards.

**Permissions to add**

```text
SALES_DASHBOARD_READ_ALL
SALES_DASHBOARD_READ_OWN
```

## Dependencies

- Issue 039 — sales orders.
- Issue 040 — deliveries.
- Issue 041 — invoices.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for each metric calculation
- [ ] Integration test confirming invoiced value reconciles with invoice records
- [ ] Integration test confirming delivered value reconciles with delivery records
- [ ] Test confirming ordered, delivered, and invoiced values are calculated independently
- [ ] Test confirming representative scoping returns only their own documents
- [ ] Frontend test confirming every value tile carries an explicit basis label
- [ ] Frontend component tests including loading and empty states
- [ ] Query cost measured and recorded for Sprint 12 reference
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and metric definitions updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-06-sales-management.md` § 7 |
| Epic | Sales Management |
| Reconciled against | Issue 056 (financial reporting, Sprint 08) |
| Superseded by | Issues 057, 059 (Sprint 09) |
| Pull Request | _to be linked_ |
