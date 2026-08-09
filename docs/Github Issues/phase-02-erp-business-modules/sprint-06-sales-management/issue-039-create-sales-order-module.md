# [FEATURE] Create Sales Order Module

<!-- GitHub title: [FEATURE] Create Sales Order Module
     Labels: feature, sales, priority: critical
     Milestone: Sprint 06 - Sales Management
     Branch: feature/039-create-sales-order-module
     Epic: Sales Management
     Depends on: 036, 037, 038
     Blocks: 040
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
- [ ] High
- [x] Critical

## Module: sales
## Sprint: Sprint 06 - Sales Management

---

## Summary

Create sales orders: confirmed customer commitments with multiple lines, automatic document
numbering, credit limit enforcement, stock reservation on confirmation, and an enforced status
lifecycle.

## Background

A quotation is an offer. A sales order is a **commitment** — the point at which the company promises
goods to a customer. That difference drives everything in this issue.

Confirmation is where two controls fire:

- **Credit limit.** The customer's outstanding commitment plus this order must not exceed the limit
  captured in Issue 036. This is the business's protection against selling to someone who cannot
  pay.
- **Stock reservation.** Confirming an order reserves stock through the service built in Issue 032.
  Without it, the same 150 units get promised to three customers and two of them are disappointed
  at delivery.

Reservation is why confirmation is a distinct action rather than a flag: it has side effects in
another module, and those side effects must be reversed if the order is cancelled.

Once confirmed, an order is not editable. A customer commitment that can be silently changed is not
a commitment. Changes are cancellations plus new orders.

## User Story

As a Sales Representative,
I want to confirm customer orders and have stock reserved automatically,
So that goods promised to a customer are actually available when we deliver.

## Acceptance Criteria

```gherkin
Given a draft sales order with available stock and the customer within their credit limit
When the order is confirmed
Then its status becomes Confirmed and stock is reserved for every line
```

```gherkin
Given a customer whose outstanding commitment plus this order exceeds their credit limit
When the order is confirmed
Then confirmation is rejected and no stock is reserved
```

```gherkin
Given a sales order line for a product with insufficient available stock
When the order is confirmed
Then confirmation is rejected and no line is reserved
```

```gherkin
Given a confirmed sales order
When a user attempts to edit its lines
Then the request is rejected
```

```gherkin
Given a confirmed sales order with no deliveries
When it is cancelled
Then the reserved stock is released
```

```gherkin
Given a confirmed sales order with at least one delivery
When a user attempts to cancel it
Then the request is rejected
```

- [ ] `GET /api/sales/orders` lists orders with filtering
- [ ] `POST /api/sales/orders` creates a draft order
- [ ] `GET /api/sales/orders/{id}` returns an order with lines
- [ ] `PUT /api/sales/orders/{id}` updates a draft order
- [ ] `POST /api/sales/orders/{id}/confirm` confirms the order
- [ ] `POST /api/sales/orders/{id}/cancel` cancels the order
- [ ] `GET /api/customers/{id}/orders` lists a customer's orders
- [ ] Document number generated automatically and unique
- [ ] Orders creatable directly or from an accepted quotation
- [ ] Multiple product lines with add, edit, and remove while draft
- [ ] Unit price resolved from the price list by order date
- [ ] Line and document totals calculated and stored
- [ ] Credit limit checked at confirmation
- [ ] Stock reserved for every line at confirmation, atomically
- [ ] Confirmation fails entirely if any line cannot be reserved
- [ ] Only Draft orders are editable
- [ ] Confirmed orders cannot be edited, only cancelled
- [ ] Cancellation releases reserved stock
- [ ] Orders with deliveries cannot be cancelled
- [ ] Status transitions enforced
- [ ] Deactivated customers and products rejected
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Confirmed orders represent real commitments backed by reserved stock and validated credit. An order
cannot promise goods the company does not have or extend credit beyond the agreed limit.

---

## Scope

### Included

- Sales order CRUD with lines
- Automatic document numbering
- Creation from a quotation
- Price resolution and total calculation
- Credit limit enforcement at confirmation
- Stock reservation at confirmation, atomically
- Stock release on cancellation
- Status lifecycle and transition enforcement
- Cancellation guards
- Permission enforcement
- ERD update

