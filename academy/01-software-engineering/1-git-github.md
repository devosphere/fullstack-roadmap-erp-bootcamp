# Git & GitHub

**Version:** 1.0

---

# Purpose

Git and GitHub are the foundation of modern software engineering.

Every professional software engineer is expected to understand version control, collaborative development, branching strategies, code reviews, and release management.

Throughout this bootcamp, **all engineering work will be managed through GitHub**.

GitHub is the single source of truth for the project.

---

# Learning Objectives

Upon completing this section, the learner should be able to:

- Understand what Git is
- Understand what GitHub is
- Initialize and clone repositories
- Create and manage branches
- Commit code using Conventional Commits
- Push changes to GitHub
- Create Pull Requests
- Participate in Code Reviews
- Resolve merge conflicts
- Tag releases
- Understand GitHub Projects and Issues
- Follow professional Git workflows

---

# What is Git?

Git is a **distributed version control system (DVCS)**.

It records the history of changes made to a project, allowing developers to:

- Track changes
- Restore previous versions
- Collaborate safely
- Experiment using branches
- Merge completed work
- Review historical changes

Git stores the complete history of a project.

---

# What is GitHub?

GitHub is a cloud-based collaboration platform built on top of Git.

GitHub enables engineering teams to:

- Store source code
- Manage repositories
- Track Issues
- Review Pull Requests
- Run CI/CD pipelines
- Manage releases
- Host documentation
- Plan projects using GitHub Projects

In this bootcamp, GitHub serves as the central engineering platform.

---

# Git vs GitHub

| Git | GitHub |
|------|---------|
| Version Control System | Collaboration Platform |
| Installed locally | Hosted online |
| Tracks source code history | Hosts repositories |
| Manages commits and branches | Manages Issues, Pull Requests, Releases, and Projects |

Git is the tool.

GitHub is the platform built around Git.

---

# Repository Structure

Every project begins with a Git repository.

Example:

```text
fullstack-roadmap-erp-bootcamp/

academy/

docs/

frontend/

backend/

database/

tests/

.github/

README.md

CHANGELOG.md

CONTRIBUTING.md
```

---

# Basic Git Workflow

The standard development workflow is:

```text
Clone Repository
        │
        ▼
Create Branch
        │
        ▼
Implement Feature
        │
        ▼
Commit Changes
        │
        ▼
Push Branch
        │
        ▼
Create Pull Request
        │
        ▼
Code Review
        │
        ▼
Merge
```

Every feature follows this process.

---

# Essential Git Commands

## Clone Repository

```bash
git clone <repository-url>
```

---

## Check Repository Status

```bash
git status
```

---

## View Commit History

```bash
git log
```

---

## Create a Branch

```bash
git checkout -b feature/login
```

---

## Switch Branches

```bash
git checkout develop
```

---

## View Branches

```bash
git branch
```

---

## Stage Changes

```bash
git add .
```

or

```bash
git add src/auth/login.ts
```

---

## Commit Changes

```bash
git commit -m "feat(auth): implement login endpoint"
```

---

## Push Branch

```bash
git push origin feature/login
```

---

## Pull Latest Changes

```bash
git pull origin develop
```

---

## Merge Branch

```bash
git merge feature/login
```

---

# GitHub Workflow

Every feature developed in this bootcamp follows the same workflow.

```text
Business Requirement
        │
        ▼
GitHub Issue
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
Push Branch
        │
        ▼
Pull Request
        │
        ▼
Code Review
        │
        ▼
CI Pipeline
        │
        ▼
Merge
        │
        ▼
Deployment
```

Skipping steps is not permitted.

---

# GitHub Issues

Every feature begins with a GitHub Issue.

An Issue should include:

- Summary
- Description
- Business Context
- Acceptance Criteria
- Priority
- Labels
- Assignee
- Sprint
- Milestone

No development should begin without an Issue.

---

# Branch Naming Convention

Use descriptive branch names.

Examples:

```text
feature/login

feature/user-management

feature/inventory-module

bugfix/login-validation

hotfix/auth-timeout

release/v1.0.0
```

Avoid generic names such as:

```text
test

new

feature1

fix

update
```

---

# Commit Messages

This bootcamp follows the **Conventional Commits** specification.

Examples:

```text
feat(auth): implement JWT authentication

feat(hr): add employee management

fix(api): validate email address

docs(brd): update inventory requirements

test(auth): add login integration tests

refactor(user): simplify service layer

chore(ci): configure GitHub Actions
```

Commit messages should describe **why** the change exists, not only **what** changed.

---

# Pull Requests

Every completed feature is submitted through a Pull Request.

A Pull Request should include:

- Summary
- Related GitHub Issue
- Screenshots (if applicable)
- Testing Evidence
- Checklist
- Reviewer

Direct commits to the main development branch are prohibited.

---

# Code Reviews

Every Pull Request requires review before merging.

Reviewers should evaluate:

- Business requirements
- Acceptance criteria
- Code quality
- Readability
- Testing
- Security
- Documentation

Code review is a collaborative engineering practice, not a personal critique.

---

# Merge Conflicts

Merge conflicts occur when two branches modify the same code.

The engineer responsible for the branch should:

- Understand both changes
- Resolve conflicts carefully
- Test the application
- Update the Pull Request

Never resolve merge conflicts without understanding the resulting code.

---

# Releases

Completed work is grouped into releases.

Every release should include:

- Version Number
- Release Notes
- Changelog
- Git Tag

Example:

```text
v1.0.0

Features

- Authentication
- User Management

Bug Fixes

- Login validation

Documentation

- Updated API specification
```

---

# GitHub Projects

GitHub Projects are used to organize work throughout the bootcamp.

Typical workflow:

```text
Backlog

↓

Ready

↓

In Progress

↓

Code Review

↓

Testing

↓

Done
```

Every Issue should move through the workflow until completion.

---

# GitHub Milestones

Milestones represent major project goals.

Examples:

- Phase 0 Complete
- Authentication Module
- HR Module
- Inventory Module
- MVP Release
- Version 1.0

Milestones help measure overall project progress.

---

# Best Practices

Professional engineers should:

- Commit frequently
- Write meaningful commit messages
- Keep Pull Requests focused
- Review code carefully
- Keep branches up to date
- Delete merged branches
- Document important decisions
- Never commit secrets or credentials

---

# Common Mistakes

Avoid the following:

- Committing directly to `main`
- Working without a GitHub Issue
- Large, unrelated Pull Requests
- Generic commit messages
- Ignoring merge conflicts
- Leaving stale branches
- Skipping code reviews
- Force-pushing shared branches without coordination

---

# Expected Outcome

By completing this section, the learner should be able to confidently participate in a professional GitHub-based engineering workflow.

This includes:

- Managing repositories
- Creating Issues
- Working with branches
- Writing meaningful commits
- Opening Pull Requests
- Participating in Code Reviews
- Managing releases
- Collaborating with other engineers

Mastering Git and GitHub is a prerequisite for every remaining phase of this bootcamp.

Every feature, bug fix, enhancement, and release throughout the ERP project will be delivered using the workflows described in this document.