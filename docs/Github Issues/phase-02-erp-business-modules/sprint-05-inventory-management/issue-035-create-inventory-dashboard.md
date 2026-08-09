# [FEATURE] Create Inventory Dashboard

<!-- GitHub title: [FEATURE] Create Inventory Dashboard
     Labels: feature, inventory, priority: medium
     Milestone: Sprint 05 - Inventory Management
     Branch: feature/035-create-inventory-dashboard
     Epic: Inventory Management
     Depends on: 032, 033
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

## Module: inventory
## Sprint: Sprint 05 - Inventory Management

---

## Summary

Build the inventory dashboard: stock totals, low-stock alerts, warehouse distribution, recent
movements, and adjustment activity, presented so inventory staff can act on them.

## Background

Inventory data is now spread across products, warehouses, balances, movements, and adjustments.
Answering "what needs reordering?" currently means querying several of them.

The most operationally valuable widget is low stock. Everything else is context; that one prompts
action. It should be prominent and accurate rather than buried among totals.

As with the HR dashboard in Issue 028, aggregation belongs in a dedicated service. These queries
scan the movement table, which is the fastest-growing table in the system — they are a named target
for the read models in Sprint 09 and the optimization work in Sprint 12.

Dashboards also need a stated point of view on freshness. Stock changes constantly; a figure with
no timestamp invites someone to act on a number that was true ten minutes ago.

## User Story

As an Inventory Manager,
I want a dashboard showing stock levels and recent activity,
So that I can spot low stock and unusual movement without running manual queries.

## Acceptance Criteria

```gherkin
Given an authenticated inventory user
When they open the inventory dashboard
Then stock totals, low-stock items, warehouse distribution, and recent movements are displayed
```

```gherkin
Given products at or below their reorder level
When the dashboard loads
Then those products are listed with current available quantity and reorder level
```

```gherkin
Given the dashboard displays total stock quantity
When the figure is compared against the inventory records
Then the two agree exactly
```

```gherkin
Given a warehouse filter is applied
When the dashboard reloads
Then every widget reflects only that warehouse
```

```gherkin
Given the dashboard is displayed
When a user reads any figure
Then the time the data was generated is visible
```

- [ ] `GET /api/inventory/dashboard` returns dashboard metrics
- [ ] Total products and total stock quantity displayed
- [ ] Low-stock items listed with available quantity and reorder level
- [ ] Out-of-stock items listed separately
- [ ] Stock distribution by warehouse displayed
- [ ] Stock distribution by product category displayed
- [ ] Recent stock movements displayed
- [ ] Pending inventory adjustments count displayed
- [ ] Movement volume over a date range displayed
- [ ] Warehouse filter applied to all widgets
- [ ] Date range filter applied to time-based widgets
- [ ] Data generation timestamp displayed
- [ ] Every figure reconciles with its source records
- [ ] Aggregation logic isolated in a dedicated service
- [ ] Loading, empty, and error states present
- [ ] Permissions declared and enforced
- [ ] Metric definitions documented

## Expected Result

Inventory staff open one page and see what needs attention. Low stock is prominent, every figure
matches the underlying records, and the data's age is visible.

---

## Scope

### Included

- Dashboard metrics endpoint
- Stock totals and distribution
- Low-stock and out-of-stock lists
- Recent movement activity
- Pending adjustment count
- Warehouse and date filtering
- Data freshness indicator
- Dedicated aggregation service
- Frontend dashboard with charts
- Metric definition documentation

### Out of Scope

- Cross-module KPIs such as inventory turnover (Sprint 09, Issue 059)
- Executive dashboard (Sprint 09, Issue 060)
- Report export (Sprint 09, Issue 061)
- Automatic reorder triggering or purchase requisition creation
- Low-stock notifications (Sprint 10, Issue 066)
- Query caching (Sprint 12, Issue 077)
- Inventory valuation (Sprint 08)

## Technical Requirements

**Endpoint**

```text
GET /api/inventory/dashboard?warehouseId=&dateFrom=&dateTo=
```

**Metrics**

| Metric | Definition |
|--------|-----------|
| Total Products | Count of products with status Active |
| Total Stock Quantity | Sum of `quantityOnHand` across all inventory rows in scope |
| Low Stock Items | Products where `quantityAvailable <= reorderLevel` and `> 0` |
| Out of Stock Items | Products where `quantityAvailable = 0` |
| Stock by Warehouse | Sum of `quantityOnHand` grouped by warehouse |
| Stock by Category | Sum of `quantityOnHand` grouped by product category |
| Recent Movements | Most recent stock movements, limited and paginated |
| Movement Volume | Count and quantity of movements grouped by type over the date range |
| Pending Adjustments | Count of adjustments with status Pending |

Document each formula so Sprint 09 reproduces the same figures in the reporting layer.

**Low stock definition**

Low stock compares **available**, not on-hand. Stock already reserved for confirmed orders is not
available to sell, so a product with 50 on hand and 48 reserved is low even if its reorder level is
20.

**Structure**

```text
backend/src/modules/inventory/dashboard/
├── inventory-dashboard.controller.ts
└── inventory-dashboard.service.ts      all aggregation lives here
```

One service, for the same reason as Issue 028: Sprint 09 replaces these queries with read models
and Sprint 12 optimizes them.

**Performance note**

The movement volume widget scans `StockMovement`, which grows with every transaction. Measure its
query cost during development and record the figure — it is a named input to Sprint 12, Issue 075.

**Frontend**

```text
frontend/src/features/inventory/dashboard/
```

Reuse the shared chart, stat, and table components introduced by the HR dashboard rather than
creating inventory-specific variants.

**Permissions to add**

```text
INVENTORY_DASHBOARD_READ
```

## Dependencies

- Issue 032 — inventory balances.
- Issue 033 — stock movements.
- Issue 034 — pending adjustment counts. If 034 is not yet merged, omit that widget and add it in a
  follow-up rather than blocking this issue.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for each metric calculation
- [ ] Unit test confirming low stock uses available, not on-hand
- [ ] Integration test confirming every metric reconciles with its source records
- [ ] Test confirming the warehouse filter scopes every widget
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
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-05-inventory-management.md` § 7 |
| Epic | Inventory Management |
| Superseded by | Issues 057, 059 (Sprint 09 reporting read models) |
| Optimized by | Issues 076, 077 (Sprint 12) |
| Pull Request | _to be linked_ |
