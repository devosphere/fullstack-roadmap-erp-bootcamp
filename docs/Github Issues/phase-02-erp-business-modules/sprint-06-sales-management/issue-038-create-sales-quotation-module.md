# [FEATURE] Create Sales Quotation Module

<!-- GitHub title: [FEATURE] Create Sales Quotation Module
     Labels: feature, sales, priority: medium
     Milestone: Sprint 06 - Sales Management
     Branch: feature/038-create-sales-quotation-module
     Epic: Sales Management
     Depends on: 036, 037
     Blocks: 039
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

Create sales quotations: multi-line price offers to customers with calculated totals, a status
lifecycle, expiry handling, and one-time conversion into a sales order.

## Background

A quotation is the first **multi-line business document** in the system. Everything before it was a
single record; this introduces a header with lines, and totals that must always equal the sum of
those lines.

That pattern repeats four more times — sales orders, deliveries, purchase orders, and supplier
invoices — which makes the calculation and status-transition logic written here worth structuring
deliberately. Sprint 14 extracts it into a shared domain layer precisely because it will exist in
five places by then.

Two rules prevent the common defects:

- **Totals are stored, not computed on read.** A quotation sent to a customer must show the same
  figure a year later, even if the product price has changed since.
- **A quotation converts exactly once.** Without that guard, an accepted quotation can generate two
  orders and the customer receives double the goods.

Quotations are not commitments. Editing is allowed while `DRAFT`, and expiry closes stale offers
automatically rather than leaving them open indefinitely.

## User Story

As a Sales Representative,
I want to create quotations for customers and convert accepted ones into orders,
So that I can offer prices formally and turn agreements into orders without re-entering them.

## Acceptance Criteria

```gherkin
Given a draft quotation with two lines
When line quantities and prices are set
Then each line total and the document total are calculated and stored correctly
```

```gherkin
Given a quotation with status Sent
When a user attempts to edit its lines
Then the request is rejected because only Draft quotations are editable
```

```gherkin
Given an accepted quotation
When it is converted to a sales order
Then a sales order is created with the same lines and both documents are linked
```

```gherkin
Given a quotation that has already been converted
When a user attempts to convert it again
Then the request is rejected
```

```gherkin
Given a quotation whose valid-until date has passed
When a user attempts to accept it
Then the request is rejected because the quotation has expired
```

```gherkin
Given a line discount exceeding the product's maximum discount
When the line is saved
Then the request is rejected
```

- [ ] `GET /api/sales/quotations` lists quotations with filtering
- [ ] `POST /api/sales/quotations` creates a quotation
- [ ] `GET /api/sales/quotations/{id}` returns a quotation with lines
- [ ] `PUT /api/sales/quotations/{id}` updates a draft quotation
- [ ] `POST /api/sales/quotations/{id}/send` marks a quotation as sent
- [ ] `POST /api/sales/quotations/{id}/accept` accepts a quotation
- [ ] `POST /api/sales/quotations/{id}/reject` rejects a quotation with a reason
- [ ] `POST /api/sales/quotations/{id}/convert` converts to a sales order
- [ ] Document number generated automatically and unique
- [ ] Multiple product lines supported with add, edit, and remove
- [ ] Unit price resolved from the price list by quotation date
- [ ] Line total calculated as quantity × unit price, less discount
- [ ] Document total calculated as the sum of line totals
- [ ] Totals stored on the document, not computed on read
- [ ] Line discount validated against the product maximum
- [ ] Only Draft quotations are editable
- [ ] Status transitions enforced
- [ ] Expired quotations cannot be accepted
- [ ] A quotation can be converted only once
- [ ] Conversion links quotation and order in both directions
- [ ] Deactivated customers and products rejected
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

A sales representative builds a quotation, sends it, and converts it once when accepted. Totals are
correct and permanent, and the resulting order is traceable back to the offer.

---

## Scope

### Included

- Quotation CRUD with lines
- Automatic document numbering
- Price resolution from the price list
- Line and document total calculation
- Discount validation
- Status lifecycle and transition enforcement
- Expiry handling
- One-time conversion to a sales order
- Bidirectional document linking
- Permission enforcement
- ERD update

### Out of Scope

- Sales orders themselves (Issue 039)
- Delivery and invoicing (Issues 040, 041)
- PDF generation and emailing to customers
- Quotation revisions and versioning
- Approval workflow for large discounts (Sprint 10)
- Tax calculation

## Technical Requirements

**Endpoints**

```text
GET    /api/sales/quotations
POST   /api/sales/quotations
GET    /api/sales/quotations/{id}
PUT    /api/sales/quotations/{id}
POST   /api/sales/quotations/{id}/send
POST   /api/sales/quotations/{id}/accept
POST   /api/sales/quotations/{id}/reject
POST   /api/sales/quotations/{id}/convert
```

**Schema**

```text
SalesQuotation

id
quotationNumber     unique
customerId          → Customer
quotationDate
validUntil
status              enum
subtotal            decimal
discountTotal       decimal
totalAmount         decimal
notes
convertedOrderId    → SalesOrder, nullable
createdBy           → User
createdAt
updatedAt

SalesQuotationLine

id
quotationId         → SalesQuotation
productId           → Product
quantity
unitPrice           decimal, copied from the price list at creation
discountPercent     decimal
discountAmount      decimal
lineTotal           decimal
lineNumber
```

**Status flow**

```text
DRAFT → SENT → ACCEPTED → CONVERTED

DRAFT → SENT → REJECTED

DRAFT → SENT → EXPIRED

DRAFT → CANCELLED
```

Only `DRAFT` is editable. Only `ACCEPTED` can be converted. `EXPIRED`, `REJECTED`, and `CONVERTED`
are terminal.

**Calculation**

```text
lineTotal      = (quantity × unitPrice) - discountAmount
discountAmount = quantity × unitPrice × discountPercent / 100

subtotal       = SUM(quantity × unitPrice)
discountTotal  = SUM(discountAmount)
totalAmount    = subtotal - discountTotal
```

Recalculate and store on every line change. A test must assert `totalAmount` equals the sum of
`lineTotal` after every mutation.

**Document numbering**

```text
QT-YYYY-NNNNN        e.g. QT-2026-00042
```

Generated server-side with a database sequence or a locked counter — not by counting existing rows,
which races under concurrency.

**Conversion**

```text
1. Verify status is ACCEPTED
2. Verify convertedOrderId is null
3. Create SalesOrder with copied lines, prices, and discounts
4. Set quotation.convertedOrderId and status to CONVERTED
5. Set order.quotationId
```

All in one transaction. Step 2 is the guard that makes conversion idempotent.

**Expiry**

A quotation past `validUntil` cannot be accepted. Evaluate this at accept time rather than relying
on a background job, so correctness does not depend on a scheduler.

**Permissions to add**

```text
SALES_QUOTATION_READ
SALES_QUOTATION_CREATE
SALES_QUOTATION_UPDATE
SALES_QUOTATION_APPROVE
```

## Dependencies

- Issue 036 — customers must exist.
- Issue 037 — the price resolution service.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for line and document total calculation including discounts
- [ ] Test asserting document total always equals the sum of line totals
- [ ] Unit tests for every valid and invalid status transition
- [ ] Test confirming a quotation cannot be converted twice
- [ ] Test confirming expired quotations cannot be accepted
- [ ] Test confirming discount above the product maximum is rejected
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
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-06-sales-management.md` § 3 |
| Epic | Sales Management |
| Same document pattern as | Issues 039, 044, 046 |
| Consolidated by | Issue 089 (Sprint 14, shared domain layer) |
| Pull Request | _to be linked_ |
