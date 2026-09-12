# Authentication API

## Purpose

Issue 010 provides registration, access-token login, authenticated profile retrieval, and logout.
The API uses the global `/api` prefix configured in `backend/src/main.ts`.

## Environment configuration

Configure these values in `backend/.env`; never commit the real secret.

```dotenv
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRES_IN=15m
```

The application refuses to start when `JWT_SECRET` is missing. `JWT_EXPIRES_IN` controls the access-token lifetime and defaults to `15m` when omitted. It accepts the duration format used by `@nestjs/jwt`, such as `15m` or `1h`.

## Authentication model

- `POST /api/auth/register` and `POST /api/auth/login` are public.
- `GET /api/auth/me` and `POST /api/auth/logout` require `Authorization: Bearer <accessToken>`.
- A successful login issues a signed JWT with `sub` (user ID), `email`, `iat`, and `exp`.
- Passwords are hashed before storage. Password hashes and JWT secrets must never appear in responses or logs.

## Endpoints

### Register a user

`POST /api/auth/register`

Request body:

```json
{
  "company_id": "a-valid-company-uuid",
  "email": "jane@example.com",
  "password_hash": "a-password-with-at-least-six-characters",
  "first_name": "Jane",
  "last_name": "Doe"
}
```

The current request field is named `password_hash` for compatibility with the existing DTO, but callers must send the raw password. The service hashes it before writing the user record.

Success: `201 Created`; the response contains the safe user profile and excludes the stored password hash.

Errors: `400 Bad Request` for invalid input; `409 Conflict` when the email is already registered.

### Log in

`POST /api/auth/login`

Request body:

```json
{
  "email": "jane@example.com",
  "password_hash": "a-password-with-at-least-six-characters"
}
```

Success: `201 Created` with an `accessToken` in the standard response envelope.

Errors: `400 Bad Request` for malformed input; `401 Unauthorized` with the generic message `Invalid email or password` for invalid credentials.

### Get the current profile

`GET /api/auth/me`

Headers:

```text
Authorization: Bearer <accessToken>
```

Success: `200 OK` with the authenticated user's safe profile.

Errors: `401 Unauthorized` for a missing, malformed, invalid, or expired token.

### Log out

`POST /api/auth/logout`

Headers:

```text
Authorization: Bearer <accessToken>
```

Success: `201 Created`. The current access-token design is stateless, so logout records an audit event and the client must discard the token. Server-side token revocation is deferred to Issue 070.

Errors: `401 Unauthorized` for a missing, malformed, invalid, or expired token.

## Audit events

The auth service writes `USER_CREATED`, `LOGIN_SUCCEEDED`, `LOGIN_FAILED`, and `LOGOUT` events to the security audit log, with request IP address and user agent when available. Audit events are append-only and must be created internally by application services.

## Automated verification

The test suite runs without a live PostgreSQL database. Its test-only Prisma and JWT doubles are configured in `backend/test/`, so the commands below do not create users or audit rows in a database.

From `backend/`:

```powershell
npx.cmd eslint "{src,apps,libs,test}/**/*.ts"
npm.cmd test -- --runInBand
npm.cmd run test:e2e -- --runInBand
npm.cmd run typecheck
```

The auth service tests cover password hashing, duplicate registration, successful token issuance, and indistinguishable invalid-credential responses. The endpoint tests cover Zod request validation, public register/login routing, and protected `/me` and `/logout` routes with missing, malformed, expired, and valid-token outcomes. The JWT strategy test verifies that failed JWT validation returns a 401.

## Verification still required

The automated tests use mocks for Prisma and the audit service. Before Issue 010 is closed, run a database-backed integration test that verifies `USER_CREATED`, `LOGIN_SUCCEEDED`, `LOGIN_FAILED`, and `LOGOUT` events actually persist to the audit log. Do not use production credentials for that test.
