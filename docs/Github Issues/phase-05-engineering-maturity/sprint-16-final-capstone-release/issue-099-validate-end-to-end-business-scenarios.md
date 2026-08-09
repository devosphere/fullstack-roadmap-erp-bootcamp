# [TASK] Validate End-to-End Business Scenarios

<!-- GitHub title: [TASK] Validate End-to-End Business Scenarios
     Labels: task, ci, testing, priority: critical
     Milestone: Sprint 16 - Final Capstone Release
     Branch: feature/099-validate-end-to-end-business-scenarios
     Epic: Final Capstone Release
     Depends on: 091
     Blocks: 100
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [x] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [ ] High
- [x] Critical

## Module: ci
## Sprint: Sprint 16 - Final Capstone Release

---

## Summary

Execute four complete business scenarios through the actual interface — order-to-cash, procure-to-
pay, hire-to-retire, and period close — verifying every downstream effect across modules, not just
the final screen, and reconciling every financial figure against its source transactions.

## Background

Every module built since Sprint 02 has its own tests, and every one of them passes. That is not the
same claim as "the business works," and this issue is where that gap gets closed or found.

The specific failure mode this issue exists to catch: a sale can succeed at the API level — the
order confirms, the invoice issues — while somewhere in the chain a downstream effect silently
doesn't happen. Inventory (Issue 033) doesn't actually decrement. The receivable (Issue 053) posts
to the wrong account. The Trial Balance (Issue 056) stops balancing by one line item nobody
noticed. Each of those modules' own tests would still be green, because each was tested in
isolation against its own assumptions about what the modules around it do.

**A scenario passes only if every downstream effect is correct, not only the final screen** — this
is the standard stated when the sprint was planned, and it's the reason this issue reconciles
figures against source transactions rather than just checking that a request returned 200.

## User Story

As a Quality Assurance Lead,
I want the four core business processes validated end to end through the real interface,
So that the system is proven to work as a business, not just as a collection of individually correct modules.

## Acceptance Criteria

```gherkin
Given the Order to Cash scenario executed through the interface
When it completes — quote, order, delivery, invoice, payment
Then inventory has decreased by exactly the delivered quantity, revenue appears correctly in the Profit & Loss, and the Trial Balance still balances
```

```gherkin
Given the Procure to Pay scenario executed through the interface
When it completes — requisition, approval, purchase order, receipt, three-way match, payment
Then inventory has increased by exactly the received quantity, the payable settles correctly, and spend appears correctly in reporting
```

```gherkin
Given the Hire to Retire scenario executed through the interface
When it completes — employee creation, department/position assignment, attendance, leave, status change
Then the employee appears correctly in the organization tree, leave balance reflects the approved request, and access is revoked on the terminal status change
```

```gherkin
Given the Period Close scenario executed through the interface
When it completes — all transactions posted, aging reviewed, period closed
Then posting to the closed period is rejected, and the financial statements produced for that period are internally consistent
```

```gherkin
Given a defect found during any scenario
When it is triaged
Then it is either fixed within this issue's scope or explicitly accepted with a documented reason before the sprint proceeds
```

- [ ] Order to Cash scenario documented as a concrete script with expected outcomes at each step
- [ ] Procure to Pay scenario documented as a concrete script with expected outcomes at each step
- [ ] Hire to Retire scenario documented as a concrete script with expected outcomes at each step
- [ ] Period Close scenario documented as a concrete script with expected outcomes at each step
- [ ] Each scenario executed through the actual application interface, not by calling APIs directly
- [ ] Order to Cash: inventory decrease verified against the delivered quantity, revenue verified in the P&L, Trial Balance verified still balanced
- [ ] Procure to Pay: inventory increase verified against the received quantity, payable settlement verified, three-way match verified passing
- [ ] Hire to Retire: organization tree placement verified, leave balance deduction verified, access revocation on termination verified
- [ ] Period Close: closed-period posting rejection verified, financial statement internal consistency verified
- [ ] Every financial figure produced by a scenario reconciled against its source transactions
- [ ] Defects found logged, triaged, and either resolved or explicitly accepted with a documented reason
- [ ] Scenario results recorded as evidence, including screenshots or logs of each verification step

## Expected Result

Four real business processes are proven to work correctly across every module they touch, with
every downstream effect — not just the final confirmation screen — verified against what actually
changed in the system.

---

## Scope

### Included

- Four documented, executable scenario scripts
- Interface-driven execution (not API-only)
- Cross-module downstream effect verification
- Financial reconciliation
- Defect logging, triage, and resolution or documented acceptance
- Evidence recording

