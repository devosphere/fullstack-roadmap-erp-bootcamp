# [DOCS] Setup Git Workflow Documentation

<!-- GitHub title: [DOCS] Setup Git Workflow Documentation
     Labels: documentation, docs, priority: high
     Milestone: Sprint 00 - Project Foundation
     Branch: docs/002-setup-git-workflow-documentation
     Epic: Project Foundation & Engineering Setup
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [ ] Task
- [ ] Improvement
- [x] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [x] High
- [ ] Critical

## Module: docs
## Sprint: Sprint 00 - Project Foundation & Engineering Setup

---

## Summary

Document the project's source control practices: the branching strategy, branch naming rules,
the Conventional Commits standard, the merge workflow, and the Pull Request process.

## Background

The repository structure exists, but nothing yet defines how code moves through it.

Every issue from this point forward creates a branch, a set of commits, and a Pull Request.
Without written rules, each one is done differently, and the git history becomes unreadable
within a few sprints — which defeats the purpose of a repository intended to demonstrate
professional practice.

These rules also become the content of `CONTRIBUTING.md`, which is currently an empty file
created by Issue 001.

## Acceptance Criteria

```gherkin
Given a developer about to start work on a new issue
When they read the contributing guide
Then they can determine the correct branch name, commit format, and merge path without asking
```

- [ ] Branching strategy documented (`main`, `development`, and supporting branches)
- [ ] Branch naming rules documented with examples for feature, bugfix, hotfix, and docs
- [ ] Conventional Commits standard documented with the allowed types and scopes
- [ ] Merge workflow documented, including which branches squash-merge and which merge-commit
- [ ] Pull Request requirements documented
- [ ] `CONTRIBUTING.md` populated at the repository root
- [ ] All examples use real values from this project, not generic placeholders
- [ ] Links resolve correctly and the document renders correctly on GitHub

## Expected Result

A contributor can read one document and correctly create a branch, write commits, open a Pull
Request, and get it merged, without asking anyone how the project works.

---

## Scope

### Included

- `CONTRIBUTING.md` content
- Branching strategy documentation
- Branch naming convention
- Conventional Commits reference
- Merge and release workflow
- Pull Request requirements

### Out of Scope

- The GitHub issue and PR template files (Issue 003)
- SDLC, Agile, and coding standards documentation (Issue 004)
- Branch protection rules configured in GitHub settings (configured manually, noted in the doc)

## Technical Requirements

**Branch strategy**

```text
main            production
development     integration
staging         pre-production
production      deployment

feature/<issue-number>-description
bugfix/<issue-number>-description
hotfix/<issue-number>-description
docs/<issue-number>-description
```

**Commit format**

```text
<type>(<scope>): <description>

types:  feat, fix, docs, style, refactor, test, chore, perf, build, ci, revert
scopes: auth, hr, inventory, sales, procurement, finance,
        frontend, backend, database, ci, docs
```

**Merge rules**

- Feature and bugfix branches squash-merge.
- Release branches use a merge commit.
- Hotfixes merge into both `main` and `development`.
- Never commit directly to `main` or `development`.

**Documents to produce or update**

```text
CONTRIBUTING.md
academy/01-software-engineering/4-branching-strategy.md
academy/01-software-engineering/7-conventional-commits.md
academy/01-software-engineering/5-pull-request-guide.md
```

## Dependencies

- Issue 001 — the repository structure and the empty `CONTRIBUTING.md` must exist.

## Definition of Done

- [ ] Acceptance criteria met
- [ ] Content accurate and complete
- [ ] Examples verified against this repository
- [ ] Links resolve correctly
- [ ] Renders correctly on GitHub
- [ ] Code review completed
- [ ] CI green
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-00-foundation/sprint-00-project-foundation.md` § 3 |
| Git & GitHub guide | `academy/01-software-engineering/1-git-github.md` |
| Epic | Project Foundation & Engineering Setup |
| Pull Request | _to be linked_ |
