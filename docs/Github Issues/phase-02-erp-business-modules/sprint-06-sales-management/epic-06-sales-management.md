# [EPIC] Sales Management

<!-- GitHub title: [EPIC] Sales Management
     Labels: epic, sales
     Milestone: Sprint 06 - Sales Management
     Branch: none — epics are not worked on directly
     Create this epic AFTER issues 036-042 exist, then replace the placeholder
     numbers in the task list below with the real GitHub issue numbers.
     Copy everything below this comment into the issue body. -->

## Module: sales
## Sprint: Sprint 06 - Sales Management

---

## Purpose

Build the order-to-cash capability: customers, pricing, quotations, sales orders, delivery, and
invoicing.

```text
Managing Business Resources

        ↓

Selling Business Resources
```

## Business Value

Sales is the first module that generates revenue rather than recording internal operations. It is
also the first module that **consumes** another module's data at runtime: every delivery reduces
the stock recorded in Sprint 05.

That makes this epic the first real test of cross-module consistency. A delivery that succeeds
while its stock deduction fails leaves the company believing it holds goods it has already shipped.

## Issues

- [ ] #36 Create Customer Management Module
- [ ] #37 Implement Price List Management
- [ ] #38 Create Sales Quotation Module
- [ ] #39 Create Sales Order Module
- [ ] #40 Implement Order Fulfillment and Inventory Deduction
- [ ] #41 Implement Sales Invoicing
- [ ] #42 Create Sales Dashboard

## Document Chain

```text
Customer

    ↓

SalesQuotation  →  SalesOrder  →  Delivery  →  SalesInvoice

                        ↓             ↓

                 SalesOrderLine   StockMovement

                        ↓             ↓

                     Product      Inventory
```

Each document links to the one it came from. Traceability runs the full length of the chain.

## Epic Acceptance Criteria

- [ ] All child issues closed
- [ ] Customers and pricing maintained
- [ ] Quotations convert to orders exactly once
- [ ] Sales orders numbered automatically with enforced status transitions
- [ ] Delivery reduces inventory through the Issue 033 movement service
- [ ] Delivery and stock deduction succeed or fail together
- [ ] Partial delivery supported; over-delivery rejected
- [ ] Invoices reflect delivered quantities with correct due dates
- [ ] Stock ledger still reconciles after sales activity
- [ ] Release v0.7.0 published

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-06-sales-management.md` |
| Phase overview | `academy/08-sprints/phase-02-erp-business-modules/phase-overview.md` |
| Depends on | Issues 032, 033 (inventory and stock movement) |
| Feeds | Issue 053 (accounts receivable, Sprint 08) |
| Release | v0.7.0 |
