# Sprint 16 - Final Capstone Release

**Sprint:** Sprint 16  
**Phase:** Phase 05 - Engineering Maturity  
**Duration:** 3-4 Weeks  
**Release Target:** v2.0.0  
**Status:** Planned

---

# Sprint Goal

Complete the ERP Bootcamp by validating every business scenario end to end, running a full regression and user acceptance cycle, finishing the documentation set, delivering the capstone demonstration, publishing the v2.0.0 release, and producing a program retrospective with a continuous improvement plan.

At the end of this sprint, the learner should hold a complete, documented, production-operated enterprise system and be able to explain and defend every decision inside it.

---

# Sprint Context

Sixteen sprints of work are complete:

```text
Phase 00    Engineering foundation and application setup
Phase 01    Identity, organization, employees
Phase 02    HR, inventory, sales, purchasing
Phase 03    Finance, reporting, workflow
Phase 04    Security, performance, production release
Phase 05    Technical debt, observability
```

Each sprint validated its own scope. No sprint has yet validated the **whole system as one product**.

Sprint 16 does that.

```text
Does each module work?           Answered in every sprint

Does the business work?          Answered here
```

---

# Business Outcome

After completing this sprint, the ERP platform will have:

- Every end-to-end business scenario validated.
- A full regression cycle passed.
- User acceptance testing signed off.
- Complete user manuals for every module.
- Complete technical documentation.
- A delivered capstone demonstration.
- The v2.0.0 release published.
- A program retrospective and improvement plan.

---

# Sprint Objectives

By the end of this sprint, learners should be able to:

- Validate a system against business outcomes rather than technical criteria.
- Plan and execute user acceptance testing.
- Write documentation for non-technical users.
- Present technical work to a business audience.
- Assess a full delivery lifecycle honestly.
- Plan continuous improvement beyond the program.

---

# Sprint Theme

## "The Product Is the Whole, Not the Parts"

A system can pass every module test and still fail the business:

```text
Sales works
Inventory works
Finance works

        ↓

But selling a product does not reduce stock correctly
and the revenue does not appear in the Profit & Loss
```

Integration failures live in the gaps between sprints. This sprint is where those gaps are found and closed.

---

# Business Capability

## Product Completion

This sprint delivers:

- End-to-end validation.
- Full regression assurance.
- User acceptance.
- Complete documentation.
- Capstone demonstration.
- Final release.
- Program retrospective.

---

# Domain Concepts

---

# End-to-End Business Scenario

A complete business process crossing multiple modules, validated as a single outcome.

```text
Not: "the sales order API returns 201"

But: "the company sold goods, stock decreased, revenue was recognized,
      the customer paid, and the Balance Sheet is correct"
```

---

# Regression Testing

Confirming that nothing previously working has broken.

```text
16 sprints of features

        ↓

One suite

        ↓

All still passing
```

---

# User Acceptance Testing

Validation performed from the business user's perspective, against business criteria.

```text
Developer testing       Does the code do what I built?

Acceptance testing      Does the system do what the business needs?
```

---

# Major Version

A version number that signals a completed, stable product rather than an increment.

```text
v1.0.0    First production release
v2.0.0    Complete, hardened, documented, observable product
```

---

# Capstone Demonstration

A structured presentation of the system, its architecture, and the engineering process behind it, delivered to a stakeholder audience.

---

# Continuous Improvement Plan

The set of actions that carry forward after the program ends.

```text
The program finishes

        ↓

The system does not
```

---

# Sprint Scope

---

# 1. End-to-End Business Scenario Validation

## Objective

Prove the system works as a business, not as a set of modules.

## Scenarios

### Scenario 1 — Order to Cash

```text
Create Customer

        ↓

Quote → Sales Order → Deliver Goods

        ↓

Inventory Reduced

        ↓

Invoice Issued → Receivable Created → Journal Posted

        ↓

Customer Pays → Receivable Settled

        ↓

Revenue Appears in Profit & Loss

        ↓

Trial Balance Balances
```

---

### Scenario 2 — Procure to Pay

```text
Requisition Raised

        ↓

Workflow Routes for Approval → Approver Notified → Approved

        ↓

Purchase Order Issued

        ↓

Goods Received → Inventory Increased

        ↓

Supplier Invoice → Three-Way Match Passes

        ↓

Payable Created → Journal Posted

        ↓

Payment Made → Payable Settled

        ↓

Spend Appears in Reporting
```

