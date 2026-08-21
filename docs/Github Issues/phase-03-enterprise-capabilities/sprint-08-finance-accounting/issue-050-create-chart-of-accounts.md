# [FEATURE] Create Chart of Accounts

<!-- GitHub title: [FEATURE] Create Chart of Accounts
     Labels: feature, finance, priority: critical
     Milestone: Sprint 08 - Finance & Accounting
     Branch: feature/050-create-chart-of-accounts
     Epic: Finance & Accounting
     Blocks: 051
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

Define the account structure that every financial transaction posts to: accounts with a code,
type, and parent hierarchy, with only leaf accounts postable.

## Background

Every journal entry in Issue 051 posts to accounts defined here. Get the structure wrong and every
report built on it in Issue 056 is wrong too.

The rule that matters most: **only leaf accounts can be posted to.** A parent account like `1000
Assets` exists to organize the chart and roll up balances in reports; posting directly to it would
make the hierarchy meaningless, because a transaction posted to the parent could not be attributed
to any specific asset account beneath it.

Account type is fixed once transactions exist, for the same reason a product's unit of measure is
fixed in Issue 029 — changing what an account *means* after it has balances would silently
reinterpret every historical entry.

## User Story

As a Finance Administrator,
I want to define a structured chart of accounts,
So that every financial transaction has a correct, consistent account to post to.

## Acceptance Criteria

```gherkin
Given an authenticated finance administrator
When they create an account with a unique code, type, and optional parent
Then the account is created
```

```gherkin
Given a parent account with child accounts beneath it
When a journal entry attempts to post directly to the parent
Then the request is rejected
```

```gherkin
Given an account with posted journal entries
When a user attempts to change its account type
Then the request is rejected
```

```gherkin
Given an account with posted journal entries
When a user attempts to delete it
Then the request is rejected
```

- [ ] `GET /api/finance/accounts` lists accounts with filtering
- [ ] `GET /api/finance/accounts/tree` returns the nested hierarchy
- [ ] `POST /api/finance/accounts` creates an account
- [ ] `GET /api/finance/accounts/{id}` returns an account
- [ ] `PUT /api/finance/accounts/{id}` updates an account
- [ ] Account code uniqueness enforced
- [ ] Account types supported: Asset, Liability, Equity, Revenue, Expense
- [ ] Parent-child hierarchy with cycle prevention, same pattern as Issue 017
- [ ] `isPostable` flag distinguishes leaf accounts from organizational parents
- [ ] Posting to a non-postable account rejected
- [ ] Account type immutable once any journal entry line references the account
- [ ] Accounts with posted entries cannot be deleted
- [ ] Accounts can be deactivated instead
- [ ] Baseline chart of accounts seeded
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

A structured, hierarchical chart of accounts exists where only leaf accounts accept postings. The
structure is stable enough for Issue 051 to build on immediately.

---

## Scope

### Included

- Account CRUD endpoints
- Type and hierarchy management
- Cycle prevention (same pattern as departments, categories)
- Postable/non-postable distinction
- Type immutability after use
- Deletion guard
- Baseline chart seed data
- Permission enforcement
- ERD update

### Out of Scope

- Journal entries and posting (Issue 051)
- General ledger balances (Issue 052)
- Fiscal periods (Issue 051 introduces the entity; this issue only references it)
- Multi-currency accounts
- Cost centers and departmental accounting

## Technical Requirements

**Endpoints**

```text
GET    /api/finance/accounts
GET    /api/finance/accounts/tree
POST   /api/finance/accounts
GET    /api/finance/accounts/{id}
PUT    /api/finance/accounts/{id}
```

**Schema**

```text
Account

id
accountCode        unique
name
accountType        enum: ASSET | LIABILITY | EQUITY | REVENUE | EXPENSE
parentAccountId    → Account, nullable
isPostable         boolean, default true
status              enum: ACTIVE | INACTIVE
createdAt
updatedAt
```

**Baseline chart to seed**

```text
1000 Assets                          (not postable)
    1100 Accounts Receivable
    1200 Inventory
    1300 Cash

2000 Liabilities                     (not postable)
    2100 Accounts Payable

3000 Equity                          (not postable)
    3100 Retained Earnings

4000 Revenue                         (not postable)
    4100 Sales Revenue

5000 Expenses                        (not postable)
    5100 Cost of Goods Sold
```

**Cycle prevention**

Same validation as Issue 017 (departments) and Issue 030 (categories): an account cannot be its own
ancestor, checked across the full chain, not only the direct parent.

**Permissions to add**

```text
ACCOUNT_READ
ACCOUNT_CREATE
ACCOUNT_UPDATE
```

## Dependencies

None — this is the starting issue for Sprint 08.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for cycle detection
- [ ] Unit test confirming account type is immutable once used
- [ ] Unit test confirming non-postable accounts reject postings
- [ ] Integration tests for all endpoints
- [ ] Seed script verified on a clean database
- [ ] Denial tests for users without the permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-08-finance-accounting.md` § 1 |
| Epic | Finance & Accounting |
| Same pattern as | Issue 017 (departments), Issue 030 (categories) |
| Posted to by | Issue 051 |
| Pull Request | _to be linked_ |
