# [FEATURE] Implement Report Definitions and Parameters

<!-- GitHub title: [FEATURE] Implement Report Definitions and Parameters
     Labels: feature, backend, priority: high
     Milestone: Sprint 09 - Reporting & Analytics
     Branch: feature/058-implement-report-definitions-and-parameters
     Epic: Reporting & Analytics
     Depends on: 057
     Blocks: 059
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
- [x] High
- [ ] Critical

## Module: backend
## Sprint: Sprint 09 - Reporting & Analytics

---

## Summary

Let a report be defined once — with typed, validated parameters — and run repeatedly with
different inputs, without writing a new endpoint for every variation.

## Background

Every dashboard built so far returns a fixed shape with a fixed set of filters. That works for a
dashboard. It does not work for a report catalogue, where the business will keep asking for new
views of the same underlying data — "sales by customer this quarter," "sales by product last
month" — and a fixed endpoint per request does not scale as an approach.

The fix is to treat a report as data: a `ReportDefinition` names a data source and declares its
parameters; running it means supplying values for those parameters and validating them before the
query executes.

Parameter validation matters here in a way it has not elsewhere in the programme, because these
parameters go directly into a query against the read models from Issue 057. An inverted date
range, an out-of-range page size, or an unrecognized parameter must be rejected before it reaches
the query layer — not caught by the query failing unpredictably.

## User Story

As a Business User,
I want to browse available reports and run them with my own parameters,
So that I can answer specific questions without asking engineering to build a new endpoint.

## Acceptance Criteria

```gherkin
Given a report definition requiring a date range
When it is run without the required parameters
Then the request is rejected with a clear validation message naming what is missing
```

```gherkin
Given a report definition run with a start date after its end date
When the request is validated
Then it is rejected
```

```gherkin
Given a user without the permission required by a report definition
When they attempt to run it
Then the request is rejected
```

```gherkin
Given a report that returns a large result set
When it is requested
Then results are paginated and sortable rather than returned as one unbounded response
```

- [ ] `GET /api/reports` lists report definitions by category
- [ ] `GET /api/reports/{reportCode}` returns a report definition's metadata
- [ ] `GET /api/reports/{reportCode}/parameters` returns its parameter schema
- [ ] `POST /api/reports/{reportCode}/run` executes the report with supplied parameters
- [ ] Report definitions declare a data source pointing at an Issue 057 read model
- [ ] Parameters typed: date, string, number, reference (e.g. customerId)
- [ ] Required parameters enforced
- [ ] Parameter values validated against their declared type before query execution
- [ ] Date range parameters rejected when inverted
- [ ] Each report definition declares a required permission
- [ ] Report execution recorded, including who ran it, with what parameters, and how long it took
- [ ] Results paginated and sortable
- [ ] Initial report catalogue seeded covering sales, inventory, procurement, HR, and finance
- [ ] Permissions declared and enforced

## Expected Result

A business user browses a catalogue, picks a report, supplies parameters, and gets validated,
paginated results — all without a new backend endpoint per report.

---

## Scope

### Included

- Report definition and parameter schema
- Report catalogue endpoint
- Parameter validation
- Report execution against Issue 057 read models
- Execution logging
- Pagination and sorting of results
- Initial report catalogue seed
- Permission enforcement per report

### Out of Scope

- KPI calculation (Issue 059)
- Dashboard visualization (Issue 060)
- Export (Issue 061)
- Scheduling (Issue 062)
- A report-definition authoring UI — reports are seeded, not user-created, in this issue

## Technical Requirements

**Endpoints**

```text
GET  /api/reports
GET  /api/reports/{reportCode}
GET  /api/reports/{reportCode}/parameters
POST /api/reports/{reportCode}/run
```

**Schema**

```text
ReportDefinition

id
reportCode           unique
name
category
description
requiredPermission
dataSource           references an Issue 057 read model
status               enum: ACTIVE | INACTIVE

ReportParameter

id
reportDefinitionId   → ReportDefinition
parameterKey
dataType             enum: DATE | STRING | NUMBER | REFERENCE
isRequired
defaultValue
displayOrder

ReportExecution

id
reportDefinitionId   → ReportDefinition
executedBy           → User
parameters           stored as structured data
rowCount
durationMs
executedAt
status                enum: SUCCESS | FAILED
```

**Parameter validation**

```text
1. Every isRequired parameter has a supplied value
2. Each value matches its declared dataType
3. Domain-specific rules: e.g. a "dateTo" parameter must not precede "dateFrom"
4. Unknown parameters in the request are rejected, not silently dropped
```

Silently dropping unrecognized parameters (rather than rejecting them) hides client bugs — the same
principle applied to the self-service contact update in Issue 027.

**Initial catalogue to seed**

```text
sales-by-customer         dateFrom, dateTo, customerId (optional)
sales-by-product          dateFrom, dateTo, categoryId (optional)
inventory-by-warehouse    warehouseId (optional)
procurement-by-supplier   dateFrom, dateTo, supplierId (optional)
receivables-aging         asOfDate
payables-aging            asOfDate
```

**Execution flow**

```text
Client supplies reportCode and parameters

        ↓

Validate parameters against the definition

        ↓

Check requiredPermission against the current user

        ↓

Execute against the Issue 057 read model via the reporting query service

        ↓

Record a ReportExecution row

        ↓

Return paginated, sorted results
```

**Permissions**

Each `ReportDefinition.requiredPermission` references an existing permission code from earlier
sprints (e.g. `SALES_ORDER_READ`) rather than inventing a parallel permission system — a report
should require the same access as the data it summarizes.

## Dependencies

- Issue 057 — the read models this issue's reports query.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for parameter validation, including missing required, wrong type, and inverted date range
- [ ] Unit test confirming unknown parameters are rejected, not dropped
- [ ] Integration tests for the full catalogue, parameters, and run endpoints
- [ ] Integration test confirming report results match a direct read-model query on seeded data
- [ ] Denial tests for users without the report's required permission
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and the report catalogue updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-03-enterprise-capabilities/sprint-09-reporting-analytics.md` § 2 |
| Epic | Reporting & Analytics |
| Queries | Issue 057 (read models) |
| Consumed by | Issues 060, 061, 062 |
| Pull Request | _to be linked_ |
