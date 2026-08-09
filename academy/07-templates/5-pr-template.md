# Pull Request Template

## Pull Request Information

**Pull Request Type:** Feature | Bug Fix | Refactor | Documentation | Chore

**Related Issue:** #

**Sprint:** Sprint XX

**Module:**

**Author:**

**Reviewer(s):**

---

# Description

## Summary

Provide a clear summary of the changes introduced.

Example:

> Implemented Employee Management CRUD functionality including employee creation, update, retrieval, validation, and database persistence.

---

## Business Context

Explain why this change is needed.

Reference:

- BRD
- SRS
- User Story
- GitHub Issue

Example:

> This change supports the Employee Management module requirement defined in SRS-001 and enables HR administrators to maintain employee records.

---

# Changes Implemented

Describe the implementation details.

Example:

## Frontend

- Added Employee Management pages
- Created reusable form components
- Added client-side validation
- Integrated API calls

## Backend

- Added employee controller
- Added employee service
- Added database repository
- Added validation rules

## Database

- Added employee table migration
- Added database constraints

---

# Type of Change

Select applicable items:

- [ ] New Feature
- [ ] Bug Fix
- [ ] Refactoring
- [ ] Performance Improvement
- [ ] Security Improvement
- [ ] Documentation Update
- [ ] Infrastructure Change

---

# Related Requirements

## Business Requirements

```
BRD-XXX
```

## Software Requirements

```
SRS-XXX
```

## Architecture Decisions

```
ADR-XXX
```

---

# User Story

Reference the completed user story.

Example:

```
As an HR Administrator,

I want to manage employee records,

So that employee information can be maintained digitally.
```

---

# Acceptance Criteria Validation

Confirm that acceptance criteria have been satisfied.

| Criteria | Status |
|----------|--------|
| Requirement implemented | ✅ / ❌ |
| Validation completed | ✅ / ❌ |
| Error handling implemented | ✅ / ❌ |
| Automated tests added | ✅ / ❌ |

---

# Technical Details

## Architecture Impact

Describe any architectural changes.

Examples:

- New service introduced
- Database schema changed
- New API endpoint added
- Infrastructure updated

---

## API Changes

If applicable:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/example | Retrieve data |
| POST | /api/example | Create data |

---

## Database Changes

If applicable:

Migration:

```
migration_name
```

Schema Changes:

```
Describe changes
```

---

# Testing

## Automated Testing

### Unit Tests

```
PASS / FAIL

Details:
```

---

### Integration Tests

```
PASS / FAIL

Details:
```

---

### End-to-End Tests

```
PASS / FAIL

Details:
```

---

# Manual Testing

Describe validation performed.

Example:

Steps:

1. Login as HR Administrator.
2. Navigate to Employee Management.
3. Create employee record.
4. Verify database entry.

Result:

```
PASS
```

---

# Screenshots / Evidence

For UI changes, attach screenshots or recordings.

Before:

```
Attach screenshot
```

After:

```
Attach screenshot
```

---

# Deployment Considerations

Does this PR require:

- [ ] Database migration
- [ ] Environment variable changes
- [ ] Configuration changes
- [ ] Infrastructure updates
- [ ] Deployment notes

Additional details:

```
Describe deployment requirements
```

---

# Risks and Limitations

Document possible risks.

Example:

| Risk | Mitigation |
|------|------------|
| Existing users affected | Backward compatibility testing |
| Migration failure | Backup database |

---

# Code Review Checklist

Reviewer should verify:

## Code Quality

- [ ] Code follows project standards
- [ ] Naming conventions are followed
- [ ] No unnecessary duplication
- [ ] Error handling is implemented
- [ ] Comments explain complex logic only

---

## Security

- [ ] No secrets committed
- [ ] User permissions validated
- [ ] Input validation implemented
- [ ] Sensitive data protected

---

## Testing

- [ ] Tests cover expected behavior
- [ ] Edge cases considered
- [ ] CI pipeline passes

---

## Documentation

- [ ] Documentation updated
- [ ] API documentation updated
- [ ] ADR created if required

---

# GitHub Actions Status

Required checks:

- [ ] Build successful
- [ ] TypeScript validation passed
- [ ] Linting passed
- [ ] Unit tests passed
- [ ] Integration tests passed
- [ ] E2E tests passed
- [ ] Docker build passed

---

# Definition of Done

This Pull Request is complete when:

- [ ] Related GitHub Issue is completed
- [ ] Acceptance Criteria are satisfied
- [ ] Code is reviewed
- [ ] Automated tests pass
- [ ] GitHub Actions pass
- [ ] Documentation is updated
- [ ] Approved by reviewer
- [ ] Successfully merged

---

# Release Impact

Does this change require release documentation?

- [ ] No
- [ ] Yes

If yes:

Release Notes:

```
Describe user-facing changes
```

Version Impact:

```
MAJOR / MINOR / PATCH
```

---

# GitHub Workflow

Every Pull Request follows the engineering lifecycle.

```text
GitHub Issue
        │
        ▼
Feature Branch
        │
        ▼
Development
        │
        ▼
Pull Request
        │
        ▼
GitHub Actions
        │
        ▼
Code Review
        │
        ▼
Approval
        │
        ▼
Merge
        │
        ▼
Release
```

---

# Notes

This template is the official Pull Request template for the ERP Bootcamp.

A Pull Request is not only a code submission. It is a formal engineering artifact that communicates:

- What changed
- Why it changed
- How it was implemented
- How it was validated
- What risks exist

A well-written Pull Request enables efficient collaboration between developers, QA engineers, product managers, and technical leaders.

Professional engineers treat Pull Requests as documentation of the software evolution process.