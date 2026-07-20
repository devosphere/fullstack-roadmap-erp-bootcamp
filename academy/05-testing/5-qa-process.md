# Quality Assurance (QA) Process

**Version:** 1.0

---

# Purpose

Quality Assurance (QA) is the discipline of ensuring that software consistently meets business requirements, technical specifications, and user expectations.

Unlike testing, which focuses on identifying defects, Quality Assurance focuses on preventing defects by establishing repeatable engineering processes, quality standards, and continuous improvement practices.

Throughout this bootcamp, QA is treated as a responsibility shared by every engineer—not just dedicated QA professionals.

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand the role of Quality Assurance in software engineering
- Differentiate Quality Assurance from Quality Control
- Participate in quality activities throughout the SDLC
- Apply quality gates during development
- Collaborate effectively during reviews and testing
- Maintain software quality through continuous improvement

---

# Quality Assurance vs Quality Control

Although often used interchangeably, QA and QC serve different purposes.

| Quality Assurance (QA) | Quality Control (QC) |
|-------------------------|----------------------|
| Prevents defects | Detects defects |
| Process-oriented | Product-oriented |
| Continuous throughout the SDLC | Performed during verification activities |
| Focuses on improving processes | Focuses on validating software |

Both QA and QC are essential for delivering reliable software.

---

# QA Philosophy

Quality should be built into the software from the beginning—not inspected after development is complete.

Every engineering activity should contribute to quality.

Quality begins with:

- Clear requirements
- Good architecture
- Clean code
- Effective testing
- Thorough code reviews
- Continuous integration
- Continuous improvement

---

# QA Throughout the SDLC

Quality activities occur during every phase of development.

```text
Business Requirements
        │
        ▼
Requirements Review
        │
        ▼
System Design Review
        │
        ▼
Development
        │
        ▼
Code Review
        │
        ▼
Testing
        │
        ▼
Release Validation
        │
        ▼
Deployment
        │
        ▼
Production Monitoring
```

Quality is continuously verified rather than evaluated only before release.

---

# QA Responsibilities

Quality is owned by the entire engineering team.

| Role | Responsibilities |
|------|------------------|
| Business Analyst | Define clear business requirements |
| Product Owner | Prioritize business value |
| Software Engineer | Build maintainable software and write automated tests |
| QA Engineer | Design and execute quality strategies |
| Tech Lead | Enforce engineering standards |
| DevOps Engineer | Maintain CI/CD quality gates |
| Reviewer | Verify code quality and compliance |

Every team member contributes to product quality.

---

# Quality Gates

Every Sprint follows defined quality gates before work progresses.

```text
Requirements Approved
        │
        ▼
Architecture Reviewed
        │
        ▼
Development Complete
        │
        ▼
Unit Tests Pass
        │
        ▼
Integration Tests Pass
        │
        ▼
End-to-End Tests Pass
        │
        ▼
Code Review Approved
        │
        ▼
GitHub Actions Pass
        │
        ▼
Ready for Release
```

A feature should not advance until all required quality gates have been satisfied.

---

# Requirements Validation

Quality begins with well-defined requirements.

Before development starts:

- BRD reviewed
- SRS completed
- User Stories created
- Acceptance Criteria defined
- Business process understood

Poor requirements inevitably produce poor software.

---

# Development Quality

Developers are responsible for:

- Following coding standards
- Writing maintainable code
- Using TypeScript correctly
- Writing automated tests
- Updating documentation

Development quality reduces downstream defects.

---

# Code Review

Every Pull Request requires peer review.

Reviewers should verify:

- Business requirements
- Coding standards
- Readability
- Security
- Performance
- Test coverage
- Documentation updates

Code reviews improve quality and knowledge sharing.

---

# Testing Process

Testing consists of multiple validation layers.

```text
Unit Testing
        │
        ▼
Integration Testing
        │
        ▼
End-to-End Testing
        │
        ▼
Manual Verification
        │
        ▼
Regression Testing
```

Each testing level provides additional confidence before release.

---

# Defect Management Process

Every defect follows a structured workflow.

