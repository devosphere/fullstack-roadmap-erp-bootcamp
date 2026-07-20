# Conventional Commits

**Version:** 1.0

---

# Purpose

A commit history tells the story of a software project.

Every commit should clearly communicate **what changed** and **why it changed**.

Throughout this bootcamp, all commits must follow the **Conventional Commits Specification** to maintain a clean, searchable, and professional Git history.

Following a consistent commit standard improves collaboration, simplifies code reviews, and enables automated release tooling.

---

# Learning Objectives

By the end of this section, the learner should be able to:

- Understand the purpose of Conventional Commits
- Write meaningful commit messages
- Select the appropriate commit type
- Organize commits logically
- Maintain a professional Git history
- Prepare projects for automated versioning and release management

---

# What is a Conventional Commit?

A Conventional Commit follows a standardized format:

```text
<type>(<scope>): <description>
```

Example:

```text
feat(auth): implement JWT authentication
```

Every commit should answer two questions:

- What changed?
- Why was the change made?

---

# Commit Structure

```text
feat(auth): implement JWT authentication
│      │             │
│      │             └── Short description
│      │
│      └──────────────── Scope
│
└─────────────────────── Commit Type
```

---

# Commit Types

## feat

Introduces a new feature.

Examples:

```text
feat(auth): implement JWT authentication

feat(hr): add employee management module

feat(crm): create customer profile page
```

---

## fix

Fixes a bug or defect.

Examples:

```text
fix(auth): resolve login validation issue

fix(api): return correct HTTP status code

fix(inventory): correct stock calculation
```

---

## docs

Updates documentation only.

Examples:

```text
docs(readme): update installation guide

docs(api): add authentication examples

docs(brd): revise procurement requirements
```

---

## style

Changes formatting without affecting functionality.

Examples:

```text
style(frontend): format dashboard components

style(api): apply linting fixes
```

---

## refactor

Improves existing code without changing behavior.

Examples:

```text
refactor(user): simplify service layer

refactor(database): extract repository pattern

refactor(auth): reduce duplicated validation
```

---

## test

Adds or updates automated tests.

Examples:

```text
test(auth): add login unit tests

test(api): improve integration coverage

test(hr): add employee API tests
```

---

## chore

Maintenance work that does not directly affect application features.

Examples:

```text
chore(ci): configure GitHub Actions

chore(deps): update npm packages

chore(build): improve build configuration
```

---

## perf

Performance improvements.

Examples:

```text
perf(api): optimize employee search

perf(database): reduce query execution time
```

---

## build

Changes related to build systems or dependencies.

Examples:

```text
build(frontend): update Vite configuration

build(docker): optimize production image
```

---

## ci

Changes to Continuous Integration or deployment workflows.

Examples:

```text
ci(github): add automated test workflow

ci(actions): run lint before tests
```

---

## revert

Reverts a previous commit.

Examples:

```text
revert(auth): remove experimental login flow
```

---

# Common Scopes

Scopes describe the part of the project affected by the commit.

Examples:

```text
auth

api

frontend

backend

database

inventory

sales

crm

hr

payroll

procurement

docker

ci

docs

tests
```

Choose scopes that reflect the affected module or component.

---

# Writing Good Commit Messages

Commit descriptions should:

- Be concise
- Use the imperative mood
- Start with a verb
- Describe the change

Good examples:

```text
implement login endpoint

add employee validation

remove duplicate query

update API documentation

optimize dashboard rendering
```

Avoid:

```text
fixed stuff

update

changes

test

work

final
```

---

# Good Examples

```text
feat(auth): implement JWT authentication

feat(hr): create employee onboarding module

fix(api): validate required request fields

docs(readme): improve installation instructions

test(users): add integration tests

refactor(inventory): simplify stock calculation

chore(ci): configure GitHub Actions

perf(database): optimize inventory queries

build(frontend): upgrade React version

ci(actions): execute tests on pull requests
```

---

# Poor Examples

```text
Update

Fix

Testing

Work

Done

asdf

Changes

Final

Bug fix

Commit
```

These messages provide little or no context.

---

# One Commit, One Purpose

Each commit should represent a single logical change.

Good:

```text
feat(auth): implement password reset

test(auth): add password reset tests

docs(auth): document password reset endpoint
```

Poor:

```text
feat(auth): implement password reset, update README, fix inventory bug
```

Separate unrelated work into multiple commits.

---

# Commit Frequently

Avoid creating one massive commit at the end of the day.

Instead:

```text
feat(auth): create login endpoint

feat(auth): implement JWT generation

test(auth): add login unit tests

docs(api): document authentication endpoint
```

Smaller commits are easier to review and troubleshoot.

---

# Before Committing

Verify:

- Code builds successfully
- Tests pass
- Files are formatted
- No debugging code remains
- No secrets or credentials are committed

Review staged files using:

```bash
git status

git diff --staged
```

---

# Commit Workflow

Every development task should follow this process.

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
git add
        │
        ▼
git commit
        │
        ▼
git push
        │
        ▼
Pull Request
```

Every commit contributes to the Pull Request history.

---

# Release History Example

```text
feat(auth): implement JWT authentication

feat(hr): create employee management

feat(inventory): add stock adjustment

fix(api): validate employee IDs

test(auth): improve authentication coverage

docs(api): document inventory endpoints

chore(ci): configure GitHub Actions
```

A clean history makes project evolution easy to understand.

---

# Best Practices

Professional engineers should:

- Follow the Conventional Commits format
- Keep commits focused on one purpose
- Write meaningful descriptions
- Commit frequently
- Avoid committing generated files unnecessarily
- Review changes before committing

---

# Common Mistakes

Avoid:

- Generic commit messages
- Large unrelated commits
- Mixing documentation and feature work unnecessarily
- Committing broken code
- Committing secrets or credentials
- Skipping local testing before committing

---

# Conventional Commits in This Bootcamp

Every Sprint in this bootcamp requires professional Git practices.

Every completed GitHub Issue should result in a series of meaningful commits that clearly document the implementation process.

The Git history should tell the story of how the ERP system evolved over time.

---

# Expected Outcome

By completing this section, the learner should be able to produce a clean, consistent, and professional Git commit history.

Throughout the ERP Bootcamp, every commit should follow the Conventional Commits specification, ensuring that the project's history remains understandable, maintainable, and suitable for professional software engineering environments.