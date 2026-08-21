# Sprint 08 - Finance & Accounting

**Sprint:** Sprint 08  
**Phase:** Phase 03 - Enterprise Capabilities  
**Duration:** 4-5 Weeks  
**Release Target:** v0.9.0  
**Status:** Planned

---

# Sprint Goal

Implement the Finance and Accounting module by introducing a chart of accounts, double-entry journal posting, a general ledger, accounts receivable, accounts payable, payment processing, and core financial statements.

At the end of this sprint, every sales and purchasing transaction recorded in previous sprints should produce correct, traceable accounting entries.

---

# Sprint Context

Previous sprints established:

```text
Sprint 05
Inventory Management

        ↓

Sprint 06
Sales Management
Customer Invoices

        ↓

Sprint 07
Purchasing Management
Supplier Invoices
```

Sales and purchasing currently record **business documents** but no **financial consequence**.

Sprint 08 closes that gap.

```text
Operational Transaction

        ↓

Accounting Entry

        ↓

General Ledger

        ↓

Financial Statement
```

This is the first sprint where a defect has real financial meaning: an unbalanced ledger is not a cosmetic bug.

---

# Business Outcome

After completing this sprint, the ERP platform will support:

- A configurable chart of accounts.
- Double-entry journal posting.
- A general ledger with account balances.
- Accounts receivable from sales invoices.
- Accounts payable from supplier invoices.
- Customer and supplier payment recording.
- Trial Balance, Profit & Loss, and Balance Sheet reports.

---

# Sprint Objectives

By the end of this sprint, learners should understand:

- Double-entry accounting principles.
- Chart of accounts design.
- Journal posting and ledger aggregation.
- Receivables and payables lifecycle.
- Payment application and settlement.
- Fiscal periods and period closing.
- Financial statement construction.
- Why financial data must be immutable once posted.

---

# Sprint Theme

## "Every Transaction Has Two Sides"

Accounting is not a report generated at the end of a period.

It is a constraint that must hold after every single transaction:

```text
Total Debits = Total Credits
```

If that equation breaks anywhere, every report built on top of it is wrong.

---

# Business Capability

## Finance & Accounting

The finance module provides capabilities for:

- Account structure management.
- Transaction posting.
- Ledger management.
- Receivables management.
- Payables management.
- Payment processing.
- Financial reporting.

---

# Domain Concepts

---

# Account

A category used to classify financial values.

Account types:

```text
Asset
Liability
Equity
Revenue
Expense
```

Example:

```text
1100 - Accounts Receivable   (Asset)
2100 - Accounts Payable      (Liability)
4000 - Sales Revenue         (Revenue)
5000 - Cost of Goods Sold    (Expense)
```

---

# Chart of Accounts

The complete, structured list of accounts used by the organization.

```text
1000 Assets
    1100 Accounts Receivable
    1200 Inventory
    1300 Cash

2000 Liabilities
    2100 Accounts Payable

3000 Equity

4000 Revenue
    4000 Sales Revenue

5000 Expenses
    5000 Cost of Goods Sold
```

---

# Journal Entry

A balanced record of a financial event.

Example — a sales invoice of 45,000:

```text
Debit   Accounts Receivable   45,000
Credit  Sales Revenue         45,000
```

Rules:

- Every entry has at least two lines.
- Total debits must equal total credits.
- A posted entry cannot be edited, only reversed.

---

# General Ledger

The accumulated balance of every account, derived from posted journal entries.

```text
Journal Entries

        ↓

General Ledger

        ↓

Account Balances
```

---

# Accounts Receivable

Money owed to the company by customers.

Source: sales invoices from Sprint 06.

```text
Invoice Issued → Receivable Open → Payment Received → Receivable Settled
```

---

# Accounts Payable

Money the company owes to suppliers.

Source: supplier invoices from Sprint 07.

```text
Invoice Matched → Payable Open → Payment Made → Payable Settled
```

---

# Fiscal Period

A time window used to group financial activity.

```text
Open → Closed
```

Entries cannot be posted to a closed period.

---

# Sprint Scope

---

# 1. Chart of Accounts

## Objective

Define the account structure used by all financial transactions.

## Features

Users can:

- Create accounts with a code, name, and type.
- Organize accounts into a parent hierarchy.
- Activate and deactivate accounts.
- View the full chart of accounts.

## Business Rules