```text
Defect Identified
        │
        ▼
GitHub Issue Created
        │
        ▼
Priority Assigned
        │
        ▼
Root Cause Analysis
        │
        ▼
Feature Branch
        │
        ▼
Fix Implemented
        │
        ▼
Automated Tests Added
        │
        ▼
Code Review
        │
        ▼
Merge
        │
        ▼
Verification
        │
        ▼
Issue Closed
```

Every resolved defect should strengthen the overall quality of the system.

---

# Regression Prevention

Whenever a defect is fixed:

- Add or update unit tests.
- Add integration tests when appropriate.
- Add End-to-End tests for user-facing workflows.
- Update documentation if behavior changes.

The same defect should not occur again without introducing a new regression.

---

# Continuous Integration

Every Pull Request triggers automated quality verification.

Typical CI pipeline:

```text
TypeScript Compilation
        │
        ▼
Linting
        │
        ▼
Unit Tests
        │
        ▼
Integration Tests
        │
        ▼
End-to-End Tests
        │
        ▼
Build Verification
```

Failures must be resolved before merging.

---

# Release Readiness

Before a release:

- All Acceptance Criteria satisfied
- No critical defects
- Required automated tests pass
- Documentation updated
- Release Notes prepared
- GitHub Actions successful

Release readiness ensures predictable deployments.

---

# Production Quality

Quality continues after deployment.

Post-release activities include:

- Smoke testing
- Monitoring
- Log analysis
- Incident management
- User feedback
- Performance observation

Production provides valuable feedback for future improvements.

---

# Metrics

The team should monitor quality indicators such as:

- Defect count
- Escaped defects
- Test pass rate
- Pull Request review time
- Build success rate
- Deployment frequency
- Mean Time to Recovery (MTTR)

Metrics help identify opportunities for continuous improvement.

---

# Documentation

Quality documentation includes:

- BRD
- SRS
- Architecture
- API Documentation
- Test Cases
- Test Reports
- Release Notes
- User Manuals

Documentation should evolve alongside the software.

---

# GitHub Workflow

Quality Assurance is integrated into every engineering workflow.

```text
GitHub Issue
        │
        ▼
Requirements
        │
        ▼
Development
        │
        ▼
Automated Testing
        │
        ▼
Pull Request
        │
        ▼
Code Review
        │
        ▼
GitHub Actions
        │
        ▼
Merge
        │
        ▼
Deployment
        │
        ▼
Production Verification
```

Every GitHub workflow stage contributes to software quality.

---

# Definition of Done

A feature satisfies the QA process when:

- Business requirements are implemented.
- Acceptance Criteria are met.
- Coding standards are followed.
- Documentation is updated.
- Unit tests pass.
- Integration tests pass.
- End-to-End tests pass.
- Code review is approved.
- GitHub Actions pipeline passes.
- No unresolved critical defects remain.

Quality Assurance is complete only when both the product and the engineering process meet project standards.

---

# Best Practices

Professional engineering teams should:

- Build quality into every Sprint.
- Review requirements carefully.
- Automate repetitive validation.
- Prevent defects instead of reacting to them.
- Perform meaningful code reviews.
- Continuously improve engineering practices.
- Treat documentation as part of the product.

---

# Common Mistakes

Avoid:

- Treating QA as the responsibility of one person.
- Testing only before release.
- Ignoring failing automated tests.
- Merging without code review.
- Releasing with known critical defects.
- Neglecting documentation.
- Repeating the same defects due to missing regression tests.

Quality should be proactive rather than reactive.

---

# QA Process in This Bootcamp

Every Sprint in this ERP bootcamp follows the same structured Quality Assurance process.

The learner will experience the responsibilities of Business Analyst, Software Engineer, QA Engineer, Reviewer, and DevOps Engineer, understanding how each role contributes to delivering reliable enterprise software.

By following consistent quality gates and engineering standards, the learner develops the discipline required to work effectively within professional software engineering teams.

---

# Expected Outcome

By completing this section, the learner should understand how Quality Assurance integrates into every stage of the Software Development Life Cycle.

Throughout this bootcamp, QA serves as the foundation for delivering reliable, maintainable, and production-ready ERP software by combining disciplined engineering practices, automated verification, collaborative reviews, and continuous improvement.