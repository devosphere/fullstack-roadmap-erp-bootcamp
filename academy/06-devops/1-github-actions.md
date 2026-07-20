# GitHub Actions

**Version:** 1.0

---

# Purpose

GitHub Actions is the Continuous Integration and Continuous Delivery (CI/CD) platform used throughout this bootcamp to automate software quality, testing, builds, and deployments.

Automation reduces manual work, improves consistency, prevents regressions, and ensures that every code change satisfies the project's engineering standards before being merged into the main branch.

Throughout this bootcamp, **every Pull Request is expected to pass the GitHub Actions pipeline before approval and merge.**

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand Continuous Integration (CI)
- Understand Continuous Delivery (CD)
- Build GitHub Actions workflows
- Automate testing and quality checks
- Configure workflow triggers
- Troubleshoot failed pipeline executions
- Integrate CI/CD into the Software Development Life Cycle

---

# What is GitHub Actions?

GitHub Actions is GitHub's automation platform.

It allows engineers to automatically execute workflows whenever specific repository events occur.

Examples include:

- Pull Request opened
- Pull Request updated
- Push to repository
- Release created
- Schedule execution
- Manual workflow dispatch

Automation improves software quality while reducing repetitive manual tasks.

---

# Continuous Integration (CI)

Continuous Integration is the practice of automatically validating software whenever new code is introduced.

Typical CI activities include:

- Install dependencies
- Compile application
- Run TypeScript checks
- Run linting
- Execute automated tests
- Build application
- Generate reports

CI provides rapid feedback to developers.

---

# Continuous Delivery (CD)

Continuous Delivery extends Continuous Integration by preparing validated software for deployment.

Typical CD activities include:

- Package application
- Publish build artifacts
- Deploy to development
- Deploy to staging
- Prepare production release

Deployment should only occur after successful quality validation.

---

# GitHub Actions in the SDLC

Automation supports every stage of development.

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
Merge
        │
        ▼
Deployment
```

Every code change should be validated automatically before merge.

---

# Typical Workflow

A Pull Request automatically triggers the pipeline.

```text
Checkout Code
        │
        ▼
Install Dependencies
        │
        ▼
TypeScript Compilation
        │
        ▼
ESLint
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
Build Application
        │
        ▼
Success
```

Any failed step should stop the workflow immediately.

---

# Repository Structure

GitHub workflows are stored inside:

```text
.github/

workflows/
```

Example:

```text
.github/

workflows/

├── ci.yml
├── frontend.yml
├── backend.yml
├── e2e.yml
├── release.yml
└── deploy.yml
```

Each workflow should have a clear responsibility.

---

# Workflow Triggers

Common triggers include:

```yaml
push

pull_request

workflow_dispatch

schedule

release
```

Different workflows may use different triggers depending on their purpose.

---

# CI Quality Gates

Every Pull Request should automatically verify:

- Project builds successfully
- TypeScript compilation passes
- ESLint passes
- Unit tests pass
- Integration tests pass
- End-to-End tests pass
- Security scans pass (when configured)

A Pull Request is not considered ready if required quality gates fail.

---

# Branch Protection

The repository should protect important branches.

Examples:

- main
- develop

Recommended rules:

- Require Pull Requests
- Require approvals
- Require successful GitHub Actions
- Prevent force pushes
- Prevent direct commits

Branch protection safeguards repository quality.

---

# Secrets Management

Sensitive information should never be committed to the repository.

Use GitHub Secrets for:

- API Keys
- Database credentials
- Cloud credentials
- Deployment tokens
- Authentication secrets

Secrets should only be available to workflows that require them.

---

# Environment Variables

Examples:

```text
Development

Testing

Staging

Production
```

Each environment should maintain independent configuration values.

---

# Build Artifacts

GitHub Actions may generate:

- Build packages
- Test reports
- Coverage reports
- Deployment packages
- Release artifacts

Artifacts improve traceability and debugging.

---

# Matrix Builds

GitHub Actions supports running jobs across multiple configurations.

Examples:

- Multiple Node.js versions
- Multiple operating systems
- Multiple browsers

Matrix builds improve compatibility verification.

---

# Caching

Caching improves workflow performance.

Typical cache targets include:

- Node modules
- Package manager cache
- Build cache
- Dependency cache

Caching reduces pipeline execution time.

---

# Notifications

Pipeline results should be visible to the engineering team.

Examples:

- Pull Request status
- Build status
- Test failures
- Deployment completion

Rapid feedback accelerates issue resolution.

---

# Failure Handling

When a workflow fails:

1. Review workflow logs.
2. Identify the failing step.
3. Resolve the issue locally.
4. Commit the fix.
5. Re-run the workflow.
6. Verify successful execution.

Do not merge code with unresolved CI failures.

---

# Relationship to Testing

GitHub Actions automates the project's testing strategy.

```text
TypeScript
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
Build
```

Automation ensures that quality checks are executed consistently.

---

# GitHub Workflow

GitHub Actions is an integral part of the project's engineering workflow.

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
Commit
        │
        ▼
Push
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
Merge
        │
        ▼
Deployment
```

Every Pull Request should complete this workflow before merging.

---

# Definition of Done

A Pull Request satisfies GitHub Actions requirements when:

- Dependencies install successfully.
- TypeScript compilation succeeds.
- Linting passes.
- Unit tests pass.
- Integration tests pass.
- End-to-End tests pass.
- Application builds successfully.
- Required workflows complete successfully.
- Branch protection requirements are satisfied.

Passing GitHub Actions is a mandatory quality gate.

---

# Best Practices

Professional engineering teams should:

- Automate repetitive tasks.
- Keep workflows modular.
- Fail fast when errors occur.
- Protect important branches.
- Secure secrets appropriately.
- Cache dependencies.
- Review workflow logs regularly.
- Keep CI execution efficient.

Automation should increase confidence without unnecessarily slowing development.

---

# Common Mistakes

Avoid:

- Committing secrets.
- Ignoring failed workflows.
- Bypassing branch protection.
- Running unnecessary jobs.
- Creating excessively long pipelines.
- Duplicating workflow logic.
- Deploying without successful validation.

Reliable automation supports reliable software delivery.

---

# GitHub Actions in This Bootcamp

Every Sprint in this ERP bootcamp uses GitHub Actions to enforce engineering standards automatically.

As the project evolves, additional workflows may be introduced for code quality, testing, security scanning, release management, and deployment.

The learner is expected to treat GitHub Actions as an essential engineering tool that validates software quality, supports collaboration, and enables continuous delivery.

---

# Expected Outcome

By completing this section, the learner should understand how to design, configure, and maintain GitHub Actions workflows for enterprise software projects.

Throughout this bootcamp, GitHub Actions serves as the automated quality gate that enforces coding standards, executes testing strategies, validates software integrity, and prepares the ERP system for reliable deployment.