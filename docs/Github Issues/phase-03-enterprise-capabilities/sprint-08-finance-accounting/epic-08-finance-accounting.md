# [EPIC] Finance & Accounting

<!-- GitHub title: [EPIC] Finance & Accounting
     Labels: epic, finance
     Milestone: Sprint 08 - Finance & Accounting
     Branch: none — epics are not worked on directly
     Create this epic AFTER issues 050-056 exist, then replace the placeholder
     numbers in the task list below with the real GitHub issue numbers.
     Copy everything below this comment into the issue body. -->

## Module: finance
## Sprint: Sprint 08 - Finance & Accounting

---

## Purpose

Give every sales and purchasing transaction a correct, traceable financial consequence: a chart of
accounts, double-entry posting, a general ledger, receivables, payables, payments, and core
financial statements.

```text
Operational Transaction → Accounting Entry → General Ledger → Financial Statement
```

## Business Value

Sales and purchasing currently record business documents with no financial meaning. This epic
closes that gap. It is the first epic where a defect has real financial consequence: an unbalanced
ledger is not a cosmetic bug.

## Issues

- [ ] #50 Create Chart of Accounts
- [ ] #51 Implement Journal Entry Posting
- [ ] #52 Implement General Ledger
- [ ] #53 Implement Accounts Receivable
- [ ] #54 Implement Accounts Payable
- [ ] #55 Implement Payment Processing
- [ ] #56 Implement Financial Reporting

## Domain Model

```text
SalesInvoice (Issue 041) ──→ Receivable ──┐
                                           ├── Payment
SupplierInvoice (Issue 048) ──→ Payable ──┘

JournalEntry → JournalEntryLine → Account

Receivable / Payable / Payment → JournalEntry
```

## The Rule That Governs Everything

```text
Total Debits = Total Credits
```

Must hold after every transaction, not only at period end. Every test in this epic asserts it.

## Epic Acceptance Criteria

- [ ] All child issues closed
- [ ] Chart of accounts with enforced posting rules
- [ ] Every journal entry balanced at write time; posted entries immutable
- [ ] Ledger balances always reconcile with posted entries
- [ ] Receivables created automatically from sales invoices (Issue 041)
- [ ] Payables created automatically from matched supplier invoices (Issue 048)
- [ ] Payments applied correctly including partial payment
- [ ] Trial Balance always balances
- [ ] Balance Sheet equation always holds
- [ ] Release v0.9.0 published

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-08-finance-accounting.md` |
| Phase overview | `academy/08-sprints/phase-03-enterprise-capabilities/phase-overview.md` |
| Triggered by | Issue 041 (sales invoice), Issue 048 (supplier invoice) |
| Reconciled against | Issue 042, Issue 049 (sales and procurement dashboards) |
| Release | v0.9.0 |