- Account Code must be unique.
- Account type cannot be changed once transactions exist.
- An account with posted entries cannot be deleted.
- Only leaf accounts can be posted to.

## Acceptance Criteria

- Account CRUD available.
- Account hierarchy supported.
- Account Code uniqueness enforced.
- Posting to a parent account rejected.

---

# 2. Journal Entries and Double-Entry Posting

## Objective

Record balanced financial transactions.

## Features

Users can:

- Create manual journal entries.
- Add multiple debit and credit lines.
- Post entries.
- Reverse posted entries.
- View entry details and source document.

## Business Rules

- Total debits must equal total credits before posting.
- A posted entry is immutable.
- Corrections are made by posting a reversing entry.
- Entries cannot be posted to a closed fiscal period.
- Every entry records who posted it and when.

## Acceptance Criteria

- Journal entry CRUD available for drafts.
- Unbalanced entries rejected with a clear error.
- Posted entries immutable.
- Reversal creates a linked, opposite entry.

---

# 3. General Ledger

## Objective

Maintain and expose account balances.

## Features

Users can:

- View ledger entries per account.
- View running account balances.
- Filter by date range and fiscal period.
- Drill down from a balance to its source entries.

## Business Rules

- Ledger balances derive only from posted entries.
- Every ledger line links to its journal entry and source document.
- Balances respect account type sign conventions.

## Acceptance Criteria

- Ledger view available per account.
- Balances calculated correctly.
- Drill-down to source document works.
- Date and period filtering works.

---

# 4. Accounts Receivable

## Objective

Track money owed by customers.

## Features

Users can:

- View open receivables.
- View receivables per customer.
- View an aging report.
- Post receivables automatically when a sales invoice is issued.

## Business Rules

- Issuing a sales invoice creates a receivable and a journal entry.
- Receivable amount equals the invoice total.
- Aging buckets are calculated from the invoice due date.
- A receivable closes only when fully settled.

## Acceptance Criteria

- Receivable created automatically from a sales invoice.
- Correct journal entry posted.
- Aging report produces correct buckets.
- Customer statement available.

---

# 5. Accounts Payable

## Objective

Track money owed to suppliers.

## Features

Users can:

- View open payables.
- View payables per supplier.
- View an aging report.
- Post payables automatically when a supplier invoice is approved.

## Business Rules

- Approving a matched supplier invoice creates a payable and a journal entry.
- Payables are only created from invoices that passed the three-way match.
- Aging buckets are calculated from the invoice due date.
- A payable closes only when fully settled.

## Acceptance Criteria

- Payable created automatically from an approved supplier invoice.
- Correct journal entry posted.
- Held invoices do not create payables.
- Aging report produces correct buckets.

---

# 6. Payment Processing

## Objective

Record and apply payments.

## Features

Users can:

- Record customer payments received.
- Record supplier payments made.
- Apply a payment to one or more invoices.
- Handle partial payments.
- View payment history.

## Business Rules

- Applied amount cannot exceed the outstanding balance.
- A payment posts its own balanced journal entry.
- Partial payment reduces the outstanding balance and keeps the item open.
- Full payment settles the item and closes it.
- Payments cannot be deleted, only reversed.

## Acceptance Criteria

- Customer and supplier payments recorded.
- Payment applied to specific invoices.
- Partial payment supported.
- Over-application rejected.
- Correct journal entries posted.

---

# 7. Financial Reporting

## Objective

Produce core financial statements from ledger data.

## Reports

```text
Trial Balance
Profit & Loss Statement
Balance Sheet
Accounts Receivable Aging
Accounts Payable Aging
```

## Business Rules

- Trial Balance total debits must equal total credits.
- Profit & Loss covers a date range.
- Balance Sheet is produced as of a single date.
- Balance Sheet must satisfy: `Assets = Liabilities + Equity`.

## Acceptance Criteria

- All five reports available.
- Trial Balance balances.
- Balance Sheet equation holds.
- Reports filter by fiscal period.
- Access is role-based.

---

# Database Design

## New Entities

```text
Account
FiscalPeriod
JournalEntry
JournalEntryLine
Receivable
Payable
Payment
PaymentApplication
```

---

# Account Table

```text
Account

id
accountCode
name
accountType
parentAccountId
isPostable
status
```

---

# Fiscal Period Table

