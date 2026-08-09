# [FEATURE] Create Authentication UI

<!-- GitHub title: [FEATURE] Create Authentication UI
     Labels: feature, frontend, priority: high
     Milestone: Sprint 02 - Identity & Access Management
     Branch: feature/014-create-authentication-ui
     Epic: Identity & Access Management
     Depends on: 010, 013
     Copy everything below this comment into the issue body. -->

## Issue Type:

- [x] Feature
- [ ] Bug
- [ ] Task
- [ ] Improvement
- [ ] Documentation

## Priority:

- [ ] Low
- [ ] Medium
- [x] High
- [ ] Critical

## Module: frontend
## Sprint: Sprint 02 - Identity & Access Management

---

## Summary

Build the frontend authentication experience: a login page, authenticated session state, protected
routes, role-aware navigation, and logout.

## Background

The backend can authenticate and authorize, but there is no way for a person to use it.

This issue also sets the client-side security posture that every later screen inherits. The main
decision is token storage: anything readable by JavaScript is readable by injected JavaScript. The
approach chosen here is applied to every authenticated request in the remaining sprints and is
reviewed again in Sprint 11.

Role-aware navigation matters for usability, not security. Hiding a menu item the user cannot use
is good design; the server still rejects the request if they navigate to it directly. Both must be
true.

## User Story

As a System User,
I want to log in through the application and stay signed in as I navigate,
So that I can use the ERP system without re-authenticating on every page.

## Acceptance Criteria

```gherkin
Given a registered user on the login page
When they submit valid credentials
Then they are authenticated and redirected to the application home page
```

```gherkin
Given an unauthenticated visitor
When they navigate directly to a protected route
Then they are redirected to the login page
```

```gherkin
Given an authenticated user
When they click logout
Then the session is cleared and protected routes are no longer accessible
```

```gherkin
Given an authenticated user whose token has expired
When they make a request
Then they are returned to the login page with an explanatory message
```

- [ ] Login page created with email and password fields
- [ ] Client-side validation with clear field-level error messages
- [ ] Failed login shows a generic message that does not reveal whether the email exists
- [ ] Loading state shown while the request is in flight
- [ ] Authentication state managed globally and available to any component
- [ ] Token attached automatically to authenticated API requests
- [ ] Protected route wrapper redirecting unauthenticated users to login
- [ ] Redirect back to the originally requested page after login
- [ ] Logout clears the session and redirects to login
- [ ] Expired or rejected token triggers logout and redirect
- [ ] Navigation renders only items the user's permissions allow
- [ ] Current user's name displayed in the application shell
- [ ] Authentication flow documented in `frontend/README.md`

## Expected Result

A user can log in, move around the application without re-authenticating, see only the navigation
relevant to their role, and log out. Direct navigation to a protected route while signed out sends
them to login.

---

## Scope

### Included

- Login page and form
- Authentication state management
- API client token attachment
- Protected route wrapper
- Post-login redirect handling
- Logout
- Expired token handling
- Permission-aware navigation
- Documentation

### Out of Scope

- Registration UI (accounts are created by administrators in Issue 011)
- Password reset UI (Sprint 11, Issue 070)
- MFA challenge UI (Sprint 11, Issue 070)
- User and role administration screens
- Employee self-service portal (Sprint 04, Issue 027)

## Technical Requirements

**Stack**

| Concern | Choice |
|---------|--------|
| Server state | TanStack Query |
| Client state | Zustand |
| Forms | React Hook Form |
| Validation | Zod |

**Routes**

```text
/login              public
/                   protected
/*                  protected by default
```

**Structure**

```text
frontend/src/
├── app/
│   └── login/
├── features/
│   └── auth/
│       ├── components/login-form.tsx
│       ├── hooks/use-auth.ts
│       └── services/auth.service.ts
├── providers/
│   └── auth-provider.tsx
└── components/
    └── protected-route.tsx
```

**Rules**

- Token storage approach documented with its trade-off, and revisited in Sprint 11.
- A single API client attaches the token; individual components never handle it.
- A 401 response triggers logout centrally, not per component.
- Navigation filtering uses permissions from `GET /api/auth/me/permissions`, never a hard-coded role name.
- Hidden UI is never treated as an access control.

## Dependencies

- Issue 010 — login and current-user endpoints must exist.
- Issue 013 — the effective permissions endpoint is needed for navigation filtering.

## Definition of Done

- [ ] Coding standards followed (`academy/04-development/`)
- [ ] Lint passes
- [ ] Component tests for the login form, including validation errors
- [ ] Test for protected route redirect behaviour
- [ ] End-to-end test: log in, reach a protected page, log out
- [ ] Code review completed
- [ ] CI green
- [ ] Documentation updated in the same Pull Request
- [ ] Acceptance criteria met
- [ ] Pull Request squash-merged into `development`

## Related Links

| Artifact | Reference |
|----------|-----------|
| Sprint spec | `academy/08-sprints/phase-01-core-platform/sprint-02-identity-access-management.md` § 7 |
| Epic | Identity & Access Management |
| Reviewed by | Issue 072 (Sprint 11, frontend security) |
| Pull Request | _to be linked_ |