### Out of Scope

- Full regression testing of every individual feature (Issue 100)
- Load or performance testing (already covered in Sprint 12)
- Fixing defects unrelated to the four scenarios' correctness

## Technical Requirements

**Scenario 1 — Order to Cash**

```text
Create Customer (Issue 036)
    ↓
Quote (Issue 038) → accept → convert to Sales Order (Issue 039) → confirm
    ↓
Deliver Goods (Issue 040)
    ↓
    Verify: Inventory (Issue 032) reduced by exactly the delivered quantity,
            via a Stock Out movement (Issue 033) referencing this delivery
    ↓
Invoice Issued (Issue 041)
    ↓
    Verify: Receivable created (Issue 053), journal entry posted (Issue 051)
            Debit Accounts Receivable / Credit Sales Revenue
    ↓
Customer Pays (Issue 055)
    ↓
    Verify: Receivable settled, outstanding amount zero
    ↓
Verify: Revenue appears correctly in Profit & Loss (Issue 056) for the period
Verify: Trial Balance (Issue 056) total debits still equal total credits
```

**Scenario 2 — Procure to Pay**

```text
Requisition Raised (Issue 044)
    ↓
Workflow Routes for Approval (Issue 064, running via the migrated Issue 068 engine)
    → Approver Notified (Issue 066) → Approved
    ↓
Purchase Order Issued (Issue 046)
    ↓
Goods Received (Issue 047)
    ↓
    Verify: Inventory increased by exactly the accepted quantity,
            via a Stock In movement referencing this receipt
    ↓
Supplier Invoice → Three-Way Match Passes (Issue 048)
    ↓
    Verify: Payable created (Issue 054), journal entry posted
            Debit Expense / Credit Accounts Payable
    ↓
Payment Made (Issue 055)
    ↓
    Verify: Payable settled
    ↓
Verify: Spend appears correctly in procurement reporting (Issue 049)
```

**Scenario 3 — Hire to Retire**

```text
Employee Created (Issue 019) → Linked to User Account (Issue 020)
    ↓
Assigned Department and Position (Issues 017, 018)
    ↓
    Verify: Appears correctly in Organization Tree (Issue 021)
    ↓
Records Attendance (Issue 024)
    ↓
Submits Leave (Issue 025) → Workflow Approval → Balance Reduced (Issue 026)
    ↓
    Verify: Leave balance transaction history reflects the deduction
            exactly matching the approved request
    ↓
Employment Status Changed to Terminated (Issue 023)
    ↓
    Verify: Linked user account access revoked (per Issue 020's
            termination-coordination behavior)
```

**Scenario 4 — Period Close**

```text
All Transactions Posted (across Scenarios 1-3, or an equivalent representative set)
    ↓
Aging Reports Reviewed (Issues 053, 054)
    ↓
Trial Balance Verified (Issue 056)
    ↓
Fiscal Period Closed (Issue 051)
    ↓
    Verify: Posting to the closed period is rejected
    ↓
Financial Statements Produced (Issue 056)
    ↓
    Verify: Trial Balance balances, Balance Sheet equation holds,
            figures are internally consistent with the closed period's
            posted entries
```

**Execution method**

Run through the actual UI as a business user would — not by calling the API directly — since this
is the first time in the programme these flows are exercised end to end exactly as a real user
would experience them, which is precisely the kind of gap unit and integration tests (correctly
scoped to their own modules) cannot catch.

**Reconciliation discipline**

For every financial figure produced during a scenario, verify it against a direct query of the
source transactions — the same reconciliation discipline already established in Issue 059's KPIs
and Issue 094's business metrics, applied here at the scenario level.

## Dependencies

- Issue 091 — the stabilized test suite this issue's scenario execution builds confidence on top of.

## Definition of Done

- [ ] All four scenarios documented as concrete scripts
- [ ] All four scenarios executed through the interface
- [ ] Every listed cross-module verification passed
- [ ] Every financial figure reconciled against source transactions
- [ ] Defects logged, triaged, and resolved or explicitly accepted
- [ ] Scenario results recorded as evidence
- [ ] Code review completed (for any fixes made as part of this issue)
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-05-engineering-maturity/sprint-16-final-capstone-release.md` § 1 |
| Epic | Final Capstone Release |
| Validates | Issues 036-041, 053, 055, 056 (Scenario 1); Issues 044-048, 054, 064, 068 (Scenario 2); Issues 017-026 (Scenario 3); Issue 051, 056 (Scenario 4) |
| Pull Request | _to be linked_ |
