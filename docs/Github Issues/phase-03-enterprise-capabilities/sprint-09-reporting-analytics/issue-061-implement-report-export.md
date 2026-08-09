# [FEATURE] Implement Report Export

<!-- GitHub title: [FEATURE] Implement Report Export
     Labels: feature, backend, priority: medium
     Milestone: Sprint 09 - Reporting & Analytics
     Branch: feature/061-implement-report-export
     Epic: Reporting & Analytics
     Depends on: 058
     Blocks: 062
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [x] Feature
- [ ] Bug
- [ ] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [x] Medium
- [ ] High
- [ ] Critical

## Module: backend
## Sprint: Sprint 09 - Reporting & Analytics

---

## Summary

Let users export report results to CSV and PDF, processing large exports in the background so the
request does not block, and recording every export in the audit trail.

## Background

A report viewed on screen (Issue 058) is useful in the moment. Export is what lets it leave the
system — attached to an email, dropped into a board presentation, filed for a compliance record.

The security requirement here is stricter than it looks: **an export must contain exactly the rows
the requesting user is permitted to see**, which means the export path re-runs the same
permission-scoped query as the on-screen report rather than dumping an unfiltered result set to a
file. A permission check that applies on screen but not on export is not a permission check.

The other constraint is size. A report over a full fiscal year could be tens of thousands of rows;
generating a PDF of that inline would block the request for the entire duration. Large exports move
to a background job, and the user is told to come back for the file rather than made to wait.

## User Story

As a Finance Manager,
I want to export a report to CSV or PDF,
So that I can share or archive it outside the application.

## Acceptance Criteria

```gherkin
Given a report with a small result set
When it is exported to CSV
Then the file downloads immediately and its contents match the on-screen report exactly
```

```gherkin
Given a report with a large result set exceeding the inline threshold
When export is requested
Then the request returns immediately with a job reference rather than blocking until the file is ready
```

```gherkin
Given a background export job has completed
When the user requests the download
Then the file is served and contains exactly what the export was scoped to
```

```gherkin
Given a user with limited row-level access to the underlying data
When they export a report
Then the exported file contains only rows they were permitted to see on screen
```

```gherkin
Given any export
When it completes
Then the report name, applied parameters, and generation timestamp appear in the file, and the action is recorded in the audit log
```

- [ ] `POST /api/reports/{reportCode}/export` starts an export
- [ ] `GET /api/reports/exports/{id}/download` downloads a completed export
- [ ] CSV export supported
- [ ] PDF export supported
- [ ] Export re-applies the same permission-scoped query as the on-screen report
- [ ] Small exports return the file inline
- [ ] Exports above a configured row threshold process as a background job
- [ ] Export status queryable while a background job is running
- [ ] Exported files include the report name, applied parameters, and generation timestamp
- [ ] Export activity recorded in the audit log with who exported what and when
- [ ] Export files stored securely and are not publicly accessible by guessable URL
- [ ] Permissions declared and enforced

## Expected Result

Users export exactly what they saw on screen, in a file that documents itself, without a large
export blocking the application. Every export is traceable after the fact.

---

## Scope

### Included

- CSV and PDF export
- Permission-scoped export matching the on-screen report exactly
- Inline export for small results, background job for large results
- Export status polling
- Self-documenting export files
- Audit logging of export activity
- Secure file storage and download
- Permission enforcement

### Out of Scope

- Scheduled export delivery (Issue 062)
- Excel or other additional formats
- Export templates and custom branding
- Bulk export of multiple reports at once

## Technical Requirements

**Endpoints**

```text
POST /api/reports/{reportCode}/export
GET  /api/reports/exports/{id}
GET  /api/reports/exports/{id}/download
```

**Schema**

```text
ReportExport

id
reportDefinitionId    → ReportDefinition
requestedBy           → User
parameters             stored as structured data
format                 enum: CSV | PDF
status                 enum: PROCESSING | COMPLETED | FAILED
filePath               nullable, set on completion
rowCount               nullable
requestedAt
completedAt            nullable
```

**Inline vs. background threshold**

```text
Estimated row count <= threshold (e.g. 5,000)   → generate and return inline
Estimated row count >  threshold                 → enqueue a background job, return the export id
```

Estimate the row count with a cheap `COUNT` query against the same parameters before deciding the
path — this reuses the parameter validation already built in Issue 058.

**Permission-scoped export**

The export service calls the exact same `reporting-query.service` method and parameter set that
Issue 058's `run` endpoint uses for on-screen results — never a separate, unscoped export query
path. This is the single most important rule in this issue: two code paths for the same data is how
an export ends up leaking rows a screen would have hidden.

**Background processing**

```text
POST /api/reports/{reportCode}/export

    → row count exceeds threshold

    → ReportExport row created with status PROCESSING

    → job enqueued

    → response returns { exportId, status: "PROCESSING" }

Background worker:

    → runs the same scoped query
    → generates the file
    → stores it
    → sets status COMPLETED and filePath

    (or status FAILED with an error captured, on failure)
```

**File content requirements**

Every export — inline or background — includes a header section or footer with:

```text
Report: <name>
Parameters: <applied parameter values>
Generated: <timestamp>
Generated by: <user>
```

**Storage and access**

Files are stored outside the web root, referenced only by the `ReportExport.id`. The download
endpoint re-checks the requester's permission before serving the file — a completed export is not
retroactively exempt from the access control that scoped it.

**Permissions to add**

No new permission code — export inherits the `requiredPermission` already declared on the
`ReportDefinition` in Issue 058. A user who can run the report can export it; a user who cannot,
cannot.

## Dependencies

- Issue 058 — report definitions, parameters, and the scoped query this issue must reuse exactly.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for the inline/background threshold decision
- [ ] Integration test confirming CSV export content matches the on-screen report exactly
- [ ] Integration test confirming PDF export contains the report name, parameters, and timestamp
- [ ] **Security test**: an export by a permission-limited user contains only the rows that user's on-screen report would show
- [ ] Test confirming a large export processes in the background without blocking the request
- [ ] Test confirming the download endpoint re-checks permission independently of export creation
- [ ] Test confirming export activity is recorded in the audit log
- [ ] Denial tests for users without the underlying report permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-09-reporting-analytics.md` § 5 |
| Epic | Reporting & Analytics |
| Reuses the scoped query from | Issue 058 |
| Consumed by | Issue 062 (scheduled reports) |
| Pull Request | _to be linked_ |
