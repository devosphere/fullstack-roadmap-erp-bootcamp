# [FEATURE] Implement Payment Processing

<!-- GitHub title: [FEATURE] Implement Payment Processing
     Labels: feature, finance, priority: high
     Milestone: Sprint 08 - Finance & Accounting
     Branch: feature/055-implement-payment-processing
     Epic: Finance & Accounting
     Depends on: 051, 053, 054
     Blocks: 056
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

## Module: finance
## Sprint: Sprint 08 - Finance & Accounting

---

## Summary

Record customer payments received and supplier payments made, apply them against one or more open
receivables or payables, support partial payment, and post the corresponding journal entry for
every payment.

## Background

A payment is where money actually moves, and it is the point where three separate figures must
agree: the amount recorded as paid, the amount applied to specific invoices, and the amount posted
to the ledger. This issue is the one place all three come together.

**Application, not just recording.** A payment of 30,000 might settle one invoice, or partially
settle two. The link between a payment and the receivables or payables it reduces has to be its own
record — `PaymentApplication` — because a single payment can apply against multiple items, and a
single item can be settled by multiple payments over time.

**Partial payment is the normal case, not the exception**, exactly as it was for delivery in Issue
040 and receipt in Issue 047. The outstanding amount reduces by whatever was applied; the item stays
open until it reaches zero.

**Every payment posts its own journal entry.** Receiving cash from a customer is itself a financial
event distinct from the receivable being reduced — both must be visible in the ledger.

## User Story

As an Accounts Receivable Clerk,
I want to record customer payments and apply them to specific invoices,
So that receivables and payables reflect what has actually been settled.

## Acceptance Criteria

```gherkin
Given an open receivable of 45,000
When a customer payment of 45,000 is recorded and applied to it
Then the receivable's outstanding amount becomes 0 and its status becomes Settled
```

```gherkin
Given an open receivable of 45,000
When a payment of 20,000 is applied to it
Then the outstanding amount becomes 25,000 and the status remains Partially Paid
```

```gherkin
Given a receivable with an outstanding amount of 10,000
When a payment application of 15,000 is attempted against it
Then the request is rejected
```

```gherkin
Given a single payment of 50,000
When it is applied across two invoices of 30,000 and 20,000
Then both invoices are fully settled and the payment's applied total equals 50,000
```

```gherkin
Given a recorded payment
When its journal entry is inspected
Then it is balanced and correctly reflects a customer or supplier payment
```

```gherkin
Given a posted payment
When a user attempts to delete it
Then the request is rejected — corrections are made by reversal
```

- [ ] `POST /api/finance/payments` records a payment
- [ ] `GET /api/finance/payments` lists payments with filtering
- [ ] `GET /api/finance/payments/{id}` returns a payment with its applications
- [ ] `POST /api/finance/payments/{id}/apply` applies a payment to a receivable or payable
- [ ] `POST /api/finance/payments/{id}/reverse` reverses a payment
- [ ] Payments support both customer (receivable-reducing) and supplier (payable-reducing) types
- [ ] A payment can apply to one or more receivables or payables
- [ ] Applied amount cannot exceed the target's outstanding amount
- [ ] Applied amount cannot exceed the payment's own unapplied balance
- [ ] Full application settles the item and closes it
- [ ] Partial application reduces the outstanding amount and keeps the item open
- [ ] Every payment posts its own balanced journal entry
- [ ] Payment application and journal posting happen in one transaction
- [ ] Payments are immutable once posted; corrections are reversals
- [ ] Payment method and reference number recorded
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Every payment is recorded once, applied precisely to what it settles, and reflected correctly in
the ledger. Receivables and payables always show the true outstanding balance after every payment.

---

## Scope

### Included

- Payment recording for both customer and supplier payments
- Multi-target application with partial payment
- Application and journal posting as one transaction
- Immutability and reversal
- Payment method and reference tracking
- Permission enforcement
- ERD update

### Out of Scope

- Financial statement reporting (Issue 056)
- Payment gateway or bank integration
- Foreign exchange and multi-currency payments
- Early payment discounts
- Bounced payment / NSF handling beyond a manual reversal

## Technical Requirements

**Endpoints**

```text
POST   /api/finance/payments
GET    /api/finance/payments
GET    /api/finance/payments/{id}
POST   /api/finance/payments/{id}/apply
POST   /api/finance/payments/{id}/reverse
```

**Schema**

```text
Payment

id
paymentNumber       unique
paymentType         enum: CUSTOMER_RECEIPT | SUPPLIER_PAYMENT
partyId             → Customer or Supplier depending on paymentType
paymentDate
amount              decimal
appliedAmount       decimal, sum of its PaymentApplication rows
method              enum: CASH | BANK_TRANSFER | CHECK | CARD
reference
journalEntryId      → JournalEntry
status              enum: POSTED | REVERSED
createdBy           → User
createdAt

PaymentApplication

id
paymentId           → Payment
receivableId        → Receivable, nullable
payableId           → Payable, nullable
appliedAmount        decimal

check (receivableId is not null) != (payableId is not null)  -- exactly one target
```

**Application transaction**

```text
BEGIN

  1. Validate appliedAmount <= target.outstandingAmount
  2. Validate appliedAmount <= (payment.amount - payment.appliedAmount)
  3. Insert PaymentApplication
  4. Reduce target.outstandingAmount by appliedAmount
  5. If target.outstandingAmount = 0, set target.status = SETTLED
     else set target.status = PARTIALLY_PAID
  6. Increase payment.appliedAmount

COMMIT
```

**Recording transaction**

Recording a payment posts its own entry at the same time:

```text
Customer receipt:
    Debit  Cash (1300)                 amount
    Credit Accounts Receivable (1100)  amount    -- offset by application, not the recording itself

Supplier payment:
    Debit  Accounts Payable (2100)     amount
    Credit Cash (1300)                 amount
```

Recording and the first application (when supplied at creation) happen in one transaction with the
journal post — the same all-or-nothing requirement used for every cross-module operation in this
programme.

**Immutability and reversal**

Posted payments are never edited. Reversal creates an opposite journal entry (via Issue 051's
reversal) and reopens whatever outstanding amount the payment had settled.

**Payment numbering**

```text
PMT-YYYY-NNNNN        e.g. PMT-2026-00674
```

**Permissions to add**

```text
PAYMENT_CREATE
PAYMENT_READ
PAYMENT_APPLY
PAYMENT_REVERSE
```

## Dependencies

- Issue 051 — the posting service.
- Issue 053 — receivables to apply against.
- Issue 054 — payables to apply against.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for over-application rejection against both the target and the payment balance
- [ ] Unit tests for full and partial settlement status transitions
- [ ] Test confirming a single payment splitting across two invoices settles both correctly
- [ ] Test confirming the posted journal entry matches the payment type and amount
- [ ] **Atomicity test**: a failing journal post leaves no payment or application recorded
- [ ] Test confirming posted payments reject every field update
- [ ] Test confirming reversal reopens the correct outstanding amount
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
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-08-finance-accounting.md` § 6 |
| Epic | Finance & Accounting |
| Applies against | Issue 053 (receivables), Issue 054 (payables) |
| Posts through | Issue 051 |
| Pull Request | _to be linked_ |
