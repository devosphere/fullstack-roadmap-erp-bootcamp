# Git Branching Strategy

**Version:** 1.0

---

# Purpose

A branching strategy defines how engineers organize development work within a Git repository.

Using a consistent branching strategy allows multiple engineers to work on the same project simultaneously without interfering with each other's work.

Throughout this bootcamp, **every feature, bug fix, and release must follow the branching strategy defined in this document.**

Following a consistent workflow is more important than completing work quickly.

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand the purpose of Git branches
- Follow the project's branching strategy
- Create branches for new work
- Merge completed work through Pull Requests
- Understand release and hotfix workflows
- Maintain a clean Git history

---

# Why Use Branches?

Branches allow engineers to work independently without affecting the main codebase.

Benefits include:

- Parallel development
- Safe experimentation
- Easier code reviews
- Simplified bug fixes
- Better release management
- Improved collaboration

A branch represents an isolated stream of work.

---

# Branch Overview

The ERP Bootcamp uses the following branch structure:

```text
main
│
├── develop
│
├── feature/*
│
├── bugfix/*
│
├── hotfix/*
│
├── release/*
│
└── docs/*
```

Each branch has a specific purpose.

---

# Main Branch

## Purpose

The `main` branch always represents the latest stable production release.

Rules:

- Production-ready only
- Protected branch
- No direct commits
- Pull Requests required
- CI must pass before merging

Examples:

```text
main
```

---

# Develop Branch

## Purpose

The `develop` branch contains the latest completed work for the next release.

All feature branches are created from `develop`.

Rules:

- No direct commits
- Pull Requests required
- Continuously integrated
- May contain unreleased features

Examples:

```text
develop
```

---

# Feature Branches

## Purpose

Feature branches are used to implement new functionality.

Every GitHub Issue requiring development should have its own feature branch.

Naming convention:

```text
feature/<short-description>
```

Examples:

```text
feature/authentication

feature/user-management

feature/employee-module

feature/inventory-dashboard

feature/report-export
```

Workflow:

```text
develop
        │
        ▼
feature/employee-module
        │
        ▼
Pull Request
        │
        ▼
develop
```

---

# Bugfix Branches

## Purpose

Bugfix branches are used to resolve defects identified during development or testing.

Naming convention:

```text
bugfix/<short-description>
```

Examples:

```text
bugfix/login-validation

bugfix/inventory-calculation

bugfix/api-timeout
```

Workflow:

```text
develop
        │
        ▼
bugfix/login-validation
        │
        ▼
Pull Request
        │
        ▼
develop
```

---

# Hotfix Branches

## Purpose

Hotfix branches resolve critical production issues.

Unlike feature branches, hotfixes are created from the latest production release.

Naming convention:

```text
hotfix/<short-description>
```

Examples:

```text
hotfix/login-failure

hotfix/payment-crash

hotfix/security-patch
```

Workflow:

```text
main
        │
        ▼
hotfix/security-patch
        │
        ▼
Pull Request
        │
        ├────────► main
        │
        └────────► develop
```

Hotfixes should always be merged back into both `main` and `develop` to keep branches synchronized.

---

# Release Branches

## Purpose

Release branches prepare the application for production deployment.

Activities performed during a release may include:

- Final testing
- Documentation updates
- Version number updates
- Bug fixes
- Release validation

Naming convention:

```text
release/v1.0.0

release/v1.1.0

release/v2.0.0
```

Workflow:

```text
develop
        │
        ▼
release/v1.0.0
        │
        ▼
Testing
        │
        ▼
main
```

After a successful release, the release branch should also be merged back into `develop`.

---

# Documentation Branches

## Purpose

Documentation updates that do not modify application code may use documentation branches.

Naming convention:

```text
docs/<short-description>
```

Examples:

```text
docs/update-readme

docs/api-guide

docs/brd-revision
```

---

# Complete Branch Workflow

The complete engineering workflow is shown below.

```text
GitHub Issue
        │
        ▼
Create Feature Branch
        │
        ▼
Development
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
GitHub Actions
        │
        ▼
Merge into Develop
        │
        ▼
Release Branch
        │
        ▼
Production
```

---

# Branch Protection Rules

The following rules apply to protected branches.

## main

- Protected
- Pull Requests only
- No force pushes
- CI required
- Review required

---

## develop

- Protected
- Pull Requests only
- CI required
- Review required

---

# Branch Naming Guidelines

Branch names should:

- Use lowercase letters
- Use hyphens instead of spaces
- Clearly describe the work
- Be concise
- Follow the defined prefix

Good examples:

```text
feature/reset-password

feature/product-search

bugfix/user-validation

release/v1.2.0
```

Poor examples:

```text
feature1

new

testing

fix

john-work

temp
```

---

# Working on a Feature

Example workflow.

## Step 1

Create a GitHub Issue.

```
Issue #45

Implement Employee Leave Request
```

---

## Step 2

Create a branch.

```bash
git checkout develop

git pull origin develop

git checkout -b feature/employee-leave-request
```

---

## Step 3

Implement the feature.

---

## Step 4

Commit changes.

```bash
git add .

git commit -m "feat(hr): implement employee leave request"
```

---

## Step 5

Push the branch.

```bash
git push origin feature/employee-leave-request
```

---

## Step 6

Create a Pull Request.

```
feature/employee-leave-request

↓

develop
```

---

## Step 7

Address review comments.

---

## Step 8

Merge after approval.

---

# Keeping Your Branch Updated

Before continuing work, synchronize your branch with the latest `develop`.

```bash
git checkout develop

git pull origin develop

git checkout feature/employee-leave-request

git merge develop
```

Alternatively, your team may choose to use `git rebase` if that is the agreed workflow.

---

# Merge Strategy

Unless otherwise specified, this bootcamp recommends:

- **Squash Merge** for feature and bugfix branches to keep history concise and readable.
- **Merge Commit** for release branches to preserve release history.
- **Hotfix branches** should be merged into both `main` and `develop`.

The chosen strategy should be applied consistently across the project.

---

# Best Practices

Professional engineers should:

- Create one branch per GitHub Issue.
- Keep branches focused on a single purpose.
- Merge frequently to reduce conflicts.
- Delete merged branches.
- Keep Pull Requests small and reviewable.
- Regularly synchronize with `develop`.
- Never commit unfinished work directly to protected branches.

---

# Common Mistakes

Avoid the following:

- Developing directly on `main`
- Developing directly on `develop`
- Reusing old feature branches
- Mixing unrelated changes in one branch
- Creating overly large Pull Requests
- Ignoring merge conflicts
- Forgetting to update your branch before opening a Pull Request

---

# Expected Outcome

By completing this section, the learner should be able to confidently manage branches in a collaborative software engineering environment.

Throughout the ERP Bootcamp, every feature, bug fix, documentation update, and production release will follow this branching strategy.

A disciplined branching strategy leads to cleaner code reviews, more reliable releases, and a healthier development workflow.