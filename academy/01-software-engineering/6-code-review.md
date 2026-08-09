# Code Review

**Version:** 1.0

---

# Purpose

Code Review is the process of examining source code before it is merged into the shared codebase.

The objective of a code review is **not to criticize the developer**, but to improve the quality, maintainability, security, and reliability of the software.

In this bootcamp, **every Pull Request must undergo a Code Review before it can be merged**.

Code Review is considered a mandatory step of the Software Development Life Cycle (SDLC).

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand the purpose of Code Reviews
- Review code objectively
- Receive feedback professionally
- Provide constructive feedback
- Identify common software issues
- Improve code quality through collaboration

---

# Why Code Reviews Matter

Code Reviews help engineering teams:

- Detect bugs early
- Improve code quality
- Share knowledge
- Maintain coding standards
- Improve security
- Reduce technical debt
- Encourage collaboration
- Improve software maintainability

A successful Code Review improves both the software and the engineer.

---

# Code Review Workflow

Every Pull Request follows this review process.

```text
GitHub Issue
        │
        ▼
Development
        │
        ▼
Local Testing
        │
        ▼
Pull Request
        │
        ▼
Code Review
        │
        ▼
Requested Changes?
      /      \
    Yes       No
     │         │
     ▼         ▼
 Update     Approval
     │         │
     └────► Merge
```

No Pull Request should be merged without completing the review process.

---

# Code Review Checklist

Every review should verify the following areas.

## 1. Business Requirements

Questions:

- Does the implementation satisfy the Business Requirement?
- Are all Acceptance Criteria met?
- Was the correct GitHub Issue implemented?
- Does the feature solve the intended problem?

---

## 2. Functional Correctness

Questions:

- Does the feature work correctly?
- Are edge cases handled?
- Can invalid inputs break the system?
- Does the implementation match the expected behavior?

---

## 3. Code Quality

Review:

- Readability
- Naming conventions
- Consistency
- Simplicity
- Reusability
- Separation of concerns

Well-written code should be understandable without extensive explanation.

---

## 4. Architecture

Review:

- Folder structure
- Layer separation
- Dependency management
- Appropriate abstractions
- Scalability

The implementation should align with the project's architecture.

---

## 5. Security

Review for:

- Input validation
- Authentication
- Authorization
- SQL Injection
- XSS
- Sensitive information exposure
- Secret management

Security should never be an afterthought.

---

## 6. Performance

Consider:

- Database queries
- API efficiency
- Memory usage
- Duplicate processing
- Large loops
- Expensive operations

Performance issues are easier to fix before merging.

---

## 7. Testing

Verify:

- Unit Tests
- Integration Tests
- End-to-End Tests
- Edge Cases
- Regression Risks

Every new feature should include appropriate testing.

---

## 8. Documentation

Confirm that documentation has been updated where necessary.

Examples:

- README
- API Documentation
- Architecture Diagrams
- BRD
- SRS
- Release Notes

Documentation should evolve alongside the software.

---

## 9. Git Standards

Review:

- Branch naming
- Commit messages
- Pull Request title
- Pull Request description
- GitHub Issue linkage

The project's Git standards should be followed consistently.

---

# Review Checklist

Before approving a Pull Request, verify:

- [ ] Business requirements implemented
- [ ] Acceptance Criteria satisfied
- [ ] No obvious bugs
- [ ] Clean architecture
- [ ] Coding standards followed
- [ ] Security considered
- [ ] Performance acceptable
- [ ] Tests included
- [ ] Documentation updated
- [ ] CI pipeline passed

---

# Writing Review Comments

Feedback should be:

- Respectful
- Specific
- Actionable
- Objective

The focus should always be on improving the software.

---

# Examples of Good Feedback

Instead of:

> This is wrong.

Prefer:

> Consider extracting this logic into a service to improve reusability and maintainability.

---

Instead of:

> Bad variable name.

Prefer:

> Could this variable be renamed to better describe its purpose?

---

Instead of:

> This code is confusing.

Prefer:

> Breaking this method into smaller functions may improve readability.

---

# Receiving Feedback

Professional engineers should:

- Read comments carefully.
- Avoid taking feedback personally.
- Ask questions when clarification is needed.
- Apply requested improvements.
- Thank reviewers for their feedback.

The goal is continuous improvement.

---

# Common Review Outcomes

## Approved

The Pull Request satisfies project requirements and can be merged.

---

## Approved with Minor Suggestions

Minor improvements are suggested but do not block merging.

---

## Changes Requested

Additional work is required before approval.

Examples:

- Missing tests
- Incomplete feature
- Security concerns
- Code quality issues
- Documentation updates

---

# Self Review

Before requesting review, review your own Pull Request.

Ask yourself:

- Would I approve this?
- Can I simplify anything?
- Is every commit necessary?
- Did I leave debugging code?
- Are variable names meaningful?
- Have I updated documentation?
- Are tests passing?

Many review comments can be prevented through a careful self-review.

---

# What Should Never Be Approved

Examples include:

- Failing CI
- Broken functionality
- Missing Acceptance Criteria
- Security vulnerabilities
- Hardcoded secrets
- Debug code
- Unused files
- Large unrelated changes
- Missing documentation

---

# Code Review Best Practices

Professional engineers should:

- Review Pull Requests promptly.
- Keep Pull Requests small.
- Ask questions instead of making assumptions.
- Explain recommendations.
- Be respectful.
- Focus on long-term maintainability.
- Share knowledge during reviews.

Code Reviews are opportunities for learning, not gatekeeping.

---

# Common Mistakes

Avoid:

- Approving without reading the code.
- Reviewing only formatting.
- Ignoring business requirements.
- Being overly critical.
- Leaving vague comments.
- Delaying reviews unnecessarily.
- Taking feedback personally.

---

# Code Review in This Bootcamp

Every Sprint follows this process:

```text
Business Requirement
        │
        ▼
GitHub Issue
        │
        ▼
Development
        │
        ▼
Testing
        │
        ▼
Pull Request
        │
        ▼
Code Review
        │
        ▼
Approval
        │
        ▼
Merge
```

A Sprint is **not complete** until its Pull Request has been reviewed and approved.

---

# Definition of Review Complete

A Pull Request is considered successfully reviewed when:

- Business requirements are satisfied
- Acceptance Criteria are met
- Reviewer feedback has been addressed
- CI pipeline passes
- Documentation is updated
- Approval has been granted
- The Pull Request is merged

---

# Expected Outcome

By completing this section, the learner should understand that Code Review is an essential engineering practice, not an optional step.

The ability to review code, communicate constructive feedback, and improve software collaboratively is a core competency expected of professional software engineers.

Throughout the ERP Bootcamp, every contribution will pass through the Code Review process before becoming part of the production codebase.