```text
FiscalPeriod

id
name
startDate
endDate
status
closedBy
closedAt
```

---

# Journal Entry Table

```text
JournalEntry

id
entryNumber
entryDate
fiscalPeriodId
description
sourceType
sourceId
reversalOfId
status
postedBy
postedAt
```

---

# Journal Entry Line Table

```text
JournalEntryLine

id
journalEntryId
accountId
debitAmount
creditAmount
description
```

---

# Receivable Table

```text
Receivable

id
customerId
salesInvoiceId
invoiceDate
dueDate
originalAmount
outstandingAmount
status
```

---

# Payable Table

```text
Payable

id
supplierId
supplierInvoiceId
invoiceDate
dueDate
originalAmount
outstandingAmount
status
```

---

# Payment Table

```text
Payment

id
paymentNumber
paymentType
partyId
paymentDate
amount
method
reference
journalEntryId
status
```

---

# Entity Relationships

```text
SalesInvoice → Receivable ──┐
                            ├── Payment → PaymentApplication
SupplierInvoice → Payable ──┘

JournalEntry → JournalEntryLine → Account

JournalEntry → FiscalPeriod

Receivable / Payable / Payment → JournalEntry
```

---

# API Requirements

## Chart of Accounts APIs

```text
GET    /api/finance/accounts
POST   /api/finance/accounts
GET    /api/finance/accounts/{id}
PUT    /api/finance/accounts/{id}
```

---

## Journal Entry APIs

```text
GET    /api/finance/journal-entries
POST   /api/finance/journal-entries
POST   /api/finance/journal-entries/{id}/post
POST   /api/finance/journal-entries/{id}/reverse
```

---

## General Ledger APIs

```text
GET    /api/finance/ledger
GET    /api/finance/ledger/account/{accountId}
GET    /api/finance/ledger/balance/{accountId}
```

---

## Receivable and Payable APIs

```text
GET    /api/finance/receivables
GET    /api/finance/receivables/aging
GET    /api/finance/payables
GET    /api/finance/payables/aging
```

---

## Payment APIs

```text
POST   /api/finance/payments
GET    /api/finance/payments
POST   /api/finance/payments/{id}/apply
POST   /api/finance/payments/{id}/reverse
```

---

## Financial Reporting APIs

```text
GET    /api/finance/reports/trial-balance
GET    /api/finance/reports/profit-and-loss
GET    /api/finance/reports/balance-sheet
```

---

## Fiscal Period APIs

```text
GET    /api/finance/periods
POST   /api/finance/periods
POST   /api/finance/periods/{id}/close
```

---

# GitHub Execution

---

# Epic

## Epic: Finance & Accounting

Purpose:

Build the financial control layer that gives every operational transaction an accounting consequence.

---

# GitHub Issues

---

# Issue 050 - Create Chart of Accounts

Type:

```
Feature
```

Acceptance Criteria:

- Account CRUD completed.
- Account hierarchy supported.
- Account Code uniqueness enforced.
- Posting to non-postable accounts rejected.

---

# Issue 051 - Implement Journal Entry Posting

Type:

```
Feature
```

Acceptance Criteria:

- Balanced entries post successfully.
- Unbalanced entries rejected.
- Posted entries immutable.
- Reversal creates a linked opposite entry.

---

# Issue 052 - Implement General Ledger

Type:

```
Feature
```

Acceptance Criteria:

- Ledger view per account available.
- Account balances calculated correctly.
- Drill-down to source document works.

---

# Issue 053 - Implement Accounts Receivable

Type:

```
Feature
```

Acceptance Criteria:

- Receivable created automatically from a sales invoice.
- Correct journal entry posted.
- Aging report produces correct buckets.

---

# Issue 054 - Implement Accounts Payable

Type:

```
Feature
```

Acceptance Criteria:

- Payable created automatically from an approved supplier invoice.
- Held invoices do not create payables.
- Aging report produces correct buckets.

---

# Issue 055 - Implement Payment Processing

Type:

```
Feature
```

Acceptance Criteria:

- Customer and supplier payments recorded.
- Payments applied to specific invoices.
- Partial payment supported.
- Over-application rejected.

---

# Issue 056 - Implement Financial Reporting

Type:

```
Feature
```

Acceptance Criteria:

- Trial Balance, Profit & Loss, and Balance Sheet available.
- Trial Balance balances.
- Balance Sheet equation holds.
- Reports filter by fiscal period.

