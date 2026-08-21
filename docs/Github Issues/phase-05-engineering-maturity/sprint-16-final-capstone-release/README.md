# Sprint 16 - Final Capstone Release

**Milestone:** Sprint 16 - Final Capstone Release  
**Release:** v2.0.0  
**Phase:** Phase 05 - Engineering Maturity  
**Duration:** 3-4 Weeks  
**Sprint Spec:** `academy/08-sprints/phase-05-engineering-maturity/sprint-16-final-capstone-release.md`

---

# Milestone Definition

| Field | Value |
|-------|-------|
| Title | `Sprint 16 - Final Capstone Release` |
| Due date | End of sprint |
| Description | Validate the system as a business, complete documentation, present it, and publish v2.0.0. |

---

# Sprint Goal

Validate every business scenario end to end, complete documentation, deliver the capstone
demonstration, publish v2.0.0, and close the programme with an honest retrospective.

---

# Epic

**[Final Capstone Release](epic-16-final-capstone-release.md)**

---

# Issue Roster

| # | File | GitHub Title | Type | Labels | Branch |
|---|------|--------------|------|--------|--------|
| 099 | [issue-099](issue-099-validate-end-to-end-business-scenarios.md) | `[TASK] Validate End-to-End Business Scenarios` | Task | `task`, `ci`, `testing`, `priority: critical` | `feature/099-validate-end-to-end-business-scenarios` |
| 100 | [issue-100](issue-100-execute-full-regression-and-user-acceptance-testing.md) | `[TASK] Execute Full Regression and User Acceptance Testing` | Task | `task`, `ci`, `testing`, `priority: critical` | `feature/100-execute-full-regression-and-user-acceptance-testing` |
| 101 | [issue-101](issue-101-complete-user-documentation.md) | `[DOCS] Complete User Documentation` | Documentation | `documentation`, `docs`, `priority: high` | `docs/101-complete-user-documentation` |
| 102 | [issue-102](issue-102-complete-technical-documentation.md) | `[DOCS] Complete Technical Documentation` | Documentation | `documentation`, `docs`, `priority: high` | `docs/102-complete-technical-documentation` |
| 103 | [issue-103](issue-103-deliver-capstone-demonstration.md) | `[TASK] Deliver Capstone Demonstration` | Task | `task`, `docs`, `priority: high` | `feature/103-deliver-capstone-demonstration` |
| 104 | [issue-104](issue-104-execute-v2.0.0-release-and-program-retrospective.md) | `[TASK] Execute v2.0.0 Release and Program Retrospective` | Task | `task`, `ci`, `priority: critical` | `feature/104-execute-v2.0.0-release-and-program-retrospective` |

All six issues take **Milestone:** `Sprint 16 - Final Capstone Release`.

---

# Dependency Order

```text
099 End-to-End Business Scenario Validation

        ↓

100 Full Regression & User Acceptance Testing

        ↓

101 User Documentation      102 Technical Documentation

        └───────────┬───────────────┘

                    ↓

           103 Capstone Demonstration

                    ↓

           104 Execute v2.0.0 Release & Program Retrospective
```

Issues 101 and 102 can run in parallel once validation (099, 100) confirms the system behaves as
documented.

---

# The Test That Closes the Programme

Not module-by-module correctness — every prior sprint already proved that. This sprint proves the
system works **as one business**, by running four scenarios through the actual interface and
verifying every downstream effect, not just the final screen:

```text
Order to Cash        Quote → Order → Deliver → Inventory reduced → Invoice → Payment → P&L → Trial Balance still balances

Procure to Pay        Requisition → Approval → PO → Receive → Inventory increased → Match → Payable → Payment

Hire to Retire         Employee → Department/Position → Attendance → Leave → Balance reduced → Status changed → Access revoked

Period Close            All posted → Aging reviewed → Trial Balance verified → Period closed → Posting rejected → Statements produced
```

If any of these breaks — even if every individual module's own tests are green — that is an
integration gap Issue 099 exists to find before a real user does.

---

# Full Release History

| Version | Sprint | Capability |
|---------|--------|------------|
| v0.1.0 | Sprint 00 | Project foundation and engineering setup |
| v0.2.0 | Sprint 01 | Application foundation and full-stack setup |
| v0.3.0 | Sprint 02 | Identity and access management |
| v0.4.0 | Sprint 03 | Organization and employee management |
| v0.5.0 | Sprint 04 | Human resource management |
| v0.6.0 | Sprint 05 | Inventory management |
| v0.7.0 | Sprint 06 | Sales management |
| v0.8.0 | Sprint 07 | Purchasing management |
| v0.9.0 | Sprint 08 | Finance and accounting |
| v0.10.0 | Sprint 09 | Reporting and analytics |
| v0.11.0 | Sprint 10 | Workflow and notification engine |
| v0.12.0 | Sprint 11 | Security hardening |
| v0.13.0 | Sprint 12 | Performance and scalability |
| v1.0.0 | Sprint 13 | Production release |
| v1.1.0 | Sprint 14 | Refactoring and technical debt reduction |
| v1.2.0 | Sprint 15 | Monitoring and observability |
| **v2.0.0** | **Sprint 16** | **Final capstone release** |

---

# Sprint Definition of Done

- [ ] All four end-to-end scenarios pass, including reconciled financial figures.
- [ ] Full regression passes; UAT signed off; no critical or high defects open.
- [ ] User manuals complete for every module, verified against the actual UI.
- [ ] Technical documentation complete; setup guide verified on a clean environment.
- [ ] Capstone demonstration delivered against production.
- [ ] All release gates passed; v2.0.0 tagged, deployed, and verified.
- [ ] Program retrospective documented; continuous improvement plan published with owners.
- [ ] Release v2.0.0 published.

---

# Release Notes Draft

```markdown
# v2.0.0

Final capstone release of the ERP platform.

## Complete Capability Set

- Identity and Access Management
- Organization and Employee Management
- Human Resource Management
- Inventory Management
- Sales Management
- Purchasing Management
- Finance and Accounting
- Reporting and Analytics
- Workflow and Notification Engine

## Engineering Quality

- Security hardened with a documented threat model
- Performance budgets met under load
- Consolidated codebase with a tracked debt register
- Full observability with logs, metrics, traces, and SLOs

## Operations

- Automated deployment with rollback
- Verified backup and disaster recovery
- Alerting with runbooks and incident response

## Documentation

- User manuals for every module
- Complete technical documentation and ADR index
- Verified setup and operational runbooks

## Validation

- All end-to-end business scenarios validated
- Full regression passed
- User acceptance testing signed off
```
