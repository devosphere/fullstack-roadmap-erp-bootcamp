# [FEATURE] Implement Sales Invoicing

<!-- GitHub title: [FEATURE] Implement Sales Invoicing
     Labels: feature, sales, priority: high
     Milestone: Sprint 06 - Sales Management
     Branch: feature/041-implement-sales-invoicing
     Epic: Sales Management
     Depends on: 040
     Blocks: 042
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

## Module: sales
## Sprint: Sprint 06 - Sales Management

---

## Summary

Implement sales invoicing: generate invoices from delivered quantities, calculate due dates from
customer payment terms, and enforce immutability once issued.

## Background

An invoice is a financial claim, not a sales record. That distinction sets the rules here.

**Invoice what was delivered, not what was ordered.** Billing an order of 100 units when only 60
shipped is a dispute, and in many jurisdictions a compliance problem. The invoice draws its
quantities from the delivery records created in Issue 040.

**An issued invoice is immutable.** Once sent to a customer it exists outside the system — in their
accounting, possibly in a tax filing. Editing it silently means two parties hold different versions
of the same document. Corrections are credit notes, not edits.

This is also the last sales issue before finance. In Sprint 08, issuing an invoice will additionally
create a receivable and post a journal entry (Issue 053). The invoice model built here needs to
carry enough information for that, which is why the due date and totals are stored rather than
derived at read time.

## User Story

As an Accounts Receivable Clerk,
I want invoices generated from delivered goods with correct due dates,
So that customers are billed accurately and payment is expected on the agreed terms.

## Acceptance Criteria

```gherkin
Given a sales order with 60 of 100 units delivered
When an invoice is generated from the delivery
Then the invoice covers 60 units, not 100
```

```gherkin
Given a customer with payment terms of 30 days and an invoice dated 1 March
When the invoice is issued
Then its due date is 31 March
```

```gherkin
Given an issued invoice
When a user attempts to edit its lines or amounts
Then the request is rejected
```

```gherkin
Given a delivery that has already been fully invoiced
When another invoice is attempted for the same delivery
Then the request is rejected
```

```gherkin
Given an issued invoice
When it is cancelled
Then its status becomes Cancelled and the underlying delivery becomes invoiceable again
```

```gherkin
Given an invoice covering multiple deliveries for one order
When the invoice total is calculated
Then it equals the sum of the delivered line values
```

- [ ] `POST /api/sales/invoices` creates a draft invoice from one or more deliveries
- [ ] `GET /api/sales/invoices` lists invoices with filtering
- [ ] `GET /api/sales/invoices/{id}` returns an invoice with lines
- [ ] `PUT /api/sales/invoices/{id}` updates a draft invoice
- [ ] `POST /api/sales/invoices/{id}/issue` issues an invoice
- [ ] `POST /api/sales/invoices/{id}/cancel` cancels an invoice with a reason
- [ ] `GET /api/customers/{id}/invoices` lists a customer's invoices
- [ ] Invoice number generated automatically and unique
- [ ] Invoice lines derived from delivered quantities only
- [ ] A delivery cannot be invoiced twice
- [ ] Multiple deliveries can be combined into one invoice for the same customer
- [ ] Unit prices copied from the sales order line, not re-resolved
- [ ] Due date calculated as invoice date plus customer payment terms
- [ ] Line and document totals calculated and stored
- [ ] Only Draft invoices are editable
- [ ] Issued invoices are immutable
- [ ] Cancellation makes the underlying deliveries invoiceable again
- [ ] Overdue detection based on due date
- [ ] Order status advances to Invoiced when fully invoiced
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Customers are invoiced for exactly what they received, with due dates matching their agreed terms.
Once issued, an invoice cannot change, so the system's copy and the customer's copy always agree.

---

## Scope

### Included

- Invoice creation from deliveries
- Multi-delivery consolidation
- Duplicate invoicing prevention
- Due date calculation from payment terms
- Line and document total calculation
- Status lifecycle and immutability after issue
- Cancellation with delivery release
- Overdue detection
- Order status advancement
- Permission enforcement
- ERD update

### Out of Scope

- Accounts receivable and journal posting (Sprint 08, Issue 053)
- Payment recording and settlement (Sprint 08, Issue 055)
- Credit notes and returns
- Invoice PDF generation and emailing
- Tax calculation and tax reporting
- Aging reports (Sprint 08, Issue 053)
- Dunning and payment reminders (Sprint 10, Issue 066)

## Technical Requirements

**Endpoints**

```text
POST   /api/sales/invoices
GET    /api/sales/invoices
GET    /api/sales/invoices/{id}
PUT    /api/sales/invoices/{id}
POST   /api/sales/invoices/{id}/issue
POST   /api/sales/invoices/{id}/cancel
GET    /api/customers/{id}/invoices
```

**Schema**

```text
SalesInvoice

id
invoiceNumber        unique
customerId           → Customer
salesOrderId         → SalesOrder
invoiceDate
dueDate
status               enum
subtotal             decimal
discountTotal        decimal
totalAmount          decimal
notes
issuedBy             → User, nullable
issuedAt             nullable
cancelledReason      nullable
createdAt
updatedAt

SalesInvoiceLine

id
salesInvoiceId       → SalesInvoice
deliveryLineId       → DeliveryLine, unique
productId            → Product
quantity
unitPrice            decimal
discountAmount       decimal
lineTotal            decimal
lineNumber
```

The unique constraint on `deliveryLineId` is what prevents double invoicing — enforced by the
database, not only by application logic.

**Status flow**

```text
DRAFT → ISSUED → PAID

DRAFT  → CANCELLED
ISSUED → CANCELLED
ISSUED → OVERDUE → PAID
```

`PAID` is set by Sprint 08 payment processing, not by this issue. `OVERDUE` is derived from
`dueDate` rather than stored as a transition, so it cannot go stale.

**Due date calculation**

```text
dueDate = invoiceDate + customer.paymentTermsDays
```

Copied onto the invoice at creation. If the customer's terms change later, existing invoices keep
the terms that applied when they were issued.

**Invoice numbering**

```text
INV-YYYY-NNNNN       e.g. INV-2026-00891
```

Generated server-side with a sequence or locked counter.

**Price source**

Unit prices are copied from the sales order line, not re-resolved from the price list. The customer
agreed to the order's price; a price list change between order and invoice must not alter what they
are billed.

**Immutability**

Once `status = ISSUED`, no field except status may change. Enforce in the service layer, and add a
test that attempts an update and asserts rejection.

**Permissions to add**

```text
SALES_INVOICE_READ
SALES_INVOICE_CREATE
SALES_INVOICE_ISSUE
SALES_INVOICE_CANCEL
```

Grant `SALES_INVOICE_ISSUE` narrowly — issuing creates a financial claim.

## Dependencies

- Issue 040 — deliveries provide the invoiceable quantities.
- Issue 036 — customer payment terms.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for due date calculation including month and year boundaries
- [ ] Unit tests for total calculation across multiple deliveries
- [ ] Test confirming a delivery line cannot be invoiced twice, enforced at the constraint
- [ ] Test confirming issued invoices reject every field update
- [ ] Test confirming invoiced quantity never exceeds delivered quantity
- [ ] Test confirming cancellation makes deliveries invoiceable again
- [ ] Test confirming prices come from the order line, not the current price list
- [ ] Test confirming concurrent invoice numbering produces no duplicates
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
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-06-sales-management.md` § 6 |
| Epic | Sales Management |
| Invoices quantities from | Issue 040 (deliveries) |
| Feeds | Issue 053 (accounts receivable, Sprint 08) |
| Pull Request | _to be linked_ |
