# [FEATURE] Implement Supplier Invoice Three-Way Match

<!-- GitHub title: [FEATURE] Implement Supplier Invoice Three-Way Match
     Labels: feature, procurement, priority: high
     Milestone: Sprint 07 - Purchasing Management
     Branch: feature/048-implement-supplier-invoice-three-way-match
     Epic: Purchasing Management
     Depends on: 043, 046, 047
     Blocks: 049
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

## Module: procurement
## Sprint: Sprint 07 - Purchasing Management

---

## Summary

Record supplier invoices against purchase orders and validate them automatically with a three-way
match: purchase order, goods receipt, and invoice must agree on quantity and price before payment
can be authorized.

## Background

This issue closes the control chain the sprint has been building:

```text
Was the purchase requested and approved?      Issue 045

Did we actually receive the goods?            Issue 047

Does the supplier invoice match both?         This issue
```

Paying an invoice without this check means paying for quantities never ordered, prices never
agreed, or goods never received. The three-way match is the standard defence, and it is entirely
mechanical: compare three documents that already exist in the system and flag disagreement.

The key design decision is **tolerance**. A match that requires exact equality will hold on every
invoice with a rounding difference of a few cents, generating false holds that train staff to
approve past them. A tolerance that is too wide misses real discrepancies. The tolerance is
therefore configurable and applied consistently, not judged case by case.

A held invoice can still be approved — but only through a documented override that leaves a record
of who overrode the system's check and why. The check should slow down the wrong invoice, not
silently block correct ones.

## User Story

As an Accounts Payable Clerk,
I want supplier invoices automatically checked against the purchase order and goods received,
So that payment is only authorized for what was actually ordered and delivered.

## Acceptance Criteria

```gherkin
Given a purchase order for 100 units at 50 each, fully received
When a supplier invoice for 100 units at 50 each is matched
Then the match passes and the invoice status becomes Approved
```

```gherkin
Given a purchase order for 100 units received in full
When a supplier invoice for 120 units is matched
Then the match fails on quantity and the invoice is placed on hold
```

```gherkin
Given a purchase order price of 50 per unit and a configured tolerance of 2 percent
When a supplier invoice arrives at 50.75 per unit
Then the match passes because the difference is within tolerance
```

```gherkin
Given a purchase order price of 50 per unit and a configured tolerance of 2 percent
When a supplier invoice arrives at 55 per unit
Then the match fails on price and the invoice is placed on hold
```

```gherkin
Given an invoice on hold
When an authorized user overrides it with a documented reason
Then the invoice is approved and the override is recorded
```

```gherkin
Given an invoice quantity that exceeds what has actually been received
When the match runs
Then it fails regardless of what the purchase order allows
```

- [ ] `POST /api/procurement/invoices` records a supplier invoice against a purchase order
- [ ] `GET /api/procurement/invoices` lists supplier invoices with filtering
- [ ] `GET /api/procurement/invoices/{id}` returns an invoice with match results
- [ ] `POST /api/procurement/invoices/{id}/match` runs or re-runs the three-way match
- [ ] `POST /api/procurement/invoices/{id}/override` approves a held invoice with a required reason
- [ ] Invoice number captured along with the supplier's own reference
- [ ] Invoice lines reference purchase order lines
- [ ] Quantity match compares invoiced quantity against received quantity, not ordered quantity
- [ ] Price match compares invoiced unit price against the purchase order price within tolerance
- [ ] Tolerance percentage configurable
- [ ] Match discrepancies reported per line with the expected and actual values
- [ ] Matching invoices approved automatically
- [ ] Mismatched invoices placed on hold automatically
- [ ] Held invoices require a documented override to approve
- [ ] Override records who approved it, when, and why
- [ ] Due date calculated from supplier payment terms
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Every supplier invoice is checked against what was ordered and received before it can be approved.
Discrepancies are visible with specifics, and any exception requires a documented decision rather
than a silent approval.

---

## Scope

### Included

- Supplier invoice recording against a purchase order
- Three-way match logic: quantity and price
- Configurable tolerance
- Automatic approval on match, automatic hold on mismatch
- Documented override for held invoices
- Due date calculation from supplier terms
- Match result reporting per line
- Permission enforcement
- ERD update

