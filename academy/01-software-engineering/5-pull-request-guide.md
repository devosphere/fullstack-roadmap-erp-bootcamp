# Pull Request Guide

**Version:** 1.0

---

# Purpose

A Pull Request (PR) is the primary mechanism for integrating code into a shared codebase.

Rather than merging changes directly into a branch, engineers submit their work through a Pull Request so that it can be reviewed, discussed, validated, and approved before becoming part of the project.

Throughout this bootcamp, **every code change, documentation update, bug fix, and feature implementation must be submitted through a Pull Request.**

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand the purpose of Pull Requests
- Create high-quality Pull Requests
- Link Pull Requests to GitHub Issues
- Request code reviews
- Address reviewer feedback
- Merge Pull Requests following the team's workflow

---

# What is a Pull Request?

A Pull Request is a request to merge one branch into another.

It allows engineers to:

- Review code
- Discuss implementation decisions
- Detect bugs
- Verify requirements
- Validate automated tests
- Improve overall code quality

A Pull Request is both a technical review and a collaborative discussion.

---

# Pull Request Workflow

Every Pull Request follows the same lifecycle.

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
Local Testing
        │
        ▼
Commit Changes
        │
        ▼
Push Branch
        │
        ▼
Open Pull Request
        │
        ▼
Code Review
        │
        ▼
Address Feedback
        │
        ▼
CI Validation
        │
        ▼
Approval
        │
        ▼
Merge
```

---

# Before Opening a Pull Request

Before creating a Pull Request, ensure that:

- The feature is complete.
- Acceptance criteria have been satisfied.
- The application builds successfully.
- Tests pass locally.
- Documentation has been updated.
- Commit history is clean.
- The branch is synchronized with `develop`.

A Pull Request should represent a complete, reviewable unit of work.

---

# Pull Request Naming

The Pull Request title should clearly summarize the change.

Examples:

```text
feat(auth): implement JWT authentication

feat(hr): add employee leave request module

fix(inventory): resolve stock calculation issue

docs(api): update authentication documentation

refactor(user): simplify user service
```

Avoid vague titles such as:

```text
Update

Fix

Changes

Work

Testing
```

---

# Pull Request Description

Every Pull Request should include enough context for reviewers to understand the change.

Recommended structure:

## Summary

Describe what was implemented.

Example:

> Implemented employee leave request functionality, including backend API, frontend form, validation, and database migration.

---

## Related Issue

Reference the GitHub Issue.

Example:

```text
Closes #42
```

---

## Business Context

Explain why the change was required.

Example:

> HR Managers need the ability to submit employee leave requests to streamline approval workflows.

---

## Changes Made

Summarize the implementation.

Example:

- Added REST API endpoints
- Created Leave Request database table
- Added frontend form
- Implemented validation
- Updated API documentation

---

## Testing Performed

Describe how the feature was verified.

Example:

- Unit Tests
- Integration Tests
- Manual Testing
- API Testing

---

## Screenshots

Include screenshots when the Pull Request changes the user interface.

Examples:

- Login Page
- Dashboard
- Employee Form
- Reports

---

# Pull Request Checklist

Before requesting review, verify the following:

- [ ] GitHub Issue is linked
- [ ] Feature is complete
- [ ] Acceptance Criteria satisfied
- [ ] Code follows project standards
- [ ] Documentation updated
- [ ] Tests added or updated
- [ ] Local tests pass
- [ ] CI pipeline passes
- [ ] No merge conflicts remain

---

# Requesting a Review

Once the Pull Request is ready:

1. Assign the appropriate reviewer.
2. Wait for review feedback.
3. Respond to review comments professionally.
4. Update the Pull Request if changes are requested.

Do not merge your own Pull Request unless explicitly permitted by the project's workflow.

---

# Code Review Process

Reviewers should verify:

## Requirements

- Business requirements implemented
- Acceptance criteria satisfied

---

## Code Quality

- Readability
- Maintainability
- Consistency
- Simplicity

---

## Architecture

- Correct design
- Proper separation of concerns
- Appropriate abstractions

---

## Security

- Input validation
- Authentication
- Authorization
- Sensitive data handling

---

## Testing

- Unit Tests
- Integration Tests
- Edge Cases
- Regression Risk

---

## Documentation

Ensure documentation has been updated where necessary.

Examples:

- README
- API Documentation
- Architecture Diagrams
- User Guides

---

# Responding to Review Feedback

Receiving feedback is a normal part of software engineering.

When responding:

- Read comments carefully.
- Ask for clarification if needed.
- Make requested improvements.
- Explain your reasoning respectfully when appropriate.
- Mark conversations as resolved after changes have been made.

The objective is to improve the software, not to "win" the discussion.

---

# Updating a Pull Request

If additional changes are required:

```bash
git add .

git commit -m "fix(review): address PR feedback"

git push origin feature/employee-leave-request
```

The Pull Request updates automatically after pushing new commits.

---

# Merge Requirements

A Pull Request should only be merged when:

- Required reviews are complete.
- CI checks pass.
- No merge conflicts exist.
- Documentation is updated.
- Acceptance criteria are satisfied.

---

# Merge Strategy

This bootcamp recommends the following merge strategy:

## Feature Branches

Use **Squash and Merge**.

Benefits:

- Cleaner history
- One commit per feature
- Easier rollback
- Better readability

---

## Release Branches

Use **Merge Commit**.

Benefits:

- Preserves release history
- Easier version tracking

---

## Hotfixes

Merge into both:

- `main`
- `develop`

This keeps production and ongoing development synchronized.

---

# Pull Request Best Practices

Professional engineers should:

- Keep Pull Requests focused on a single feature or fix.
- Open Pull Requests early if feedback is needed.
- Keep descriptions concise but informative.
- Review your own changes before requesting review.
- Keep commit history meaningful.
- Respond to feedback promptly.
- Update documentation alongside code.

---

# Common Mistakes

Avoid the following:

- Pull Requests containing unrelated changes.
- Missing GitHub Issue references.
- Large Pull Requests that are difficult to review.
- Skipping tests before requesting review.
- Ignoring review feedback.
- Merging without approval.
- Leaving merge conflicts unresolved.

---

# Example Pull Request

```text
Title

feat(hr): implement employee leave request

------------------------------------------------

Summary

Implemented employee leave request functionality.

------------------------------------------------

Related Issue

Closes #42

------------------------------------------------

Changes

- Added database migration
- Added backend API
- Added frontend page
- Added validation
- Updated documentation

------------------------------------------------

Testing

✓ Unit Tests

✓ Integration Tests

✓ Manual Testing

✓ API Testing

------------------------------------------------

Screenshots

Attached

------------------------------------------------

Checklist

✓ Documentation updated

✓ Tests passing

✓ CI successful

✓ Ready for review
```

---

# Expected Outcome

By completing this section, the learner should be able to confidently submit professional Pull Requests that meet industry standards.

Throughout the ERP Bootcamp, every contribution—whether code, documentation, infrastructure, or configuration—will be introduced through a Pull Request.

A well-written Pull Request improves collaboration, accelerates code reviews, and contributes to a maintainable, high-quality software project.