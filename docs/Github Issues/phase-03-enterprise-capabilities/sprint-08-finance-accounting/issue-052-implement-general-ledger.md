# [FEATURE] Implement General Ledger

<!-- GitHub title: [FEATURE] Implement General Ledger
     Labels: feature, finance, priority: critical
     Milestone: Sprint 08 - Finance & Accounting
     Branch: feature/052-implement-general-ledger
     Epic: Finance & Accounting
     Depends on: 051
     Blocks: 053, 054
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
- [ ] High
- [x] Critical

## Module: finance
## Sprint: Sprint 08 - Finance & Accounting

---

## Summary

Expose account balances derived from posted journal entries: running balances per account, drill
down to source entries, and correct sign handling per account type.

## Background

Issue 051 posts individual entries. Nobody reads individual entries to answer "what is our cash
position?" — they read the ledger, which is the accumulated balance of every account.

The design decision that matters here is the same one used for leave balances in Issue 026: **the
balance is derived from the transaction log, never stored as an independently mutable figure.** The
ledger view queries `JournalEntryLine` and aggregates. There is no `Account.balance` column to drift
out of sync with what was actually posted.

The second decision is **sign convention per account type**. A debit increases an Asset account but
decreases a Liability account. Getting this backwards for even one account type makes every report
built on it wrong in a way that is not visually obvious — the numbers still look plausible, just
inverted.

## User Story

As a Finance Officer,
I want to see account balances derived from posted entries,
So that I can trust the ledger reflects exactly what was posted, with no possibility of drift.

## Acceptance Criteria

```gherkin
Given a series of posted entries affecting Cash
When the Cash account balance is requested
Then it equals the sum of the account's debits and credits, adjusted for its sign convention
```

```gherkin
Given an Asset account
When a debit is posted to it
Then its balance increases
```

```gherkin
Given a Liability account
When a debit is posted to it
Then its balance decreases
```

```gherkin
Given an account balance is displayed
When a user drills into a specific figure
Then the exact journal entries that produced it are shown
```

```gherkin
Given a date range filter
When the ledger is requested
Then only entries within that range and fiscal period contribute to the balance
```

- [ ] `GET /api/finance/ledger` lists ledger entries with filtering
- [ ] `GET /api/finance/ledger/account/{accountId}` returns entries for one account
- [ ] `GET /api/finance/ledger/balance/{accountId}` returns the current balance
- [ ] `GET /api/finance/ledger/balance/{accountId}/as-of` returns the balance as of a given date
- [ ] Balances derived exclusively from posted `JournalEntryLine` rows
- [ ] Sign convention applied correctly per account type
- [ ] Drill-down from a balance to its contributing entries
- [ ] Date range and fiscal period filtering
- [ ] Draft (unposted) entries excluded from every balance calculation
- [ ] Ledger indexed for account and date-range queries
- [ ] Reconciliation check available: recomputed balance matches any cached figure
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Every account balance is provably correct because it is computed from posted entries at query
time. Any figure can be drilled into and explained down to the entries that produced it.

---

## Scope

### Included

- Ledger query endpoints
- Balance derivation from posted entries
- Sign convention per account type
- As-of-date balance calculation
- Drill-down to source entries
- Date range and period filtering
- Indexing
- Permission enforcement
- ERD update

### Out of Scope

- Receivables and payables (Issues 053, 054)
- Payment processing (Issue 055)
- Financial statements (Issue 056)
- Multi-currency consolidation
- Ledger performance optimization at scale (Sprint 12, Issue 076)

## Technical Requirements

**Endpoints**

```text
GET /api/finance/ledger
GET /api/finance/ledger/account/{accountId}
GET /api/finance/ledger/balance/{accountId}
GET /api/finance/ledger/balance/{accountId}/as-of?date=
```

**Sign convention**

```text
Account Type    Debit Effect    Credit Effect

Asset           Increase        Decrease
Expense         Increase        Decrease

Liability       Decrease        Increase
Equity          Decrease        Increase
Revenue         Decrease        Increase
```

**Balance formula**

```text
For ASSET and EXPENSE accounts:
    balance = SUM(debitAmount) - SUM(creditAmount)   over posted lines

For LIABILITY, EQUITY, and REVENUE accounts:
    balance = SUM(creditAmount) - SUM(debitAmount)   over posted lines
```

Only lines belonging to entries where `JournalEntry.status = POSTED` contribute. This is the single
most important filter in the query — a draft entry must never affect a displayed balance.

**As-of-date**

```text
balance as of D = the same formula, restricted to entries where entryDate <= D
```

This is what makes historical statements possible in Issue 056 — a Balance Sheet as of 31 March
must reflect exactly the entries posted on or before that date.

**Indexes**

```text
(accountId, entryDate)   via the JournalEntryLine → JournalEntry join
```

The ledger query joins across two tables on every call; index the columns the filter and the join
actually use, and measure the query cost during development — a candidate for Sprint 12.

**Reconciliation**

Expose a verification method used in tests:

```text
recomputedBalance(accountId) should equal the balance returned by the API
                              at any point in time, since there is nothing else to drift
```

**Permissions to add**

```text
LEDGER_READ
```

## Dependencies

- Issue 051 — posted journal entries are the ledger's only input.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for balance calculation per account type, covering all five sign conventions
- [ ] Unit test confirming draft entries never affect a balance
- [ ] Unit test for as-of-date balance calculation
- [ ] Test confirming drill-down returns exactly the contributing entries
- [ ] Integration tests for all endpoints
- [ ] Query performance measured on a seeded dataset and recorded for Sprint 12
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-08-finance-accounting.md` § 3 |
| Epic | Finance & Accounting |
| Derives from | Issue 051 (posted entries) |
| Consumed by | Issue 056 (financial statements) |
| Optimized by | Issue 076 (Sprint 12) |
| Pull Request | _to be linked_ |