### Out of Scope

- Accounts payable and journal posting (Sprint 08, Issue 054)
- Payment execution (Sprint 08, Issue 055)
- Procurement dashboard (Issue 049)
- Currency conversion
- Tax validation
- Multi-invoice matching against one purchase order beyond the basic case

## Technical Requirements

**Endpoints**

```text
POST   /api/procurement/invoices
GET    /api/procurement/invoices
GET    /api/procurement/invoices/{id}
POST   /api/procurement/invoices/{id}/match
POST   /api/procurement/invoices/{id}/override
```

**Schema**

```text
SupplierInvoice

id
invoiceNumber          unique, internal
supplierReference      the supplier's own invoice number
supplierId             → Supplier
purchaseOrderId        → PurchaseOrder
invoiceDate
dueDate
matchStatus            enum: PENDING | MATCHED | HELD
status                 enum: DRAFT | APPROVED | HELD | CANCELLED
totalAmount            decimal
overriddenBy           → User, nullable
overrideReason         nullable
overriddenAt           nullable
createdAt
updatedAt

SupplierInvoiceLine

id
supplierInvoiceId      → SupplierInvoice
purchaseOrderLineId    → PurchaseOrderLine
productId              → Product
invoicedQuantity
invoicedUnitPrice      decimal
lineTotal              decimal
quantityMatch          boolean
priceMatch             boolean
matchNotes             nullable
lineNumber
```

**Match logic**

```text
For each invoice line:

  receivedQuantity = SUM(GoodsReceiptLine.acceptedQuantity)
                      for this purchaseOrderLineId

  quantityMatch = (invoicedQuantity <= receivedQuantity)

  expectedPrice = purchaseOrderLine.unitPrice
  priceDelta    = ABS(invoicedUnitPrice - expectedPrice) / expectedPrice

  priceMatch = (priceDelta <= toleranceConfig.percentValue)

  lineResult = quantityMatch AND priceMatch

invoice.matchStatus = MATCHED  if every line matches
                     = HELD    if any line fails
```

Quantity is checked against **received**, not ordered — an invoice for goods never received must
fail even if the purchase order technically allowed the quantity.

**Tolerance configuration**

```text
InvoiceMatchTolerance

id
tolerancePercent    decimal, e.g. 2.00
appliesTo           GLOBAL for now — per-supplier tolerance is a future extension
```

A single configurable value is enough for this issue; do not build per-supplier or per-category
tolerance now.

**Automatic status transition**

```text
matchStatus = MATCHED   → status = APPROVED   (automatically)
matchStatus = HELD      → status = HELD       (automatically)
```

**Override**

```text
POST /api/procurement/invoices/{id}/override

requires: reason (non-empty)

effect:
  status = APPROVED
  overriddenBy, overrideReason, overriddenAt set
  matchStatus remains HELD — the override does not rewrite the match result, only the decision
```

Keeping `matchStatus = HELD` after an override preserves the fact that this invoice failed
automatic matching, which matters for audit and for Sprint 11's review of financial controls.

**Permissions to add**

```text
SUPPLIER_INVOICE_CREATE
SUPPLIER_INVOICE_READ
SUPPLIER_INVOICE_OVERRIDE
```

Restrict `SUPPLIER_INVOICE_OVERRIDE` narrowly — it is the control that bypasses the control.

## Dependencies

- Issue 043 — suppliers.
- Issue 046 — purchase orders and their negotiated prices.
- Issue 047 — goods receipts and accepted quantities.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for quantity match against received quantity, not ordered quantity
- [ ] Unit tests for price match at, within, and outside tolerance boundaries
- [ ] Test confirming a matching invoice auto-approves
- [ ] Test confirming a mismatched invoice is auto-held
- [ ] Test confirming override requires a non-empty reason and records who approved it
- [ ] Test confirming override does not rewrite matchStatus
- [ ] Test confirming due date is calculated from supplier payment terms
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
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-07-purchasing-management.md` § 6 |
| Epic | Purchasing Management |
| Matches against | Issue 046 (order), Issue 047 (receipt) |
| Feeds | Issue 054 (accounts payable, Sprint 08) |
| Pull Request | _to be linked_ |
