# Phase 03 - Enterprise Capabilities

**Release Range:** v0.9.0 - v0.11.0  
**Sprints:** Sprint 08, Sprint 09, Sprint 10  
**Issues:** 050 - 068  
**Phase Overview:** `academy/08-sprints/phase-03-enterprise-capabilities/phase-overview.md`

---

# Objective

Expand the ERP platform from a set of operational modules into an integrated enterprise system by
adding financial control, decision-support reporting, and process automation.

```text
Operational Transactions → Financial Consequence → Business Insight → Automated Process
```

---

# Milestones

| Milestone | Release | Issues | Epic |
|-----------|---------|--------|------|
| [Sprint 08 - Finance & Accounting](sprint-08-finance-accounting/) | v0.9.0 | 050 - 056 | Finance & Accounting |
| [Sprint 09 - Reporting & Analytics](sprint-09-reporting-analytics/) | v0.10.0 | 057 - 062 | Reporting & Analytics |
| [Sprint 10 - Workflow & Notification Engine](sprint-10-workflow-notification-engine/) | v0.11.0 | 063 - 068 | Workflow & Notification Engine |

---

# Issue Roster

| # | Title | Type | Module | Sprint |
|---|-------|------|--------|--------|
| 050 | Create Chart of Accounts | Feature | finance | Sprint 08 |
| 051 | Implement Journal Entry Posting | Feature | finance | Sprint 08 |
| 052 | Implement General Ledger | Feature | finance | Sprint 08 |
| 053 | Implement Accounts Receivable | Feature | finance | Sprint 08 |
| 054 | Implement Accounts Payable | Feature | finance | Sprint 08 |
| 055 | Implement Payment Processing | Feature | finance | Sprint 08 |
| 056 | Implement Financial Reporting | Feature | finance | Sprint 08 |
| 057 | Establish Reporting Architecture and Read Models | Feature | backend | Sprint 09 |
| 058 | Implement Report Definitions and Parameters | Feature | backend | Sprint 09 |
| 059 | Implement Cross-Module KPIs | Feature | backend | Sprint 09 |
| 060 | Create Executive Dashboard | Feature | frontend | Sprint 09 |
| 061 | Implement Report Export | Feature | backend | Sprint 09 |
| 062 | Implement Scheduled Reports | Task | backend | Sprint 09 |
| 063 | Build Workflow Engine Core | Feature | backend | Sprint 10 |
| 064 | Implement Approval Routing and Delegation | Feature | backend | Sprint 10 |
| 065 | Create Task Inbox | Feature | frontend | Sprint 10 |
| 066 | Implement Notification Service | Feature | backend | Sprint 10 |
| 067 | Implement Notification Templates and Preferences | Feature | backend | Sprint 10 |
| 068 | Migrate Purchase Requisition Approval to the Workflow Engine | Improvement | procurement | Sprint 10 |

---

# Why This Phase Sits Across Every Module

Phase 03 does not add business features. It adds a service layer that reads from — and in
Sprint 08's case, is triggered by — everything Phase 02 built.

```text
                        ERP Platform

        ┌───────────────┬───────────────┬───────────────┐

       HR          Inventory        Sales         Purchasing

        └───────────────┴───────┬───────┴───────────────┘

                                │

              ┌─────────────────┼─────────────────┐

          Finance           Reporting         Workflow
          Posting           Read Models        Engine
```

| Sprint | Reads from |
|--------|-----------|
| 08 Finance | Issue 041 (sales invoices), Issue 048 (matched supplier invoices) |
| 09 Reporting | Every module built through Sprint 08 |
| 10 Workflow | Issue 021 (reporting hierarchy), Issue 012 (roles) — and **replaces** the routing logic in Issues 025 and 045 |

---

# Paying Down the Deliberate Debt

Sprint 04 (Issue 025) and Sprint 07 (Issue 045) each hard-coded their own approval routing. That was
flagged at the time as deliberate — two real implementations make the right abstraction clearer than
one.

**Issue 068 is where that debt is paid.** It migrates Sprint 07's requisition approval onto the
Sprint 10 workflow engine with no behavior change, verified by regression tests. Issue 025's leave
approval is not migrated in this phase; note it as a candidate for the same treatment.

---

# Sprint Dependency Order

```text
Sprint 06 (Sales)      Sprint 07 (Purchasing)

        └───────────┬───────────┘

                    ↓

              Sprint 08
              Finance & Accounting

                    ↓

              Sprint 09
              Reporting & Analytics

                    ↓

              Sprint 10
              Workflow & Notification Engine
```

Sprint 08 cannot start until sales invoices (Issue 041) and matched supplier invoices (Issue 048)
exist. Sprint 09 depends on Sprint 08 because financial KPIs are the most valuable reports it will
produce. Sprint 10 generalizes the approval pattern prototyped in Sprint 07.

---

# Phase Exit Criteria

- [ ] All 19 issues closed.
- [ ] Every sales and supplier invoice produces a balanced journal entry.
- [ ] Trial Balance always balances; Balance Sheet equation always holds.
- [ ] Cross-module KPIs reconcile with their source modules.
- [ ] Workflow engine operational and configurable without code changes.
- [ ] Purchase requisition approval migrated to the workflow engine with unchanged behavior.
- [ ] Notifications delivered reliably with retry.
- [ ] Documentation and ERD updated.
- [ ] Releases v0.9.0 through v0.11.0 published.