---

### Scenario 3 — Hire to Retire

```text
Employee Created → Linked to User Account

        ↓

Assigned Department and Position

        ↓

Appears in Organization Tree

        ↓

Records Attendance

        ↓

Submits Leave → Workflow Approval → Balance Reduced

        ↓

Employment Status Changed

        ↓

Access Revoked
```

---

### Scenario 4 — Period Close

```text
All Transactions Posted

        ↓

Aging Reports Reviewed

        ↓

Trial Balance Verified

        ↓

Fiscal Period Closed

        ↓

Posting to Closed Period Rejected

        ↓

Financial Statements Produced
```

---

## Business Rules

- Each scenario is executed as a business user would, through the interface.
- Financial figures are reconciled against the source transactions.
- A scenario passes only if every downstream effect is correct, not only the final screen.
- Defects found are fixed within this sprint or explicitly accepted.

## Acceptance Criteria

- All four scenarios documented and executed.
- Each scenario passes end to end.
- Cross-module effects verified, including inventory and ledger.
- Defects logged, triaged, and resolved or accepted.
- Scenario results recorded as evidence.

---

# 2. Full Regression and User Acceptance Testing

## Objective

Confirm nothing has broken and the business accepts the result.

## Tasks

- Run the complete automated test suite against the release candidate.
- Execute manual regression on areas without automated coverage.
- Prepare UAT scripts from the acceptance criteria of all sixteen sprints.
- Execute UAT with a business perspective.
- Log, triage, and resolve findings.
- Obtain written sign-off.

## Business Rules

- No critical or high defect may remain open at release.
- Medium and low defects are documented and scheduled.
- UAT is executed against a production-like environment with realistic data.
- Sign-off is recorded, not assumed.

## Acceptance Criteria

- Full automated suite passes.
- Manual regression completed on uncovered areas.
- UAT scripts prepared and executed.
- All findings triaged.
- No critical or high defects open.
- Sign-off recorded.

---

# 3. Documentation Completion

## Objective

Make the system usable and maintainable by people who did not build it.

## User Documentation

```text
Getting Started
Identity and Access Management
Organization and Employee Management
Human Resources
Inventory
Sales
Purchasing
Finance and Accounting
Reporting and Analytics
Workflows and Approvals
Administration
```

## Technical Documentation

```text
Architecture Documentation
Entity Relationship Diagram
API Documentation
ADR Index
Local Setup Guide
Deployment Runbook
Disaster Recovery Runbook
Observability Runbook
Alert Catalogue
Contributing Guide
```

## Business Rules

- User manuals are written for business users, without engineering vocabulary.
- Every documented procedure is executed to confirm it works.
- Screenshots reflect the released version.
- The setup guide is verified on a clean machine by following it exactly.
- Documentation lives in the repository and is versioned with the code.

## Acceptance Criteria

- User manual completed for every module.
- Technical documentation complete and current.
- Every procedure verified by execution.
- Setup guide verified on a clean environment.
- Documentation index published.

---

# 4. Capstone Demonstration and Portfolio

## Objective

Present the work as a professional engineer presents delivered software.

## Demonstration Structure

```text
1. Business Problem
   What an ERP solves and for whom

2. Solution Overview
   Modules delivered and business value

3. Live Demonstration
   One complete business scenario end to end

4. Architecture
   Frontend, backend, database, workers, telemetry

5. Engineering Process
   Issues, branches, pull requests, reviews, CI, releases

6. Quality Evidence
   Tests, security findings, performance results, SLOs

7. Operations
   Deployment, rollback, backup, monitoring, incident response

8. Lessons Learned
   What was hard, what changed, what would be done differently
```

## Portfolio Artifacts

```text
Repository with full commit and pull request history
16 sprint documents and 104 issues
Release history v0.1.0 through v2.0.0
Architecture documentation and ADRs
Test, security, and performance reports
Dashboards and SLO evidence
Capstone presentation
```

## Business Rules

- The demonstration is delivered live against the production environment.
- Technical decisions must be defended, not only described.
- The presentation is understandable by a non-technical stakeholder.

## Acceptance Criteria

