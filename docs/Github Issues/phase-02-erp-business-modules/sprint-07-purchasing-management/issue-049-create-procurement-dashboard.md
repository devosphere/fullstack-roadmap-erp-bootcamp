# [FEATURE] Create Procurement Dashboard

<!-- GitHub title: [FEATURE] Create Procurement Dashboard
     Labels: feature, procurement, priority: medium
     Milestone: Sprint 07 - Purchasing Management
     Branch: feature/049-create-procurement-dashboard
     Epic: Purchasing Management
     Depends on: 044, 045, 046, 047, 048
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

## Module: procurement
## Sprint: Sprint 07 - Purchasing Management

---

## Summary

Build the procurement dashboard: spend totals, pending approvals, open orders, pending receipts,
and held invoices, giving procurement staff and approvers visibility across the whole chain.

## Background

Procurement data now spans requisitions, approvals, orders, receipts, and invoices — five stages,
each built in this sprint. Two things matter most operationally and both deserve prominence: what
is waiting for **my** approval, and what invoices are **held** and need a decision.

Unlike the sales dashboard's "which value counts as sales" question, procurement has an equally
important ambiguity: **spend** can mean requisitioned (estimated), ordered (committed), or invoiced
(actual). The three numbers are legitimately different and must be labelled, or this dashboard will
appear to disagree with the sales dashboard's own labelling discipline from Issue 042 — and,
eventually, with the accounts payable figures in Sprint 08.

As with every dashboard so far, aggregation goes in a dedicated service that Sprint 09 will replace
with read models and Sprint 12 will optimize.

## User Story

As a Procurement Officer,
I want a dashboard showing spend, pending approvals, and held invoices,
So that I can act on what needs attention without querying five modules separately.

## Acceptance Criteria

```gherkin
Given an authenticated procurement officer
When they open the procurement dashboard
Then spend totals, pending approvals, open orders, pending receipts, and held invoices are displayed
```

```gherkin
Given the dashboard displays a spend figure
When the figure is read
Then it is explicitly labelled as requisitioned, ordered, or invoiced
```

```gherkin
Given an approver with pending requisitions assigned to them
When they open the dashboard
Then their own pending approvals are shown prominently
```

```gherkin
Given held supplier invoices exist
When the dashboard loads
Then they are listed with the reason they are held
```

```gherkin
Given the dashboard displays total invoiced value
When compared against supplier invoice records for the same period
Then the two agree exactly
```

- [ ] `GET /api/procurement/dashboard` returns dashboard metrics
- [ ] Requisitioned, ordered, and invoiced spend displayed as distinct labelled figures
- [ ] Pending approvals for the current user displayed prominently
- [ ] Open purchase orders count and value displayed
- [ ] Pending receipts displayed
- [ ] Held supplier invoices listed with their hold reason
- [ ] Spend by supplier displayed
- [ ] Spend by product category displayed
- [ ] Average requisition-to-order cycle time displayed
- [ ] Date range filter applied to all time-based widgets
- [ ] Metrics scoped by role: procurement sees all, requester sees their own requisitions
- [ ] Every figure reconciles with its source records
- [ ] Aggregation logic isolated in a dedicated service
- [ ] Metric definitions documented
- [ ] Loading, empty, and error states present
- [ ] Permissions declared and enforced

## Expected Result

Procurement staff and approvers see spend and outstanding work on one page. Every spend figure
states what it measures, matching the labelling discipline established by the sales dashboard.

---

## Scope

### Included

- Dashboard metrics endpoint
- Requisitioned, ordered, and invoiced spend as distinct labelled figures
- Pending approvals, open orders, pending receipts, held invoices
- Spend by supplier and category
- Cycle time metric
- Date range filtering
- Role-based scoping
- Dedicated aggregation service
- Frontend dashboard with charts
- Metric definition documentation

### Out of Scope

- Cross-module KPIs (Sprint 09, Issue 059)
- Executive dashboard (Sprint 09, Issue 060)
- Report export (Sprint 09, Issue 061)
- Scheduled report delivery (Sprint 09, Issue 062)
- Supplier performance scoring
- Query caching (Sprint 12, Issue 077)

## Technical Requirements

**Endpoint**

```text
GET /api/procurement/dashboard?dateFrom=&dateTo=
```

**Metrics**

| Metric | Definition |
|--------|-----------|
| Requisitioned Spend | Sum of `totalEstimatedAmount` for requisitions submitted in the period |
| Ordered Spend | Sum of `totalAmount` for purchase orders issued in the period, excluding cancelled |
| Invoiced Spend | Sum of `totalAmount` for supplier invoices with status Approved in the period |
| Pending Approvals | Count of `RequisitionApproval` rows with status Pending, for the current user |
| Open Purchase Orders | Count and value of orders with status Issued or Partially Received |
| Pending Receipts | Order lines where `receivedQuantity < quantity` on issued orders |
| Held Invoices | Count and value of supplier invoices with matchStatus Held |
| Spend by Supplier | Invoiced spend grouped by supplier |
| Spend by Category | Invoiced spend grouped by product category, using the descendant-inclusive query from Issue 030 |
| Requisition-to-Order Cycle Time | Average time from requisition submission to purchase order issue |

Document every formula. Sprint 08 must be able to reconcile invoiced spend against accounts
payable.

**Labelling requirement**

No widget may display an unqualified "Total Spend". Each figure states its basis — requisitioned,
ordered, or invoiced — matching the discipline established for the sales dashboard in Issue 042.

**Role scoping**

```text
Procurement Officer   → all requisitions, orders, and invoices
Employee (requester)  → their own requisitions only, via /api/procurement/requisitions/me
Approver               → their own pending approvals, regardless of role
```

The pending-approvals widget is personal to every user who holds any approval authority, not only
procurement staff.

**Structure**

```text
backend/src/modules/procurement/dashboard/
├── procurement-dashboard.controller.ts
└── procurement-dashboard.service.ts     all aggregation lives here
```

**Held invoices widget**

Surface the specific mismatch — quantity, price, or both — using the `matchNotes` recorded in
Issue 048, not just a count. This is the widget procurement will act on first.

**Frontend**

```text
frontend/src/features/procurement/dashboard/
```

Reuse the shared chart, stat, and table components from the HR, inventory, and sales dashboards.

**Permissions to add**

```text
PROCUREMENT_DASHBOARD_READ_ALL
PROCUREMENT_DASHBOARD_READ_OWN
```

## Dependencies

- Issue 044 — requisitions.
- Issue 045 — approvals.
- Issue 046 — purchase orders.
- Issue 047 — goods receipts.
- Issue 048 — supplier invoices and match status.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for each metric calculation
- [ ] Integration test confirming invoiced spend reconciles with supplier invoice records
- [ ] Test confirming requisitioned, ordered, and invoiced spend are calculated independently
- [ ] Test confirming pending approvals are scoped to the current user
- [ ] Test confirming held invoices display their specific mismatch reason
- [ ] Frontend test confirming every spend tile carries an explicit basis label
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
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-07-purchasing-management.md` § 7 |
| Epic | Purchasing Management |
| Reconciled against | Issue 054 (accounts payable, Sprint 08) |
| Superseded by | Issues 057, 059 (Sprint 09) |
| Pull Request | _to be linked_ |
