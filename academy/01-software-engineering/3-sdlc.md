# Software Development Life Cycle (SDLC)

**Version:** 1.0

---

# Purpose

The Software Development Life Cycle (SDLC) is the structured process used by software engineering teams to transform business ideas into reliable, maintainable, and production-ready software.

Understanding the SDLC is one of the most important skills a software engineer can develop.

Regardless of the programming language, framework, or technology stack being used, every successful software project follows a lifecycle.

Throughout this bootcamp, every feature of the ERP system will follow the SDLC from initial business requirement to production deployment.

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand every stage of the SDLC
- Explain the purpose of each phase
- Identify the roles involved in each stage
- Produce the required documentation
- Follow a professional engineering workflow
- Deliver software using industry best practices

---

# What is the SDLC?

The Software Development Life Cycle (SDLC) is a structured framework that guides the planning, design, development, testing, deployment, and maintenance of software.

Rather than writing code immediately, professional engineering teams follow a repeatable process that reduces project risk and improves software quality.

---

# The SDLC in This Bootcamp

Every feature developed throughout this bootcamp follows the same lifecycle.

```text
Business Requirement
        │
        ▼
Business Analysis
        │
        ▼
Solution Design
        │
        ▼
Sprint Planning
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
Code Review
        │
        ▼
Continuous Integration
        │
        ▼
Deployment
        │
        ▼
Production
        │
        ▼
Maintenance
```

This workflow applies to every ERP module, regardless of its complexity.

---

# Phase 1 — Business Requirements

Every software feature begins with a business need.

Typical questions include:

- What problem are we solving?
- Who are the users?
- Why is this feature needed?
- What value does it provide?

Deliverables:

- Business Requirements Document (BRD)
- Stakeholder Analysis
- Business Objectives

Primary Role:

**Business Analyst**

---

# Phase 2 — Requirements Analysis

Business requirements are transformed into software requirements.

Activities include:

- Identifying functional requirements
- Identifying non-functional requirements
- Defining business rules
- Writing user stories
- Creating acceptance criteria

Deliverables:

- Software Requirements Specification (SRS)
- User Stories
- Acceptance Criteria
- Process Flow Diagrams

Primary Roles:

- Business Analyst
- Product Owner

---

# Phase 3 — Solution Design

Engineers determine how the software will be implemented.

Activities include:

- Designing system architecture
- Creating database schemas
- Designing REST APIs
- Planning authentication
- Identifying security requirements

Deliverables:

- Architecture Diagram
- ERD
- API Specification
- Sequence Diagrams
- Architecture Decision Records (ADR)

Primary Role:

**Solution Architect**

---

# Phase 4 — Project Planning

Work is organized before development begins.

Activities include:

- Prioritizing features
- Creating GitHub Issues
- Sprint Planning
- Estimating Story Points
- Defining Sprint Goals

Deliverables:

- Product Backlog
- Sprint Backlog
- GitHub Project Board
- Milestones

Primary Roles:

- Product Owner
- Development Team

---

# Phase 5 — Development

The development team implements the approved solution.

Activities include:

- Creating feature branches
- Writing application code
- Implementing business logic
- Building APIs
- Developing frontend interfaces
- Writing database migrations

Deliverables:

- Source Code
- Unit Tests
- Updated Documentation

Primary Roles:

- Backend Engineer
- Frontend Engineer
- Database Engineer

---

# Phase 6 — Testing

Software quality is verified before release.

Testing activities include:

- Manual Testing
- Unit Testing
- Integration Testing
- End-to-End Testing
- API Testing
- Regression Testing

Testing ensures that software behaves according to its requirements.

Deliverables:

- Test Cases
- Test Reports
- Bug Reports
- Automated Test Suites

Primary Roles:

- QA Engineer
- QA Automation Engineer

---

# Phase 7 — Code Review

Before software is merged into the main codebase, it is reviewed by other engineers.

The review verifies:

- Code quality
- Readability
- Security
- Performance
- Maintainability
- Compliance with coding standards

Deliverables:

- Pull Request
- Review Comments
- Approved Changes

Primary Roles:

- Technical Lead
- Senior Engineers

---

# Phase 8 — Continuous Integration (CI)

Every Pull Request should automatically trigger validation.

