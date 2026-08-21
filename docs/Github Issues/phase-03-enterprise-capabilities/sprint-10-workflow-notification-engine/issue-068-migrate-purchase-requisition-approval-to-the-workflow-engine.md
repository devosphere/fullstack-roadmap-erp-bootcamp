# [IMPROVEMENT] Migrate Purchase Requisition Approval to the Workflow Engine

<!-- GitHub title: [IMPROVEMENT] Migrate Purchase Requisition Approval to the Workflow Engine
     Labels: improvement, procurement, technical-debt, priority: high
     Milestone: Sprint 10 - Workflow & Notification Engine
     Branch: feature/068-migrate-purchase-requisition-approval-to-the-workflow-engine
     Epic: Workflow & Notification Engine
     Depends on: 063, 064, 065, 067
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [ ] Task
- [x] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [x] High
- [ ] Critical

## Module: procurement
## Sprint: Sprint 10 - Workflow & Notification Engine

---

## Summary

Replace the hard-coded requisition approval routing built in Issue 045 with a configured
definition running on the workflow engine, with no change to approval behavior, verified by the
existing regression suite.

## Background

Sprint 07's `requisition-approval.service.ts` was written deliberately as a one-off, flagged at the
time as debt: solving one approval problem concretely, before Sprint 10 existed to generalize it.
This issue is where that debt is paid.

The measure of success stated throughout this sprint is that adding a new approval process requires
no new code — only configuration. This issue is the proof. If migrating an existing, working,
already-tested approval flow onto the engine requires anything beyond a `WorkflowDefinition` plus
its `WorkflowStep` rows, the engine built in Issues 063 and 064 has not actually generalized what it
set out to.

The discipline that matters most here: **this is a refactor, not a feature change.** Every
acceptance criterion from Issue 045 must still hold exactly. The existing regression suite from that
issue is the primary evidence this migration is safe, and it should pass unmodified — a test that
needs to change to pass is a sign behavior changed, which is not the goal.

## User Story

As a Procurement Officer,
I want requisition approval to work exactly as it did before,
So that migrating the underlying engine causes no disruption to how requisitions are approved.

## Acceptance Criteria

```gherkin
Given the full Issue 045 regression test suite
When it is run against the migrated implementation
Then every test passes without modification
```

```gherkin
Given a requisition with an estimated value within the department manager's limit
When it is submitted
Then it routes to the manager only, exactly as before migration
```

```gherkin
Given a requisition with an estimated value exceeding the manager's limit
When it is submitted
Then it routes through the manager and then escalates to the finance officer, exactly as before migration
```

```gherkin
Given the requester is also an eligible approver for their own requisition
When routing is resolved
Then self-approval is still blocked, using the engine's Issue 064 check rather than Issue 045's original check
```

```gherkin
Given the old requisition-approval.service.ts code path
When this issue is complete
Then it has been removed from the codebase, not left dormant alongside the new path
```

- [ ] `WorkflowDefinition` created for document type `PurchaseRequisition`
- [ ] `WorkflowStep` rows configured to reproduce Issue 045's approval limit chain exactly
- [ ] Step approver rules use `REPORTING_MANAGER` and `ROLE` types matching Issue 045's original resolution
- [ ] Requisition submission (Issue 044) starts a `WorkflowInstance` instead of calling the old service
- [ ] Requisition approval and rejection now flow through Issue 065's task inbox
- [ ] Self-approval prevention verified via Issue 064's engine-level check
- [ ] Approval history now recorded via Issue 064's `WorkflowAuditLog`
- [ ] Notification on task assignment now flows through Issues 066/067
- [ ] Issue 045's original hard-coded routing code removed
- [ ] Issue 045's original `ApprovalLimit` and `RequisitionApproval` entities either migrated into the workflow schema or explicitly mapped and retired — documented either way
- [ ] Existing Issue 045 regression tests pass unmodified against the new implementation
- [ ] Historical `RequisitionApproval` records from before the migration remain queryable
- [ ] Documentation updated to reflect the new approval path

## Expected Result

Requisition approval behaves identically from a user's perspective — same routing, same self-
approval prevention, same escalation by value — while running entirely on the general-purpose
engine. The special-case code that used to implement it is gone.

