<!--
Title: <type>(<scope>): <description>
Use Conventional Commits. Example: feat(auth): add access-token login
Open feature, bugfix, docs, and chore PRs against development, never main.
Remove sections that are not applicable, but explain any unchecked required item.
-->

## Summary

<!-- What changed, why it is needed, and the user or business outcome. Keep this to 2-4 sentences. -->

## Related Work

Closes #

<!-- Link related issues, ADRs, API docs, designs, or follow-up work when applicable. -->

## Type of Change

- [ ] Feature
- [ ] Bug fix
- [ ] Improvement / refactor
- [ ] Documentation
- [ ] Security
- [ ] Chore / CI / infrastructure

## Changes Implemented

<!-- Group the actual changes by area. Delete unused headings. -->

### Frontend

-

### Backend / API

-

### Database / Infrastructure

- [ ] Not applicable
- [ ] Migration included (name it below)
- [ ] No migration required

### Documentation

-

## Behaviour and Risk

<!-- State observable behavior changes, compatibility impact, and risks. Write “None” where appropriate. -->

- **User-facing behavior:**
- **Breaking change / migration required:**
- **Security or privacy impact:**
- **Performance impact:**
- **Rollback plan:**

## Testing Evidence

<!-- List exact commands and outcomes. State what was not tested and why. Do not mark a check passed unless you ran it. -->

```text
Command:
Result:
```

### Manual Verification

<!-- Include route, click path, test data, and observed result. Write “Not applicable” if no manual test is needed. -->

-

### Not Verified / Follow-up

<!-- Examples: requires a test database, external service unavailable, deferred performance test. -->

-

## Screenshots or Recording

<!-- Required for UI changes. Delete this section when not applicable. -->

| Before | After |
| --- | --- |
|  |  |

---

## Acceptance Criteria

<!-- Copy the linked issue’s acceptance criteria and tick each item only after verification. -->

- [ ]

## Checklist

### Delivery

- [ ] Branch follows the naming convention in [CONTRIBUTING.MD](../CONTRIBUTING.MD)
- [ ] Commits follow Conventional Commits
- [ ] This PR targets `development`, not `main`
- [ ] Scope is limited to the linked issue; unrelated changes are excluded
- [ ] No secrets, credentials, or sensitive production data are included

### Quality

- [ ] Code follows the academy coding standards
- [ ] Lint and formatting checks pass
- [ ] Relevant unit, integration, and/or E2E tests pass
- [ ] New or changed behavior has appropriate test coverage
- [ ] Documentation changed with the implementation, when applicable
- [ ] Database migration and rollback impact were reviewed, when applicable
- [ ] Acceptance criteria above are met

### Review and Merge

- [ ] Reviewer assigned
- [ ] Reviewer feedback addressed
- [ ] CI is green
- [ ] Ready for squash merge into `development`

## Reviewer Notes

<!-- Name the files or decisions to inspect first, plus assumptions or trade-offs that need review. -->

-
