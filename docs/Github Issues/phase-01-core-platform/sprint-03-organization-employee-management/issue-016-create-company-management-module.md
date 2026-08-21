# [FEATURE] Create Company Management Module

<!-- GitHub title: [FEATURE] Create Company Management Module
     Labels: feature, hr, priority: high
     Milestone: Sprint 03 - Organization & Employee Management
     Branch: feature/016-create-company-management-module
     Epic: Organization & Employee Management
     Depends on: 013
     Blocks: 017, 018
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

## Module: hr
## Sprint: Sprint 03 - Organization & Employee Management

---

## Summary

Create company master data management: the organization's profile, legal details, contact
information, and operating settings that the rest of the ERP system references.

## Background

Every ERP document eventually carries company details — invoices show the legal name and tax
number, purchase orders show the registered address, reports show the fiscal year.

Storing these as configuration constants seems simpler until the first time one changes, at which
point they must be found across the codebase. Modelling the company as data from the start means a
change is an update, not a deployment.

This is the root of the organizational structure. Departments in Issue 017 and positions in Issue
018 hang off it.

## User Story

As a System Administrator,
I want to maintain the company profile in the system,
So that business documents and reports carry correct, current organizational details.

## Acceptance Criteria

```gherkin
Given an authenticated administrator
When they update the company profile with valid details
Then the changes are saved and reflected wherever company details are displayed
```

```gherkin
Given a user without the company management permission
When they attempt to update the company profile
Then the request is rejected with 403
```

- [ ] `GET /api/companies` lists companies
- [ ] `POST /api/companies` creates a company
- [ ] `GET /api/companies/{id}` returns a company
- [ ] `PUT /api/companies/{id}` updates a company
- [ ] Company code uniqueness enforced
- [ ] Required fields validated: name, legal name, code
- [ ] Contact and address details stored
- [ ] Tax registration number stored
- [ ] Fiscal year start configured
- [ ] Default currency configured
- [ ] A company with dependent records cannot be deleted
- [ ] Permissions declared and enforced on every endpoint
- [ ] ERD updated in `docs/Architecture/`

## Expected Result

An administrator can view and maintain the company profile. Later modules read company details
from this record rather than from hard-coded values.

---

## Scope

### Included

- Company CRUD endpoints
- Validation and uniqueness rules
- Contact, address, and tax details
- Fiscal year and default currency settings
- Deletion guard
- Permission enforcement
- ERD update

### Out of Scope

- Departments (Issue 017) and positions (Issue 018)
- Multi-company data partitioning
- Company branding, logos, and document templates
- Fiscal period opening and closing (Sprint 08, Issue 050)

## Technical Requirements

**Endpoints**

```text
GET    /api/companies
POST   /api/companies
GET    /api/companies/{id}
PUT    /api/companies/{id}
```

**Schema**

```text
Company

id
companyCode        unique
name
legalName
taxNumber
email
phone
addressLine1
addressLine2
city
country
fiscalYearStart
defaultCurrency
status
createdAt
updatedAt
```

**Permissions to add**

```text
COMPANY_READ
COMPANY_CREATE
COMPANY_UPDATE
```

Assign to the Administrator role by default.

**Rules**

- Controllers handle request, validation, and response; logic lives in `company.service.ts`.
- The pagination shape matches the standard established in Issue 011.

## Dependencies

- Issue 013 — the permission guard must exist so endpoints can declare requirements.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for validation and uniqueness rules
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
| Sprint spec | `academy/08-sprints/phase-01-core-platform/sprint-03-organization-employee-management.md` § 1 |
| Epic | Organization & Employee Management |
| Pull Request | _to be linked_ |