---

## Scope

### Included

- Workflow definition and steps reproducing Issue 045's approval limit chain
- Requisition submission wired to start a workflow instance
- Requisition approval and rejection routed through the task inbox
- Removal of the original hard-coded routing service
- Historical data handling
- Regression verification against the unmodified Issue 045 test suite
- Documentation update

### Out of Scope

- Migrating leave request approval (Issue 025) — noted as a follow-up candidate, not part of this issue
- Any behavior change or enhancement to requisition approval rules
- New approval features enabled only by the engine (e.g. new step types) — this issue reproduces existing behavior exactly, nothing more

## Technical Requirements

**Workflow definition to configure**

```text
WorkflowDefinition
    code: "purchase-requisition-approval"
    documentType: "PurchaseRequisition"
    version: 1
    isActive: true

WorkflowStep (stepOrder 1)
    approverRuleType: REPORTING_MANAGER
    condition: "estimatedValue <= 50000"      -- matches Issue 045's manager limit

WorkflowStep (stepOrder 2)
    approverRuleType: ROLE
    approverRuleValue: <Finance Officer role id>
    condition: "estimatedValue <= 500000"     -- matches Issue 045's finance limit

WorkflowStep (stepOrder 3)
    approverRuleType: ROLE
    approverRuleValue: <Director role id>
    condition: null                            -- unlimited, matches Issue 045
```

The condition expressions must reproduce Issue 045's `ApprovalLimit` table exactly — this is not an
opportunity to redesign the limits, only to relocate them into the engine's configuration model.

**Migration steps**

```text
1. Create the WorkflowDefinition and WorkflowStep rows (data migration or seed)
2. Update Issue 044's submission endpoint to call workflowService.startInstance(...)
   instead of the old routing service
3. Update Issue 046's purchase order creation check to read approval status
   from WorkflowInstance instead of the old RequisitionApproval chain
4. Run the full Issue 045 regression suite against this new wiring
5. Remove requisition-approval.service.ts and its now-unused routes
6. Decide and document the fate of the old ApprovalLimit and RequisitionApproval tables:
   either migrate their data into WorkflowStep/WorkflowAuditLog, or retain them
   read-only for historical reference — do not silently drop historical approval records
```

**Regression discipline**

The existing Issue 045 test suite is the acceptance bar. If a test must be edited to pass, that is
a signal this migration changed behavior — stop and reconcile the difference against Issue 045's
original acceptance criteria before proceeding, rather than adjusting the test to match the new
code.

**Historical data**

Requisitions approved before this migration keep their original `RequisitionApproval` records.
`GET /api/procurement/approvals/history/{requisitionId}` (Issue 045) should continue to serve old
records, while new requisitions produce `WorkflowAuditLog` entries retrievable via Issue 064's audit
endpoint. Document which endpoint serves which era of data, or unify them — either is acceptable if
explicit.

**Permissions**

No new permissions — this issue reuses `REQUISITION_APPROVE` from Issue 045 conceptually, mapped
onto task assignment via the engine's own access model from Issue 065. Confirm no permission gap
opens during the cutover.

## Dependencies

- Issue 063 — the workflow engine core.
- Issue 064 — approval routing, delegation, and the audit trail.
- Issue 065 — the task inbox, the new interface for procurement approvers.
- Issue 067 — templates and preferences, so the migrated flow's notifications render correctly.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Full Issue 045 regression suite passes unmodified
- [ ] **Parity test**: for a representative set of requisition values, the workflow-engine routing produces the identical approver chain the old service would have
- [ ] Test confirming self-approval is still blocked
- [ ] Test confirming purchase order creation (Issue 046) still correctly checks approval status through the new path
- [ ] Old routing code and now-dead routes removed
- [ ] Historical approval records remain queryable
- [ ] Manual verification: submit and approve a real requisition end to end through the new path
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request describing the migration and the fate of the old tables
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-10-workflow-notification-engine.md` |
| Epic | Workflow & Notification Engine |
| Replaces | Issue 045 (hard-coded requisition approval) |
| Runs on | Issue 063, Issue 064 |
| Related debt not covered here | Issue 025 (leave approval, not migrated) |
| Pull Request | _to be linked_ |