- Presentation prepared and delivered.
- Live demonstration completed successfully.
- Architecture and process explained.
- Quality evidence presented.
- Questions answered.
- Portfolio artifacts assembled and accessible.

---

# 5. v2.0.0 Release

## Objective

Publish the final release of the program.

## Tasks

- Finalize the CHANGELOG across all versions.
- Write the v2.0.0 release notes.
- Verify the release candidate against all gates.
- Tag and deploy through the pipeline.
- Run post-release verification.
- Monitor through a stabilization period.
- Publish the release.

## Release Gates

```text
All automated tests passing
No critical or high security findings
Performance budgets met
SLOs met
UAT signed off
Documentation complete
Backup verified
Rollback plan documented
```

## Business Rules

- Every gate must pass; none may be waived without written acceptance.
- The release is tagged from a green pipeline only.
- Post-release verification is executed and recorded.

## Acceptance Criteria

- CHANGELOG complete across all releases.
- Release notes written.
- All release gates passed.
- Release tagged and deployed through the pipeline.
- Post-release verification completed.
- Stabilization period observed without critical incidents.
- v2.0.0 published.

---

# 6. Program Retrospective and Continuous Improvement Plan

## Objective

Close the program honestly and define what continues.

## Retrospective Scope

```text
The whole program, not one sprint

Phase 00 through Phase 05
Sprint 00 through Sprint 16
```

## Discussion Areas

```text
What went well across the program
What was consistently difficult
Which decisions aged well
Which decisions created the most debt
Where estimates were wrong and why
What would be done differently starting again
Which skills grew most
Which skills still need work
```

## Continuous Improvement Plan

```text
System improvements still outstanding
Remaining technical debt with owners
Skills to develop next
Practices to keep
Practices to change
Next learning objectives
```

## Business Rules

- The retrospective is honest, including about failures.
- Every improvement action has an owner and a target.
- The technical debt register is carried forward, not closed.

## Acceptance Criteria

- Program retrospective completed and documented.
- All phases and sprints reviewed.
- Improvement actions defined with owners.
- Technical debt register carried forward.
- Continuous improvement plan published.

---

# Release History

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
| v2.0.0 | Sprint 16 | Final capstone release |

---

# GitHub Execution

---

# Epic

## Epic: Final Capstone Release

Purpose:

Validate, document, present, and publish the completed ERP platform.

---

# GitHub Issues

---

# Issue 099 - Validate End-to-End Business Scenarios

Type:

```
Task
```

Acceptance Criteria:

- All four scenarios documented and executed.
- Each scenario passes end to end.
- Cross-module effects verified including inventory and ledger.
- Defects logged, triaged, and resolved or accepted.
- Results recorded as evidence.

---

# Issue 100 - Execute Full Regression and User Acceptance Testing

Type:

```
Task
```

Acceptance Criteria:

- Full automated suite passes.
- Manual regression completed on uncovered areas.
- UAT scripts prepared and executed.
- No critical or high defects open.
- Sign-off recorded.

---

# Issue 101 - Complete User Documentation

Type:

```
Documentation
```

Acceptance Criteria:

- User manual completed for every module.
- Written for business users without engineering vocabulary.
- Every procedure verified by execution.
- Screenshots reflect the released version.

---

# Issue 102 - Complete Technical Documentation

Type:

```
Documentation
```

Acceptance Criteria:

- Architecture, ERD, and API documentation current.
- ADR index complete.
- All runbooks current.
- Setup guide verified on a clean environment.
- Documentation index published.

---

# Issue 103 - Deliver Capstone Demonstration

Type:

```
Task
```

Acceptance Criteria:

- Presentation prepared and delivered.
- Live demonstration completed against production.
- Architecture and engineering process explained.
- Quality evidence presented.
- Portfolio artifacts assembled.

---

# Issue 104 - Execute v2.0.0 Release and Program Retrospective

Type:

```
Task
```

Acceptance Criteria:

- CHANGELOG complete across all releases.
- All release gates passed.
- v2.0.0 tagged, deployed, and verified.
- Program retrospective documented.
- Continuous improvement plan published with owners.

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

The same workflow used in Sprint 00 is used in Sprint 16. That consistency is itself a result.

---

# Testing Requirements

## End-to-End Testing

All four business scenarios, executed through the interface, with downstream effects verified.

---

