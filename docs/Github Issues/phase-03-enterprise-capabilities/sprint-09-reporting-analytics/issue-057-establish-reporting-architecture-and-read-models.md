# [FEATURE] Establish Reporting Architecture and Read Models

<!-- GitHub title: [FEATURE] Establish Reporting Architecture and Read Models
     Labels: feature, backend, priority: high
     Milestone: Sprint 09 - Reporting & Analytics
     Branch: feature/057-establish-reporting-architecture-and-read-models
     Epic: Reporting & Analytics
     Blocks: 058
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

Establish a dedicated reporting module, define read models for every source module, add the
indexes those read models need, and prove a measured performance baseline before anything is built
on top of it.

## Background

Every dashboard built so far — HR (Issue 028), Inventory (Issue 035), Sales (Issue 042),
Procurement (Issue 049), Finance (Issue 056) — queries transactional tables directly. That was the
right call at the time: each dashboard needed only its own module's data, and adding a separate
analytical layer for a single-module dashboard would have been premature.

Cross-module reporting removes that justification. A query that joins sales, inventory, and finance
data across a date range touches far more rows than any single-module dashboard, and it competes
for the same database connections and locks that transactional writes depend on. Left unaddressed,
this is the single most common way ERP systems degrade in production.

The fix is architectural, not just a bigger machine: **read models** — query-optimized views
assembled from one or more source modules — that the reporting layer queries exclusively.
Transactional services never read from them, and reporting services never write to transactional
tables. That separation is what every later issue in this sprint depends on.

## User Story

As a Backend Developer,
I want a reporting layer built on dedicated read models,
So that analytical queries never compete with or corrupt transactional data.

## Acceptance Criteria

```gherkin
Given the reporting module
When any of its services execute
Then no write occurs against a transactional table
```

```gherkin
Given a read model for sales performance
When it is queried
Then the result matches what the same data would show if queried directly from sales tables
```

```gherkin
Given the reporting query layer
When a query is issued
Then it uses the read models and their indexes, not raw joins across transactional tables
```

```gherkin
Given the read models are built
When a baseline query is measured
Then its response time and the resulting index plan are recorded
```

- [ ] `reporting` module created in the backend, isolated from feature modules
- [ ] Read model defined for sales performance (orders, deliveries, invoices)
- [ ] Read model defined for inventory (stock, movements, turnover)
- [ ] Read model defined for procurement (requisitions, orders, receipts, invoices)
- [ ] Read model defined for HR (headcount, attendance, leave)
- [ ] Read model defined for finance (ledger balances, receivables, payables)
- [ ] A query layer service exists that all reporting features must use
- [ ] Read models are rebuildable from source data and never edited directly
- [ ] Indexes added for the query patterns each read model supports
- [ ] Every added index documented with the query it supports
- [ ] Query performance baseline measured and recorded for at least one representative query per module
- [ ] Reporting queries verified not to hold long-running locks on transactional tables
- [ ] Architecture documented

## Expected Result

A reporting module exists that is architecturally incapable of writing to transactional data, has a
read model per source module, and has a measured performance baseline that later issues in this
sprint build against.

---

## Scope

### Included

- Reporting module scaffold
- Read model definitions for HR, inventory, sales, procurement, and finance
- Reporting query layer service
- Indexing for read model query patterns
- Performance baseline measurement
- Architecture documentation

### Out of Scope

- Report definitions and parameters (Issue 058)
- KPI calculation (Issue 059)
- Dashboard UI (Issue 060)
- Export and scheduling (Issues 061, 062)
- Materialized view refresh scheduling (a candidate for Sprint 12 if read performance requires it)
- Retiring the existing per-module dashboard services (a Sprint 14 candidate)

## Technical Requirements

**Module structure**

```text
backend/src/modules/reporting/
├── read-models/
│   ├── sales-performance.read-model.ts
│   ├── inventory.read-model.ts
│   ├── procurement.read-model.ts
│   ├── hr.read-model.ts
│   └── finance.read-model.ts
├── reporting-query.service.ts       every reporting feature queries through this
└── reporting.module.ts
```

**Read model approach**

Choose and document one of:

```text
Database view       simplest, always current, cost paid on every query
Materialized view    faster reads, requires a refresh strategy
Denormalized table    fastest reads, requires an explicit sync mechanism
```

A database view is the reasonable default for this issue's scope; document the choice in an ADR
and note that materialization is a Sprint 12 escalation path if the baseline measurement shows it
is needed.

**Read model example — sales performance**

```text
SalesPerformanceReadModel

orderId, orderDate, customerId, customerName,
productId, productName, categoryId,
orderedQuantity, deliveredQuantity, invoicedQuantity,
orderedValue, deliveredValue, invoicedValue
```

Assembled by joining `SalesOrder`, `SalesOrderLine`, `Delivery`, `DeliveryLine`, `SalesInvoice`,
and `SalesInvoiceLine` — the same distinction the Issue 042 dashboard already established between
ordered, delivered, and invoiced value.

**Isolation rule**

The reporting module has no write path into any table owned by another module. This is enforced by
code review and by a lint or architecture test that flags an import of a transactional write
service (`SalesOrderService.create`, etc.) from inside `modules/reporting/`.

**Baseline measurement**

For at least one representative query per read model, record:

```text
Response time (p50, p95) on a seeded dataset
Query plan (index scan vs. sequential scan)
Row count scanned vs. row count returned
```

This baseline is what Issue 058's parameterized reports and Sprint 12's optimization work both
measure against.

## Dependencies

None directly, but this issue reads from every module built through Sprint 08.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Architecture test confirming no transactional write import exists inside the reporting module
- [ ] Unit tests for the reporting query service
- [ ] Integration tests confirming each read model's output matches direct transactional queries on seeded data
- [ ] Query plans captured for at least one query per read model
- [ ] Baseline performance figures recorded and committed
- [ ] ADR written for the read model approach chosen
- [ ] Code review completed
- [ ] CI green
- [ ] Architecture documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-09-reporting-analytics.md` § 1 |
| Epic | Reporting & Analytics |
| Reads from | Every module through Sprint 08 |
| Consumed by | Issues 058, 059, 060 |
| Escalated by | Issue 076 (Sprint 12, if baseline is insufficient) |
| Pull Request | _to be linked_ |
