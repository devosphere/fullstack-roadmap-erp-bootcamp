# [FEATURE] Implement Journal Entry Posting

<!-- GitHub title: [FEATURE] Implement Journal Entry Posting
     Labels: feature, finance, priority: critical
     Milestone: Sprint 08 - Finance & Accounting
     Branch: feature/051-implement-journal-entry-posting
     Epic: Finance & Accounting
     Depends on: 050
     Blocks: 052
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

Implement double-entry journal posting: balanced entries with two or more lines, immutable once
posted, correctable only by reversal, and restricted to open fiscal periods.

## Background

This is the single rule the entire finance module depends on:

```text
Total Debits = Total Credits
```

It is not validated after the fact — an unbalanced entry must be impossible to persist. Every
downstream feature in this sprint — the ledger in Issue 052, receivables in Issue 053, payables in
Issue 054, payments in Issue 055 — posts through this service and inherits its guarantee.

Two more decisions matter as much as the balance rule:

- **Posted entries are immutable.** A financial record that can be silently edited after the fact is
  not a record. Corrections are reversing entries — a new entry with debits and credits swapped,
  linked to the original — which keeps both the mistake and its correction visible.
- **Fiscal periods gate posting.** Once a period is closed, nothing can post into it. Without this,
  a closed month's figures could change after the financial statements for that month were already
  produced and reviewed.

This module also establishes the pattern every automatic poster in this sprint follows: build a
balanced set of lines, call one posting service, and either the whole entry commits or none of it
does.

## User Story

As a Finance Officer,
I want to post balanced journal entries and correct mistakes only through reversal,
So that every financial record is trustworthy and the ledger can never go out of balance.

## Acceptance Criteria

```gherkin
Given a journal entry with debit lines totaling 45,000 and credit lines totaling 45,000
When it is posted
Then it succeeds and the entry status becomes Posted
```

```gherkin
Given a journal entry with debit lines totaling 45,000 and credit lines totaling 44,900
When posting is attempted
Then it is rejected and no entry is persisted as posted
```

```gherkin
Given a posted journal entry
When a user attempts to edit any of its lines
Then the request is rejected
```

```gherkin
Given a posted journal entry
When it is reversed
Then a new entry is created with debits and credits swapped, linked to the original
```

```gherkin
Given a closed fiscal period
When a journal entry dated within that period is posted
Then the request is rejected
```

```gherkin
Given any sequence of postings and reversals
When all posted entries are summed
Then total debits equal total credits across the whole ledger
```

- [ ] `GET /api/finance/journal-entries` lists entries with filtering
- [ ] `POST /api/finance/journal-entries` creates a draft entry with lines
- [ ] `POST /api/finance/journal-entries/{id}/post` posts a balanced draft entry
- [ ] `POST /api/finance/journal-entries/{id}/reverse` reverses a posted entry
- [ ] `GET /api/finance/periods` lists fiscal periods
- [ ] `POST /api/finance/periods` creates a fiscal period
- [ ] `POST /api/finance/periods/{id}/close` closes a period
- [ ] An entry requires at least two lines
- [ ] Posting rejected unless total debits equal total credits exactly
- [ ] Posted entries are immutable — no field update endpoint exists after posting
- [ ] Corrections are made only by posting a reversing entry
- [ ] Reversal creates a new, linked entry with amounts swapped
- [ ] Posting rejected for entries dated in a closed fiscal period
- [ ] Every entry records who posted it and when
- [ ] Every entry links to its source document when triggered automatically
- [ ] Posting exposed as a reusable service for Issues 053, 054, and 055
- [ ] Service accepts and participates in the caller's transaction
- [ ] Permissions declared and enforced
- [ ] ERD updated

## Expected Result

Every posted entry is balanced, permanent, and traceable to its source. The only way to change a
posted figure is to post an equal and opposite reversal, which leaves both visible forever.

---

## Scope

### Included