## Regression Testing

The complete automated suite plus manual regression on uncovered areas.

---

## User Acceptance Testing

Business-perspective validation against the acceptance criteria of all sixteen sprints.

---

## Non-Functional Verification

Confirm at release:

- Security gates from Sprint 11 pass.
- Performance budgets from Sprint 12 are met.
- SLOs from Sprint 15 are met.
- Backup restore from Sprint 13 remains verified.

---

# Documentation Deliverables

## Business Documentation

- User manuals for every module.
- UAT results and sign-off.
- Capstone presentation.
- Program retrospective.
- Continuous improvement plan.

---

## Technical Documentation

- Final architecture documentation.
- Final ERD.
- Final API documentation.
- ADR index.
- All operational runbooks.
- Complete CHANGELOG.
- Documentation index.

---

# Sprint Deliverables

## Validation

Completed:

- Four end-to-end business scenarios validated.
- Full regression passed.
- UAT signed off.

---

## Documentation

Completed:

- User manuals for every module.
- Technical documentation complete and verified.

---

## Presentation

Completed:

- Capstone demonstration delivered.
- Portfolio assembled.

---

## Release

Completed:

- v2.0.0 tagged, deployed, verified, and published.
- Program retrospective documented.
- Continuous improvement plan published.

---

# Sprint Review

The learner demonstrates:

1. Execute the order-to-cash scenario end to end.
2. Show the revenue appearing in the Profit & Loss and the Trial Balance balancing.
3. Execute the procure-to-pay scenario including workflow approval.
4. Show the full test suite passing.
5. Show the user manuals and verified setup guide.
6. Deliver the capstone presentation.
7. Show the v2.0.0 release and its verification record.

---

# Sprint Retrospective

This retrospective covers the entire program.

## What Went Well

Across all sixteen sprints.

---

## What Was Difficult

Recurring challenges and where they came from.

---

## What Would Be Done Differently

Decisions that would change if starting again at Sprint 00.

---

## What Continues

Improvement actions, remaining debt, and the next learning objectives.

---

# Release

**Version:** `v2.0.0`

This is the final release of the ERP Bootcamp program.

---

# Release Notes

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

---

# Definition of Done

Sprint 16 is complete when:

- [ ] All four end-to-end business scenarios pass.
- [ ] Cross-module effects verified including inventory and ledger.
- [ ] Full automated test suite passes.
- [ ] Manual regression completed.
- [ ] UAT executed and signed off.
- [ ] No critical or high defects open.
- [ ] User manuals completed for every module.
- [ ] Technical documentation complete and verified.
- [ ] Setup guide verified on a clean environment.
- [ ] Capstone demonstration delivered.
- [ ] Portfolio artifacts assembled.
- [ ] All release gates passed.
- [ ] CHANGELOG complete across all releases.
- [ ] v2.0.0 tagged, deployed, and verified.
- [ ] Stabilization period observed without critical incidents.
- [ ] Program retrospective documented.
- [ ] Continuous improvement plan published with owners.
- [ ] Release v2.0.0 published.

---

# Skills Acquired

After completing Sprint 16, learners will have demonstrated:

## Business Analysis

- Validating software against business outcomes.
- Planning and running user acceptance testing.
- Writing for non-technical users.

---

## Engineering

- Delivering a complete enterprise system.
- Maintaining quality across a long programme.
- Operating software in production.

---

## Communication

- Presenting technical work to stakeholders.
- Defending architectural decisions.
- Documenting for future maintainers.

---

## Professional Maturity

- Honest self-assessment.
- Continuous improvement planning.
- Ownership of a system across its whole lifecycle.

---

# Program Completion

The ERP Bootcamp is complete.

The learner has delivered:

```text
16 Sprints

104 GitHub Issues

17 Releases

9 Business Modules

1 Production Enterprise System
```

And has practised the full lifecycle:

```text
Understanding Business Problems

        ↓

Analyzing Requirements

        ↓

Designing Solutions

        ↓

Building Full-Stack Applications

        ↓

Testing Software Quality

        ↓

Securing Systems

        ↓

Deploying to Production

        ↓

Observing and Operating

        ↓

Maintaining and Improving
```

---

# Final Principle

The final output is not the ERP application.

The final output is a professional software engineer capable of owning the complete software delivery lifecycle.
