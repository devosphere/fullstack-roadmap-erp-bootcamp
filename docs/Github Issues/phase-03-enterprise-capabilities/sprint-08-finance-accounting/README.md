# Sprint 08 - Finance & Accounting

**Milestone:** Sprint 08 - Finance & Accounting  
**Release:** v0.9.0  
**Phase:** Phase 03 - Enterprise Capabilities  
**Duration:** 4-5 Weeks  
**Sprint Spec:** `academy/08-sprints/phase-03-enterprise-capabilities/sprint-08-finance-accounting.md`

---

# Milestone Definition

| Field | Value |
|-------|-------|
| Title | `Sprint 08 - Finance & Accounting` |
| Due date | End of sprint |
| Description | Give every sales and purchasing transaction a correct, traceable accounting consequence. Release v0.9.0. |

---

# Sprint Goal

Implement a chart of accounts, double-entry journal posting, a general ledger, accounts receivable,
accounts payable, payment processing, and core financial statements.

---

# Epic

**[Finance & Accounting](epic-08-finance-accounting.md)**

---

# Issue Roster

| # | File | GitHub Title | Type | Labels | Branch |
|---|------|--------------|------|--------|--------|
| 050 | [issue-050](issue-050-create-chart-of-accounts.md) | `[FEATURE] Create Chart of Accounts` | Feature | `feature`, `finance`, `priority: critical` | `feature/050-create-chart-of-accounts` |
| 051 | [issue-051](issue-051-implement-journal-entry-posting.md) | `[FEATURE] Implement Journal Entry Posting` | Feature | `feature`, `finance`, `priority: critical` | `feature/051-implement-journal-entry-posting` |
| 052 | [issue-052](issue-052-implement-general-ledger.md) | `[FEATURE] Implement General Ledger` | Feature | `feature`, `finance`, `priority: critical` | `feature/052-implement-general-ledger` |
| 053 | [issue-053](issue-053-implement-accounts-receivable.md) | `[FEATURE] Implement Accounts Receivable` | Feature | `feature`, `finance`, `sales`, `priority: high` | `feature/053-implement-accounts-receivable` |
| 054 | [issue-054](issue-054-implement-accounts-payable.md) | `[FEATURE] Implement Accounts Payable` | Feature | `feature`, `finance`, `procurement`, `priority: high` | `feature/054-implement-accounts-payable` |
| 055 | [issue-055](issue-055-implement-payment-processing.md) | `[FEATURE] Implement Payment Processing` | Feature | `feature`, `finance`, `priority: high` | `feature/055-implement-payment-processing` |
| 056 | [issue-056](issue-056-implement-financial-reporting.md) | `[FEATURE] Implement Financial Reporting` | Feature | `feature`, `finance`, `priority: high` | `feature/056-implement-financial-reporting` |

All seven issues take **Milestone:** `Sprint 08 - Finance & Accounting`.

---

# Dependency Order

```text
050 Chart of Accounts

        ↓

051 Journal Entry Posting

        ↓

052 General Ledger

        ↓

053 Accounts Receivable     054 Accounts Payable

        └──────────┬──────────────┘

                   ↓

           055 Payment Processing

                   ↓

           056 Financial Reporting
```

Issues 053 and 054 can run in parallel once 052 lands — one reads from sales, the other from
purchasing, and neither depends on the other.

---

# Cross-Module Dependencies

| Issue | Triggered by |
|-------|-------------|
| 053 Accounts Receivable | Issue 041 — issuing a sales invoice creates a receivable and posts a journal entry |
| 054 Accounts Payable | Issue 048 — an approved (matched) supplier invoice creates a payable and posts a journal entry |

These are the first automatic postings in the system — the sales and purchasing modules do not call
finance directly; issuing an invoice or approving a matched supplier invoice **triggers** a posting.
Get the trigger point right, since it is the seam between two modules that must never disagree about
whether a posting happened.

---

# The One Rule That Matters Most

```text
Total Debits = Total Credits
```

This must hold after every single transaction, not just at period end. Every test in this sprint
should assert it. An unbalanced entry is not a bug to fix later — it must be impossible to create.

---

# Sprint Definition of Done

- [ ] Chart of accounts with enforced hierarchy and posting rules.
- [ ] Journal entries always balanced; posted entries immutable.
- [ ] General ledger balances always reconcile with posted entries.
- [ ] Receivables and payables created automatically from sales and supplier invoices.
- [ ] Payments applied correctly, including partial payment.
- [ ] Trial Balance always balances.
- [ ] Balance Sheet equation always holds.
- [ ] Tests passing, including the balance-after-every-transaction invariant.
- [ ] Documentation and ERD updated.
- [ ] Release v0.9.0 published.

---

# Release Notes Draft

```markdown
# v0.9.0

Finance & Accounting Release

## Added

- Chart of Accounts
- Journal Entry Posting
- General Ledger
- Accounts Receivable
- Accounts Payable
- Payment Processing
- Financial Reporting (Trial Balance, Profit & Loss, Balance Sheet)
```