- Journal entry CRUD for drafts
- Balance validation at posting
- Immutability enforcement after posting
- Reversal as a linked, opposite entry
- Fiscal period entity and closing
- Posting restricted to open periods
- Reusable, transaction-safe posting service
- Source document linkage
- Permission enforcement
- ERD update

### Out of Scope

- General ledger balance aggregation and reporting (Issue 052)
- Automatic posting from sales and purchasing (Issues 053, 054)
- Payment posting (Issue 055)
- Financial statements (Issue 056)
- Multi-currency entries
- Approval workflow for manual entries (Sprint 10 could add this later)

## Technical Requirements

**Endpoints**

```text
GET    /api/finance/journal-entries
POST   /api/finance/journal-entries
POST   /api/finance/journal-entries/{id}/post
POST   /api/finance/journal-entries/{id}/reverse

GET    /api/finance/periods
POST   /api/finance/periods
POST   /api/finance/periods/{id}/close
```

**Schema**

```text
FiscalPeriod

id
name              e.g. "March 2026"
startDate
endDate
status            enum: OPEN | CLOSED
closedBy          → User, nullable
closedAt          nullable

JournalEntry

id
entryNumber       unique
entryDate
fiscalPeriodId    → FiscalPeriod
description
sourceType        nullable, e.g. SALES_INVOICE | SUPPLIER_INVOICE | PAYMENT | MANUAL
sourceId          nullable
reversalOfId      → JournalEntry, nullable
status            enum: DRAFT | POSTED
postedBy          → User, nullable
postedAt          nullable
createdAt

JournalEntryLine

id
journalEntryId    → JournalEntry
accountId         → Account
debitAmount       decimal, >= 0
creditAmount      decimal, >= 0
description

check (debitAmount = 0 OR creditAmount = 0)   -- a line is a debit or a credit, never both
```

**Posting validation**

```text
1. Entry has at least 2 lines
2. Every line references a postable account (Issue 050)
3. SUM(debitAmount) across all lines = SUM(creditAmount) across all lines
4. entryDate falls within an OPEN fiscal period
5. Set status = POSTED, postedBy, postedAt
```

All checks run inside the same transaction as the status change. If any fails, nothing is
persisted as posted.

**Reversal**

```text
1. Verify the original entry is POSTED
2. Create a new entry with the same lines, debitAmount and creditAmount swapped per line
3. Set reversalOfId to the original entry's id
4. Post the new entry through the same posting validation
```

The original entry is never modified — it remains in the ledger alongside its reversal, which is
what keeps the history honest.

**Posting service interface for later issues**

```text
postEntry(lines, entryDate, description, sourceType, sourceId)
    → validates balance and period, creates and posts the entry
    → must accept and participate in the caller's transaction
```

Issues 053, 054, and 055 call this rather than writing to `JournalEntry` directly.

**Entry numbering**

```text
JE-YYYY-NNNNN         e.g. JE-2026-01542
```

Generated server-side with a sequence or locked counter.

**Permissions to add**

```text
JOURNAL_ENTRY_READ
JOURNAL_ENTRY_CREATE
JOURNAL_ENTRY_POST
JOURNAL_ENTRY_REVERSE
FISCAL_PERIOD_MANAGE
```

Restrict `JOURNAL_ENTRY_POST` and `FISCAL_PERIOD_MANAGE` narrowly.

## Dependencies

- Issue 050 — the chart of accounts, for postable account validation.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for balance validation, including single-cent imbalance
- [ ] Unit test confirming an entry with fewer than 2 lines is rejected
- [ ] Unit test confirming posting to a non-postable account is rejected
- [ ] Unit test confirming posted entries reject every field update
- [ ] Unit test confirming reversal produces exactly swapped amounts and links to the original
- [ ] Unit test confirming posting into a closed period is rejected
- [ ] **Invariant test**: after a randomized sequence of postings and reversals, total debits equal total credits across the ledger
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
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-08-finance-accounting.md` § 2 |
| Epic | Finance & Accounting |
| Posts to | Issue 050 (chart of accounts) |
| Consumed by | Issues 053, 054, 055 |
| Pull Request | _to be linked_ |
