# [FEATURE] Implement Financial Reporting

<!-- GitHub title: [FEATURE] Implement Financial Reporting
     Labels: feature, finance, priority: high
     Milestone: Sprint 08 - Finance & Accounting
     Branch: feature/056-implement-financial-reporting
     Epic: Finance & Accounting
     Depends on: 052, 053, 054
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

Produce the five core financial reports from ledger data: Trial Balance, Profit & Loss, Balance
Sheet, and the receivable and payable aging reports, each filterable by fiscal period.

## Background

This is where Sprint 08 either proves itself or reveals a defect. Every report here is a
consequence of Issues 050-055 — nothing new is stored; everything is derived from what was already
posted.

Two invariants must hold on every report this issue produces, and both should be asserted in tests
directly, not just observed:

```text
Trial Balance:   SUM(debits) = SUM(credits)               always, by construction

Balance Sheet:   Assets = Liabilities + Equity             the fundamental accounting equation
```

If either fails on any report the system generates, something upstream in this sprint is wrong —
most likely a posting that was allowed to be unbalanced, which Issue 051 was specifically built to
prevent. These reports are therefore also the sprint's final integration test.

Profit & Loss is a period report — it answers "what happened between two dates." Balance Sheet is a
point-in-time report — it answers "what is true as of one date." Building both from the same ledger
using the as-of-date balance capability from Issue 052 is what keeps them consistent with each
other.

## User Story

As a Finance Manager,
I want to generate core financial statements from the ledger,
So that I can verify the books are balanced and report on the company's financial position.

## Acceptance Criteria

```gherkin
Given any set of posted journal entries
When the Trial Balance is generated
Then total debits equal total credits exactly
```

```gherkin
Given posted revenue and expense entries for a period
When the Profit & Loss is generated for that period
Then net income equals total revenue minus total expenses for entries in that range
```

```gherkin
Given the ledger as of a specific date
When the Balance Sheet is generated for that date
Then Assets equals Liabilities plus Equity
```

```gherkin
Given open receivables and payables
When the aging reports are generated
Then the totals match the sum of outstanding amounts from Issues 053 and 054
```

```gherkin
Given a fiscal period filter
When any report is generated
Then only entries within that period are included
```

- [ ] `GET /api/finance/reports/trial-balance` returns the Trial Balance
- [ ] `GET /api/finance/reports/profit-and-loss` returns the Profit & Loss for a date range
- [ ] `GET /api/finance/reports/balance-sheet` returns the Balance Sheet as of a date
- [ ] Trial Balance lists every account with its debit or credit balance
- [ ] Trial Balance total debits always equal total credits
- [ ] Profit & Loss groups Revenue and Expense accounts and calculates net income
- [ ] Balance Sheet groups Asset, Liability, and Equity accounts as of a single date
- [ ] Balance Sheet equation always holds
- [ ] Receivable and payable aging summaries included or linked from the reports
- [ ] Every report filterable by fiscal period
- [ ] Every report reconciles exactly with the underlying ledger and Issues 053/054
- [ ] Reports exportable in a structured format for later use by Sprint 09
- [ ] Permissions declared and enforced
- [ ] Report formulas documented

## Expected Result

Finance can generate a Trial Balance, Profit & Loss, and Balance Sheet at any time and trust them,
because they are derived directly from the posted ledger with no independently stored figures to
drift out of sync.

---

## Scope

### Included

- Trial Balance report
- Profit & Loss report
- Balance Sheet report
- Fiscal period filtering on all reports
- Reconciliation with Issues 053 and 054
- Permission enforcement
- Formula documentation

### Out of Scope

- Cash flow statement
- Budget versus actual reporting
- Consolidated multi-entity statements
- Report scheduling and export automation (Sprint 09, Issues 061, 062)
- Executive dashboard (Sprint 09, Issue 060)
- Cross-module KPIs (Sprint 09, Issue 059)

## Technical Requirements

**Endpoints**

```text
GET /api/finance/reports/trial-balance?fiscalPeriodId=
GET /api/finance/reports/profit-and-loss?dateFrom=&dateTo=
GET /api/finance/reports/balance-sheet?asOfDate=
```

**Trial Balance**

```text
For every account:
    balance = the Issue 052 ledger balance (raw debit/credit, not sign-adjusted)

Sum all debit-side balances and all credit-side balances

Assert: totalDebits = totalCredits
```

The Trial Balance is the direct output of correct double-entry posting — if this report does not
balance, a defect exists in Issue 051's balance validation, not in this report.

**Profit & Loss**

```text
Revenue      = SUM of Revenue account balances (sign-adjusted) for entries dated within the range
Expenses     = SUM of Expense account balances (sign-adjusted) for entries dated within the range
Net Income   = Revenue - Expenses
```

Uses Issue 052's date-range balance capability per account, grouped by account type.

**Balance Sheet**

```text
Assets       = SUM of Asset account balances as of asOfDate
Liabilities  = SUM of Liability account balances as of asOfDate
Equity       = SUM of Equity account balances as of asOfDate, including current-period net income

Assert: Assets = Liabilities + Equity
```

Uses Issue 052's as-of-date balance capability. Current-period net income rolls into Equity for the
equation to hold before a formal period-close posting exists — document this assumption.

**Reconciliation**

Add integration tests that generate all three reports against a shared seeded dataset — including
sales invoices (Issue 041), supplier invoices (Issue 048), and payments (Issue 055) — and assert:

```text
Trial Balance total debits          = Trial Balance total credits
Balance Sheet Assets                 = Balance Sheet Liabilities + Equity
Sum of aging report outstanding      = Sum of Issue 053/054 outstanding amounts
```

**Export format**

Return reports as structured JSON with line items, not pre-rendered text — Sprint 09's reporting
architecture (Issue 057) will consume the same underlying queries as read models.

**Permissions to add**

```text
FINANCIAL_REPORT_READ
```

## Dependencies

- Issue 052 — the general ledger, the source of every figure in every report.
- Issue 053 — receivables, for aging reconciliation.
- Issue 054 — payables, for aging reconciliation.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for each report's calculation logic
- [ ] **Invariant test**: Trial Balance always balances across randomized seeded data
- [ ] **Invariant test**: Balance Sheet equation always holds across randomized seeded data
- [ ] Integration test reconciling aging report totals against Issues 053 and 054
- [ ] Integration test generating all three reports against a realistic order-to-cash and procure-to-pay dataset
- [ ] Fiscal period filtering tested on every report
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and formula documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-08-finance-accounting.md` § 7 |
| Epic | Finance & Accounting |
| Derives from | Issue 052 (ledger) |
| Reconciles with | Issues 053, 054 |
| Query pattern reused by | Issue 057 (Sprint 09 reporting architecture) |
| Pull Request | _to be linked_ |
