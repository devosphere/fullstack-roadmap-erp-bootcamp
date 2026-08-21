# [FEATURE] Implement Accounts Receivable

<!-- GitHub title: [FEATURE] Implement Accounts Receivable
     Labels: feature, finance, sales, priority: high
     Milestone: Sprint 08 - Finance & Accounting
     Branch: feature/053-implement-accounts-receivable
     Epic: Finance & Accounting
     Depends on: 041, 052
     Blocks: 055
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

Automatically create a receivable and post a journal entry whenever a sales invoice is issued, and
provide aging visibility into what customers currently owe.

## Background

This is the first automatic posting in the system, and it is triggered by a module outside finance:
issuing a sales invoice in Issue 041 must create a receivable here without the sales module knowing
anything about accounting.

That boundary matters. Sales calls a finance service — `createReceivableFromInvoice` — and finance
owns everything about what that means in accounting terms: which accounts, which amounts, which
journal lines. If sales tried to construct the journal entry itself, every future accounting rule
change would require touching the sales module.

The posting itself is the simplest possible entry:

```text
Debit   Accounts Receivable    invoice total
Credit  Sales Revenue          invoice total
```

The transactional requirement is identical to every cross-module operation in this programme so
far: the receivable and the journal entry succeed together or not at all, because a receivable with
no corresponding ledger entry — or the reverse — is a books-don't-balance defect that is very hard
to find later.

## User Story

As an Accounts Receivable Clerk,
I want a receivable and journal entry created automatically when a sales invoice is issued,
So that revenue and what customers owe are always recorded consistently, without manual entry.

## Acceptance Criteria

```gherkin
Given a sales invoice for 45,000 is issued
When the issue action completes
Then a receivable for 45,000 exists and a balanced journal entry has been posted
```

```gherkin
Given the journal posting step fails during invoice issuance
When the transaction completes
Then no receivable exists and the invoice remains unissued
```

```gherkin
Given a receivable with an original amount of 45,000
When a partial payment of 20,000 is later applied (Issue 055)
Then the outstanding amount becomes 25,000 and the receivable remains open
```

```gherkin
Given open receivables at various ages
When the aging report is requested
Then each receivable is bucketed correctly by days overdue
```

- [ ] Issuing a sales invoice (Issue 041) automatically creates a receivable
- [ ] Issuing a sales invoice automatically posts a balanced journal entry
- [ ] Receivable and journal posting occur in one transaction with invoice issuance
- [ ] Receivable amount equals the invoice total exactly
- [ ] `GET /api/finance/receivables` lists receivables with filtering
- [ ] `GET /api/finance/receivables/{id}` returns a receivable
- [ ] `GET /api/finance/receivables/aging` returns the aging report
- [ ] `GET /api/customers/{id}/statement` returns a customer statement
- [ ] Aging buckets calculated from the invoice due date, not the invoice date
- [ ] Outstanding amount decreases only through payment application (Issue 055)
- [ ] A receivable closes only when its outstanding amount reaches zero
- [ ] Receivable links back to its source sales invoice
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Every issued sales invoice produces a receivable and a correct journal entry automatically. Nobody
enters this manually, and it cannot happen partially.

---

## Scope

### Included

- Automatic receivable creation triggered by invoice issuance
- Automatic, transactional journal posting
- Receivable query and aging endpoints
- Customer statement endpoint
- Aging bucket calculation
- Permission enforcement
- ERD update

### Out of Scope

- Accounts payable — the mirror for suppliers (Issue 054)
- Payment recording and application (Issue 055)
- Financial statement reporting (Issue 056)
- Credit notes and invoice cancellation posting
- Bad debt write-off
- Multi-currency receivables

## Technical Requirements

**Endpoints**

```text
GET /api/finance/receivables
GET /api/finance/receivables/{id}
GET /api/finance/receivables/aging
GET /api/customers/{id}/statement
```

**Schema**

```text
Receivable

id
customerId          → Customer
salesInvoiceId       → SalesInvoice, unique
invoiceDate
dueDate
originalAmount       decimal
outstandingAmount    decimal
status               enum: OPEN | PARTIALLY_PAID | SETTLED
journalEntryId       → JournalEntry
createdAt
updatedAt
```

The unique constraint on `salesInvoiceId` prevents a second receivable ever being created for the
same invoice — matching the one-time-conversion pattern used throughout the programme.

**Trigger point**

Modify Issue 041's `issue` action to call, within its own transaction:

```text
financeService.createReceivableFromInvoice(salesInvoice)

    1. Post via the Issue 051 service:
         Debit  Accounts Receivable (1100)   invoiceTotal
         Credit Sales Revenue (4100)          invoiceTotal
    2. Create the Receivable row referencing the new journal entry
```

If either step fails, the whole `issue` action — including the invoice status change — rolls back.
The sales module calls one finance service method; it never constructs journal lines itself.

**Aging buckets**

```text
Current          dueDate has not passed
1-30 days        1-30 days past dueDate
31-60 days       31-60 days past dueDate
61-90 days       61-90 days past dueDate
90+ days         more than 90 days past dueDate
```

Calculated from `dueDate`, which Issue 041 already derived from the customer's payment terms —
this issue does not recompute payment terms.

**Outstanding amount**

Never edited directly. It changes only through the payment application service that Issue 055
implements, which this issue's service interface must expose:

```text
applyPayment(receivableId, amount)
    → rejects if amount > outstandingAmount
    → reduces outstandingAmount, updates status
```

**Permissions to add**

```text
RECEIVABLE_READ
```

Creation and updates are system-triggered, not directly exposed via a write endpoint.

## Dependencies

- Issue 041 — sales invoices, the trigger for receivable creation.
- Issue 052 — the ledger, since this posts through Issue 051's service and the result must be
  visible in the ledger.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for aging bucket calculation at each boundary
- [ ] **Atomicity test**: a failing journal post leaves the invoice unissued and no receivable created
- [ ] Test confirming the posted entry is exactly Debit Receivable / Credit Revenue for the invoice total
- [ ] Test confirming a second receivable cannot be created for the same invoice
- [ ] Integration test confirming receivable creation is visible in the Issue 052 ledger immediately
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
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-08-finance-accounting.md` § 4 |
| Epic | Finance & Accounting |
| Triggered by | Issue 041 (sales invoice issue) |
| Posts through | Issue 051 |
| Settled by | Issue 055 |
| Pull Request | _to be linked_ |
