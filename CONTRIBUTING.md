# Contributing to fullstack-roadmap-erp-bootcamp

<!-- Write 2-3 sentences: what this repo is, and that every contribution follows the
     workflow below. Mention that the academy/ docs are the long-form explanation and
     this file is the quick reference. -->

---

## Branching Strategy

<!-- One sentence on why the project uses long-lived branches. -->

| Branch | Purpose |
|--------|---------|
| `main` | Production. Always stable and released. |
| `development` | Integration. All feature work merges here first. |
| `staging` | Pre-production validation. |
| `production` | Deployment. |

Work always flows `main <- development <- feature branches`.

`main` and `development` are protected. Never commit to them directly.

> Full explanation: [academy/01-software-engineering/4-branching-strategy.md](academy/01-software-engineering/4-branching-strategy.md)

---

## Branch Naming

<!-- DECIDE THIS FIRST. The academy docs and AGENTS.md say `feature/<issue-number>-description`,
     but the current branch in this repo is `feat/ERP-001-initialize-repository-structure`.
     Pick one, then make this table and 4-branching-strategy.md agree, and use real
     issue numbers from this repo in the examples below. -->

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/<ERP-issue-number>-description` | |
| Bug fix | `bugfix/<ERP-issue-number>-description` | |
| Hotfix | `hotfix/<ERP-issue-number>-description` | |
| Docs | `docs/<ERP-issue-number>-description` | |

Rules:

- One GitHub Issue = one branch.
- Lowercase, hyphen-separated, no spaces.
- Keep it short but descriptive.

---

## Commit Messages

All commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <description>
```

**Types**

`feat` `fix` `docs` `style` `refactor` `test` `chore` `perf` `build` `ci` `revert`

**Scopes**

`auth` `hr` `inventory` `sales` `procurement` `finance` `frontend` `backend` `database` `ci` `docs`

**Examples**

<!-- Replace these with real commits from this repo's git log. -->

```text
docs(ERP-scopes-<issue-number>): add contributing guide
```

Rules:

- One commit = one purpose.
- Description in the imperative mood ("add", not "added").
- No period at the end.

> Full explanation: [academy/01-software-engineering/7-conventional-commits.md](academy/01-software-engineering/7-conventional-commits.md)

---

## Pull Request Process

1. Create a GitHub Issue.
2. Branch off `development` using the naming rules above.
3. Commit your work.
4. Push the branch and open a Pull Request **into `development`** — never into `main`.
5. Request review.
6. Wait for CI to pass.
7. Squash-merge once approved, then delete the branch.

Every Pull Request must include:

- [ ] Summary of the change
- [ ] Linked issue (`Closes #<number>`)
- [ ] Testing evidence
- [ ] Screenshots, if the change affects the UI

> Full explanation: [academy/01-software-engineering/5-pull-request-guide.md](academy/01-software-engineering/5-pull-request-guide.md)

---

## Merge Rules

| Branch type | Strategy |
|-------------|----------|
| Feature, bugfix, docs | Squash merge |
| Release | Merge commit |
| Hotfix | Merge into **both** `main` and `development` |

<!-- One sentence on why: squash keeps development's history readable, merge commits
     preserve release history. -->

---

## Code Review

<!-- What a reviewer is expected to check, and how many approvals a PR needs before merge.
     Keep it to a short list. -->

> Full explanation: [academy/01-software-engineering/6-code-review.md](academy/01-software-engineering/6-code-review.md)

---

## Definition of Done

A change is done when:

- [ ] Coding standards followed
- [ ] Lint passes
- [ ] Tests pass
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met

---

## Questions

<!-- Where to ask. -->
