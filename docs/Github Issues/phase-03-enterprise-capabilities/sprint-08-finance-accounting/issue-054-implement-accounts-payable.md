# [FEATURE] Implement Accounts Payable

<!-- GitHub title: [FEATURE] Implement Accounts Payable
     Labels: feature, finance, procurement, priority: high
     Milestone: Sprint 08 - Finance & Accounting
     Branch: feature/054-implement-accounts-payable
     Epic: Finance & Accounting
     Depends on: 048, 052
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

Automatically create a payable and post a journal entry whenever a supplier invoice is approved
after passing the three-way match, and provide aging visibility into what the company owes.

## Background

This is the mirror of Issue 053, and its trigger point carries more weight than the sales side did.

A receivable is created when an invoice is *issued* — a low-risk action the company itself controls.
A payable, by contrast, must only be created when a supplier invoice is **approved**, which means it
already passed the three-way match built in Issue 048, or was explicitly overridden by an authorized
person. A payable created from an unmatched, unapproved invoice would commit the company to pay for
something the controls in Sprint 07 were specifically built to prevent.

The posting mirrors Issue 053 with the accounts reversed:

```text
Debit   Cost of Goods Sold / Expense   invoice total
Credit  Accounts Payable               invoice total
```

Same transactional requirement as every cross-module trigger in this programme: payable and journal
entry succeed together or not at all.

## User Story

As an Accounts Payable Clerk,
I want a payable and journal entry created automatically when a supplier invoice is approved,
So that what the company owes is always recorded consistently and only for invoices that passed procurement's controls.

## Acceptance Criteria

```gherkin
Given a supplier invoice that passes the three-way match and is auto-approved
When approval completes
Then a payable exists for the invoice total and a balanced journal entry has been posted
```

```gherkin
Given a supplier invoice that fails the match and is held
When the invoice remains on hold
Then no payable and no journal entry exist
```

```gherkin
Given a held supplier invoice is later approved via override
When the override completes
Then a payable and journal entry are created exactly as they would be for an automatic approval
```

```gherkin
Given the journal posting step fails during approval
When the transaction completes
Then no payable exists and the invoice's approval is not recorded
```

```gherkin
Given open payables at various ages
When the aging report is requested
Then each payable is bucketed correctly by days overdue
```

- [ ] Supplier invoice approval (Issue 048, automatic or override) automatically creates a payable
- [ ] Approval automatically posts a balanced journal entry
- [ ] Payable and journal posting occur in one transaction with invoice approval
- [ ] Held invoices never produce a payable
- [ ] Payable amount equals the invoice total exactly
- [ ] `GET /api/finance/payables` lists payables with filtering
- [ ] `GET /api/finance/payables/{id}` returns a payable
- [ ] `GET /api/finance/payables/aging` returns the aging report
- [ ] `GET /api/suppliers/{id}/statement` returns a supplier statement
- [ ] Aging buckets calculated from the invoice due date
- [ ] Outstanding amount decreases only through payment application (Issue 055)
- [ ] A payable closes only when its outstanding amount reaches zero
- [ ] Payable links back to its source supplier invoice
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Every approved supplier invoice — automatic or overridden — produces a payable and a correct
journal entry. No invoice on hold generates a financial obligation until someone explicitly decides
it should.

---

## Scope

### Included

- Automatic payable creation triggered by invoice approval, including override approval
- Automatic, transactional journal posting
- Payable query and aging endpoints
- Supplier statement endpoint
- Aging bucket calculation
- Permission enforcement
- ERD update

### Out of Scope

- Accounts receivable — the mirror for customers (Issue 053)
- Payment recording and application (Issue 055)
- Financial statement reporting (Issue 056)
- Expense account selection by purchase category (a single default expense account is assumed for now)
- Multi-currency payables

## Technical Requirements

**Endpoints**

```text
GET /api/finance/payables
GET /api/finance/payables/{id}
GET /api/finance/payables/aging
GET /api/suppliers/{id}/statement
```

**Schema**

```text
Payable

id
supplierId           → Supplier
supplierInvoiceId    → SupplierInvoice, unique
invoiceDate
dueDate
originalAmount       decimal
outstandingAmount    decimal
status               enum: OPEN | PARTIALLY_PAID | SETTLED
journalEntryId       → JournalEntry
createdAt
updatedAt
```

The unique constraint on `supplierInvoiceId` prevents a duplicate payable for the same invoice,
matching the pattern used throughout the programme.

**Trigger point**

Modify Issue 048's approval paths — both the automatic match-approval and the manual override — to
call, within the same transaction as the approval:

```text
financeService.createPayableFromInvoice(supplierInvoice)

    1. Post via the Issue 051 service:
         Debit  Cost of Goods Sold / Expense (5100)   invoiceTotal
         Credit Accounts Payable (2100)                invoiceTotal
    2. Create the Payable row referencing the new journal entry
```

Both approval paths in Issue 048 must call this same service method, so a payable is created
identically regardless of whether the invoice matched automatically or was overridden.

If either step fails, the whole approval action rolls back and the invoice remains on hold. The
procurement module calls one finance service method and never constructs journal lines itself.

**Aging buckets**

Identical structure to Issue 053:

```text
Current          1-30 days          31-60 days          61-90 days          90+ days
```

Calculated from `dueDate`, already derived by Issue 048 from the supplier's payment terms.

**Outstanding amount**

Never edited directly. Changes only through the payment application service Issue 055 implements,
exposed through this issue's service interface:

```text
applyPayment(payableId, amount)
    → rejects if amount > outstandingAmount
    → reduces outstandingAmount, updates status
```

**Permissions to add**

```text
PAYABLE_READ
```

Creation and updates are system-triggered, not directly exposed via a write endpoint.

## Dependencies

- Issue 048 — supplier invoice approval (automatic and override), the trigger for payable creation.
- Issue 052 — the ledger, since this posts through Issue 051's service.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for aging bucket calculation at each boundary
- [ ] **Atomicity test**: a failing journal post leaves the invoice's approval unrecorded and no payable created
- [ ] Test confirming the posted entry is exactly Debit Expense / Credit Payable for the invoice total
- [ ] Test confirming held invoices never produce a payable
- [ ] Test confirming both automatic approval and override approval produce an identical payable and posting
- [ ] Test confirming a second payable cannot be created for the same invoice
- [ ] Integration test confirming payable creation is visible in the Issue 052 ledger immediately
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
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-08-finance-accounting.md` § 5 |
| Epic | Finance & Accounting |
| Triggered by | Issue 048 (supplier invoice approval and override) |
| Posts through | Issue 051 |
| Mirror of | Issue 053 |
| Settled by | Issue 055 |
| Pull Request | _to be linked_ |
