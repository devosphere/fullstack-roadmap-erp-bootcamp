# CLAUDE.md

@AGENTS.md

The import above is the shared project spec, also read by Codex/Cursor/Copilot. Put project
facts there. This file holds only what Claude Code needs on top of it.

## Read before acting

- The active sprint doc is the spec for current work: Sprint 00 is complete, Sprint 01 is next
  (`academy/08-sprints/phase-00-foundation/sprint-01-application-foundation.md`). Its acceptance
  criteria are the bar, not general best practice.
- For *how* to build something, use `academy/04-development/` (coding standards, TypeScript,
  project structure) and `academy/01-software-engineering/` (git, PRs, commits, code review).
  Follow those docs instead of inventing conventions.
- When README and academy docs conflict, academy/sprint docs win. The README directory tree is
  aspirational — sprints 06-16, `.github/ISSUE_TEMPLATE/`, `PULL_REQUEST_TEMPLATE.md`, and
  `LICENSE` are listed there but do not exist yet.

## Guardrails

- **There is no build system.** No `package.json`, lockfile, tsconfig, or test runner exists.
  Never run or suggest `npm install` / `npm test` / `npm run build` — say the command doesn't
  exist yet and point at the sprint that creates it.
- **Never commit to `main` or `development`.** One GitHub Issue → one branch
  (`feature/<issue#>-description`) → PR → review → green CI. Conventional Commits, one purpose
  per commit.
- `.github/workflows/ci.yml`, `CONTRIBUTING.MD`, and `CHANGELOG.MD` are empty (0-byte) files.
  They are unfinished Sprint 00 deliverables, not files to leave alone.
- This is a teaching repo: the learner writes the code. Default to explaining, reviewing, and
  scaffolding only what was asked for — don't build ahead of the current sprint.

## Definition of Done

Coding standards → lint → tests → code review → CI green → docs updated → acceptance criteria
met. Code and its documentation change in the same PR.
