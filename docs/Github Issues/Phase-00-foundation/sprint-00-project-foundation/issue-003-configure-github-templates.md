# [TASK] Configure GitHub Templates

<!-- GitHub title: [TASK] Configure GitHub Templates
     Labels: task, ci, priority: high
     Milestone: Sprint 00 - Project Foundation
     Branch: feature/003-configure-github-templates
     Epic: Project Foundation & Engineering Setup
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [ ] Feature
- [ ] Bug
- [x] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [x] High
- [ ] Critical

## Module: ci
## Sprint: Sprint 00 - Project Foundation & Engineering Setup

---

## Summary

Configure the `.github/` directory: issue templates for each issue type, a Pull Request
template, and the initial CI workflow that validates repository health.

## Background

Issue 002 documented how work should be done. This issue makes GitHub enforce it by default.

A template turns a convention into the path of least resistance. Without one, every issue is
written in a different shape and reviewers have to ask for the same missing information
repeatedly. With one, the structure is filled in before anyone starts typing.

The issue body format is already defined in `format/`. This issue turns those files into
GitHub issue templates so they appear automatically in the **New Issue** picker.

The CI workflow file `.github/workflows/ci.yml` currently exists but is empty.

## Acceptance Criteria

```gherkin
Given a contributor clicks "New Issue" in GitHub
When the template picker appears
Then they can choose Feature, Bug, Task, Improvement, or Documentation
And the chosen template pre-fills the issue body
```

```gherkin
Given a contributor opens a Pull Request
When the PR body loads
Then the Pull Request template is pre-filled
```

- [ ] `.github/ISSUE_TEMPLATE/` created with one template per issue type
- [ ] Issue templates match the section order defined in `format/`
- [ ] `.github/ISSUE_TEMPLATE/config.yml` configured
- [ ] `.github/PULL_REQUEST_TEMPLATE.md` created
- [ ] PR template requires summary, related issue, testing evidence, and a checklist
- [ ] `.github/workflows/ci.yml` populated with repository health checks
- [ ] CI runs successfully on a Pull Request
- [ ] Labels created in the repository
- [ ] Milestone `Sprint 00 - Project Foundation` created

## Expected Result

Opening a new issue or Pull Request presents a pre-filled, correctly structured body. CI runs
automatically on every Pull Request and reports its result.

---

## Scope

### Included

- Issue templates for all five types
- Issue template chooser configuration
- Pull Request template
- Initial CI workflow (markdown and structure validation)
- Repository labels
- Sprint 00 milestone

### Out of Scope

- Build, lint, and test steps in CI (Issue 009 — no build system exists yet)
- Branch protection rules (configured in repository settings)
- Deployment workflows (Sprint 13)

## Technical Requirements

**Files to create**

```text
.github/
├── ISSUE_TEMPLATE/
│   ├── config.yml
│   ├── feature.md
│   ├── bug.md
│   ├── task.md
│   ├── improvement.md
│   └── documentation.md
├── PULL_REQUEST_TEMPLATE.md
└── workflows/
    └── ci.yml
```

**Template source**

Issue template bodies come from `format/`:

```text
format/github-feature.md   →  .github/ISSUE_TEMPLATE/feature.md
format/github-bug.md       →  .github/ISSUE_TEMPLATE/bug.md
format/github-doc.md       →  .github/ISSUE_TEMPLATE/documentation.md
```

Note: `format/github-feature.md` currently ends with a duplicated Acceptance Criteria block
containing bug criteria, and `format/github-bug.md` ends with documentation criteria. Correct
the pairing when porting them into templates.

Each template needs YAML front matter:

```yaml
---
name: Feature
about: A new user-facing or business capability
title: "[FEATURE] "
labels: feature
---
```

**CI workflow — initial checks**

```text
Markdown link validation
Markdown lint
Required file presence (README, CONTRIBUTING, CHANGELOG)
Directory structure validation
```

**Labels to create**

```text
feature  bug  task  improvement  documentation
priority: low  priority: medium  priority: high  priority: critical
auth  hr  inventory  sales  procurement  finance
frontend  backend  database  ci  docs
security  testing  performance  technical-debt  observability  epic
```

## Dependencies

- Issue 001 — `.github/` directory must exist.
- Issue 002 — the PR template restates the workflow rules documented there.

## Definition of Done

- [ ] Acceptance criteria met
- [ ] Templates verified by opening a real test issue and Pull Request
- [ ] CI green on the Pull Request that adds it
- [ ] Documentation updated in the same Pull Request
- [ ] Code review completed
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-00-foundation/sprint-00-project-foundation.md` § 4, § 5 |
| Issue body format | `format/` |
| Issue template | `academy/07-templates/4-issue-template.md` |
| PR template | `academy/07-templates/5-pr-template.md` |
| Epic | Project Foundation & Engineering Setup |
| Pull Request | _to be linked_ |
