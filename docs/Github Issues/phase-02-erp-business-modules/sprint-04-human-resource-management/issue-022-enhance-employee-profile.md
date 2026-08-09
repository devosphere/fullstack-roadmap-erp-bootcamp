# [FEATURE] Enhance Employee Profile

<!-- GitHub title: [FEATURE] Enhance Employee Profile
     Labels: feature, hr, priority: high
     Milestone: Sprint 04 - Human Resource Management
     Branch: feature/022-enhance-employee-profile
     Epic: Human Resource Management
     Depends on: 019
     Blocks: 023
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
## Sprint: Sprint 04 - Human Resource Management

---

## Summary

Extend the employee record created in Sprint 03 with the fields HR operations require: emergency
contacts, government identifiers, employment details, and supporting documents.

## Background

Issue 019 created enough of an employee record to represent the workforce. HR needs more than that
to actually operate.

The sensitivity of this data rises sharply with this issue. Government identifiers and emergency
contacts are personal data with legal handling obligations in most jurisdictions. Field-level
access control matters here in a way it did not for department names: an HR Officer needs to see a
tax identifier, a Manager does not.

Getting this wrong is not a functional bug — it is a privacy incident. Sprint 11 audits this
module specifically.

## User Story

As an HR Officer,
I want complete employee profiles including emergency and statutory details,
So that HR processes and legal obligations can be handled from a single accurate record.

## Acceptance Criteria

```gherkin
Given an HR Officer viewing an employee profile
When the profile loads
Then all profile sections including government identifiers are visible
```

```gherkin
Given a Manager viewing a team member's profile
When the profile loads
Then government identifiers and salary-adjacent fields are not returned by the API at all
```

```gherkin
Given an employee record with a government identifier
When any request or error is logged
Then the identifier does not appear in the log output
```

- [ ] `GET /api/employees/{id}/profile` returns the full profile
- [ ] `PUT /api/employees/{id}/profile` updates profile sections
- [ ] `POST /api/employees/{id}/documents` uploads a supporting document
- [ ] `GET /api/employees/{id}/documents` lists documents
- [ ] `DELETE /api/employees/{id}/documents/{documentId}` removes a document
- [ ] Emergency contact details stored: name, relationship, phone, address
- [ ] Government identifiers stored: tax number, social security, national ID
- [ ] Employment details stored: employment date, employment type, work location, work schedule
- [ ] Personal details extended: marital status, nationality, blood type
- [ ] Document uploads validated by type and size
- [ ] Sensitive fields excluded from responses for roles without the permission
- [ ] Sensitive fields never written to logs
- [ ] Profile completeness indicator available
- [ ] Permissions declared and enforced per field group
- [ ] ERD updated

## Expected Result

HR Officers see and maintain complete employee profiles. Managers see the operational subset only.
Sensitive identifiers are never returned to unauthorized roles and never appear in logs.

---

## Scope

### Included

- Extended profile fields
- Emergency contact management
- Government identifier storage
- Document upload and management
- Field-group permission enforcement
- Log redaction of sensitive fields
- ERD update

### Out of Scope

- Employment status transitions and history (Issue 023)
- Attendance (Issue 024) and leave (Issues 025, 026)
- Employee editing their own profile (Issue 027)
- Salary and compensation
- Performance reviews

## Technical Requirements

**Endpoints**

```text
GET    /api/employees/{id}/profile
PUT    /api/employees/{id}/profile
POST   /api/employees/{id}/documents
GET    /api/employees/{id}/documents
DELETE /api/employees/{id}/documents/{documentId}
```

**Schema additions**

```text
Employee

maritalStatus
nationality
bloodType
workLocation
workSchedule

EmergencyContact

id
employeeId       → Employee
name
relationship
phone
address
isPrimary

EmployeeIdentifier

id
employeeId       → Employee
identifierType   enum: TAX | SOCIAL_SECURITY | NATIONAL_ID | PASSPORT
identifierValue
issuedDate
expiryDate

EmployeeDocument

id
employeeId       → Employee
documentType
fileName
filePath
uploadedBy
uploadedAt
```

**Field group permissions**

| Field group | Required permission | Typical holder |
|-------------|--------------------|----------------|
| Basic profile | `EMPLOYEE_READ` | Manager, HR Officer |
| Emergency contacts | `EMPLOYEE_READ` | Manager, HR Officer |
| Government identifiers | `EMPLOYEE_SENSITIVE_READ` | HR Officer only |
| Documents | `EMPLOYEE_DOCUMENT_READ` | HR Officer only |

**Rules**

- Sensitive fields are omitted from the response entirely, not returned as `null` or masked —
  presence of a masked field still confirms the record exists.
- File uploads validated by MIME type and size, and stored outside the web root.
- Identifier values are treated as personal data: redacted in logs and excluded from error messages.

## Dependencies

- Issue 019 — the base employee record must exist.
- Issue 013 — the permission guard must exist for field-group enforcement.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Unit tests for field-group filtering per role
- [ ] Integration tests for all endpoints
- [ ] Test confirming sensitive fields are absent for unauthorized roles
- [ ] Test confirming identifiers do not appear in logs
- [ ] File upload validation tested including rejection cases
- [ ] Code review completed
- [ ] CI green
- [ ] API documentation and ERD updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-02-erp-business-modules/sprint-04-human-resource-management.md` § 1 |
| Epic | Human Resource Management |
| Audited by | Issue 071 (Sprint 11, record-level access) |
| Pull Request | _to be linked_ |