---

# Development Workflow

Every change follows:

```text
GitHub Issue

        ↓

Feature Branch

        ↓

Development

        ↓

Commit

        ↓

Pull Request

        ↓

Code Review

        ↓

Merge

        ↓

Release
```

---

# Testing Requirements

## Unit Testing

Required:

- Debit and credit balancing validation.
- Account balance calculation per account type.
- Aging bucket calculation.
- Payment application and partial settlement.
- Reversal entry generation.
- Fiscal period posting restrictions.

---

## Integration Testing

Test:

- Chart of Accounts APIs.
- Journal Entry APIs.
- Ledger APIs.
- Receivable and Payable creation from invoices.
- Payment APIs.
- Financial report APIs.

---

## End-to-End Testing

### Order-to-Cash Financial Flow

```text
Issue Sales Invoice

        ↓

Receivable Created

        ↓

Journal Entry Posted

        ↓

Record Customer Payment

        ↓

Receivable Settled

        ↓

Trial Balance Still Balances
```

---

### Procure-to-Pay Financial Flow

```text
Approve Supplier Invoice

        ↓

Payable Created

        ↓

Journal Entry Posted

        ↓

Record Supplier Payment

        ↓

Payable Settled

        ↓

Balance Sheet Equation Holds
```

---

# Documentation Deliverables

## Business Documentation

- Finance BRD.
- Chart of accounts specification.
- Posting rules per transaction type.
- Period closing procedure.

---

## Technical Documentation

- Finance module architecture.
- Updated ERD.
- Finance API documentation.
- ADR: double-entry posting model.
- ADR: immutability of posted entries.

---

# Sprint Deliverables

## Finance Module

Completed:

- Chart of Accounts.
- Journal Entry Posting.
- General Ledger.
- Accounts Receivable.
- Accounts Payable.
- Payment Processing.
- Financial Reporting.

---

## Engineering

Completed:

- APIs implemented.
- Database updated.
- Automatic posting from sales and purchasing implemented.
- Automated tests created.

---

## Documentation

Completed:

- Accounting rules documented.
- Financial architecture documented.

---

# Sprint Review

The learner demonstrates:

1. Show the chart of accounts.
2. Post a manual journal entry and show it balances.
3. Issue a sales invoice and show the receivable and journal entry.
4. Record a customer payment and show settlement.
5. Approve a supplier invoice and show the payable.
6. Produce a Trial Balance.
7. Produce a Profit & Loss and Balance Sheet.

---

# Sprint Retrospective

## Discussion Topics

- Double-entry model decisions.
- Immutability versus editability of financial records.
- Automatic posting design.
- Report accuracy verification.
- Lessons learned.

---

# Release

**Version:** `v0.9.0`

---

# Release Notes

```markdown
# v0.9.0

## Added

- Chart of Accounts
- Journal Entry Posting
- General Ledger
- Accounts Receivable
- Accounts Payable
- Payment Processing
- Financial Reporting
```

---

# Definition of Done

Sprint 08 is complete when:

- [ ] Chart of accounts completed.
- [ ] Journal entry posting completed.
- [ ] General ledger completed.
- [ ] Accounts receivable completed.
- [ ] Accounts payable completed.
- [ ] Payment processing completed.
- [ ] Financial reports completed and verified.
- [ ] Trial Balance balances in all test scenarios.
- [ ] APIs documented.
- [ ] Tests passing.
- [ ] Documentation completed.
- [ ] Pull Request approved.
- [ ] Release v0.9.0 published.

---

# Skills Acquired

After completing Sprint 08, learners will understand:

## Business Analysis

- Financial processes.
- Accounting policy definition.
- Receivables and payables management.

---

## Backend Development

- Double-entry posting engines.
- Immutable transaction records.
- Aggregation and balance calculation.
- Automatic posting from other modules.

---

## Frontend Development

- Financial data entry interfaces.
- Report viewers with parameters.
- Drill-down navigation.

---

## ERP Engineering

- Connecting operations to finance.
- Guaranteeing data integrity in financial systems.
- Designing auditable records.

---

# Next Sprint Preview

# Sprint 09 - Reporting & Analytics

Planned:

- Reporting architecture and read models.
- Parameterized reports.
- Cross-module KPIs.
- Executive dashboard.
- Report export.
- Scheduled reports.