### Out of Scope

- Delivery and inventory deduction (Issue 040)
- Invoicing (Issue 041)
- Sales dashboard (Issue 042)
- Order approval workflow for large values (Sprint 10)
- Backorder handling for unavailable stock
- Tax calculation
- Accounts receivable (Sprint 08, Issue 053)

## Technical Requirements

**Endpoints**

```text
GET    /api/sales/orders
POST   /api/sales/orders
GET    /api/sales/orders/{id}
PUT    /api/sales/orders/{id}
POST   /api/sales/orders/{id}/confirm
POST   /api/sales/orders/{id}/cancel
GET    /api/customers/{id}/orders
```

**Schema**

```text
SalesOrder

id
orderNumber          unique
customerId           → Customer
quotationId          → SalesQuotation, nullable
warehouseId          → Warehouse
orderDate
requestedDeliveryDate
status               enum
subtotal             decimal
discountTotal        decimal
totalAmount          decimal
notes
createdBy            → User
confirmedBy          → User, nullable
confirmedAt          nullable
createdAt
updatedAt

SalesOrderLine

id
salesOrderId         → SalesOrder
productId            → Product
quantity
unitPrice            decimal
discountPercent      decimal
discountAmount       decimal
lineTotal            decimal
deliveredQuantity    integer, default 0
lineNumber
```

**Status flow**

```text
DRAFT → CONFIRMED → PARTIALLY_DELIVERED → DELIVERED → INVOICED → CLOSED

DRAFT     → CANCELLED
CONFIRMED → CANCELLED     only when no deliveries exist
```

**Document numbering**

```text
SO-YYYY-NNNNN        e.g. SO-2026-00317
```

Generated server-side with a sequence or locked counter, never by counting rows.

**Confirmation transaction**

All of these succeed, or none:

```text
1. Validate customer is active and within credit limit
2. For each line, reserve stock via the Issue 032 service
3. Set status to CONFIRMED, record confirmedBy and confirmedAt
```

If any line's reservation fails, the whole confirmation fails and no line stays reserved. This is
the property most worth a dedicated test.

**Credit limit check**

```text
outstandingCommitment = SUM(totalAmount) of the customer's orders
                        with status CONFIRMED, PARTIALLY_DELIVERED,
                        DELIVERED, or INVOICED, less amounts already settled

reject if outstandingCommitment + thisOrder.totalAmount > customer.creditLimit
```

A credit limit of zero means unlimited, and this should be documented rather than inferred.

**Cancellation**

```text
1. Verify no deliveries exist for the order
2. Release all reserved stock via the Issue 032 service
3. Set status to CANCELLED
```

In one transaction. Releasing stock without cancelling, or the reverse, leaves inventory wrong.

**Permissions to add**

```text
SALES_ORDER_READ
SALES_ORDER_CREATE
SALES_ORDER_UPDATE
SALES_ORDER_CONFIRM
SALES_ORDER_CANCEL
```

Grant `SALES_ORDER_CONFIRM` more narrowly than create — confirmation commits stock and credit.

## Dependencies

- Issue 036 — customers and credit limits.
- Issue 037 — price resolution.
- Issue 038 — quotations, for conversion.
- Issue 032 — the stock reservation service.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for total calculation and credit limit evaluation
- [ ] Unit tests for every valid and invalid status transition
- [ ] **Atomicity test**: confirmation where line 3 of 3 cannot be reserved leaves lines 1 and 2 unreserved
- [ ] Test confirming credit limit breach blocks confirmation and reserves nothing
- [ ] Test confirming cancellation releases exactly the reserved quantity
- [ ] Test confirming orders with deliveries cannot be cancelled
- [ ] Test confirming confirmed orders are not editable
- [ ] Test confirming concurrent document numbering produces no duplicates
- [ ] Integration tests for all endpoints
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-06-sales-management.md` § 4 |
| Epic | Sales Management |
| Reserves stock via | Issue 032 |
| Fulfilled by | Issue 040 |
| Pull Request | _to be linked_ |