Typical CI pipeline:

```text
Install Dependencies
        │
        ▼
Lint Source Code
        │
        ▼
Run Unit Tests
        │
        ▼
Run Integration Tests
        │
        ▼
Build Application
        │
        ▼
Report Results
```

The objective is to detect issues before merging.

Primary Role:

**DevOps Engineer**

---

# Phase 9 — Deployment

Approved software is deployed to an environment where users can access it.

Deployment environments typically include:

- Development
- Testing
- Staging
- Production

Deployment should be automated whenever practical.

Deliverables:

- Release
- Deployment Logs
- Release Notes

Primary Roles:

- DevOps Engineer
- Release Engineer

---

# Phase 10 — Production & Maintenance

Software continues to evolve after deployment.

Activities include:

- Monitoring
- Bug Fixes
- Performance Improvements
- Security Updates
- Feature Enhancements
- Technical Debt Reduction

Maintenance is an ongoing engineering responsibility.

Primary Roles:

- Development Team
- Site Reliability Engineer (SRE)
- Technical Lead

---

# Roles Throughout the SDLC

| SDLC Stage | Primary Role |
|------------|--------------|
| Business Requirements | Business Analyst |
| Requirements Analysis | Business Analyst / Product Owner |
| Solution Design | Solution Architect |
| Sprint Planning | Product Owner |
| Development | Software Engineers |
| Testing | QA Engineers |
| Code Review | Technical Lead |
| CI/CD | DevOps Engineer |
| Deployment | DevOps / Release Engineer |
| Maintenance | Engineering Team |

Every role contributes to delivering quality software.

---

# GitHub Workflow Integration

The SDLC is tightly integrated with GitHub.

```text
Business Requirement
        │
        ▼
GitHub Issue
        │
        ▼
Sprint Assignment
        │
        ▼
Feature Branch
        │
        ▼
Development
        │
        ▼
Commit Changes
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
```

No feature should bypass this workflow.

---

# SDLC Deliverables

Each stage of the SDLC produces specific outputs.

| Phase | Deliverables |
|--------|--------------|
| Business Requirements | BRD, Stakeholder Analysis |
| Requirements Analysis | SRS, User Stories, Acceptance Criteria |
| Solution Design | ERD, Architecture Diagram, API Specification |
| Project Planning | GitHub Issues, Sprint Backlog, Milestones |
| Development | Source Code, Unit Tests |
| Testing | Test Cases, Test Reports, Bug Reports |
| Code Review | Pull Request, Review Feedback |
| CI/CD | Automated Validation Pipeline |
| Deployment | Release Notes, Production Deployment |
| Maintenance | Bug Fixes, Enhancements, Refactoring |

---

# Best Practices

Professional software engineering teams should:

- Understand the business problem before writing code.
- Document important decisions.
- Keep features small and manageable.
- Write automated tests.
- Review code before merging.
- Automate repetitive tasks.
- Monitor software after deployment.
- Continuously improve the product.

---

# Common Mistakes

Avoid the following:

- Writing code without understanding requirements.
- Skipping documentation.
- Developing without GitHub Issues.
- Ignoring testing.
- Bypassing code reviews.
- Deploying manually when automation is available.
- Treating deployment as the end of the project.

Software continues to evolve after release.

---

# How This Bootcamp Uses the SDLC

Every Sprint in this bootcamp represents a complete SDLC cycle.

Rather than spending months planning before writing code, each Sprint delivers a small, valuable increment of the ERP system.

For every Sprint, the learner will:

1. Understand the business requirement.
2. Produce the necessary documentation.
3. Design the solution.
4. Create GitHub Issues.
5. Implement the feature.
6. Write automated tests.
7. Submit a Pull Request.
8. Complete code review.
9. Pass the CI pipeline.
10. Deploy the completed work.

By repeating this process across many Sprints, the learner will gain practical experience with the complete software delivery lifecycle.

---

# Expected Outcome

Upon completing this section, the learner should understand that software engineering is a structured, collaborative process rather than simply writing code.

The ability to consistently follow the Software Development Life Cycle is one of the defining characteristics of a professional software engineer.

Every feature built throughout this bootcamp will reinforce the SDLC, ensuring that engineering best practices become second nature.