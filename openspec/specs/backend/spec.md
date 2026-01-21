# Backend URL Shortener Capability

## ADDED Requirements

### Requirement: Admin‑Only CRUD for Short URLs

The system _must_ allow an authenticated admin user to **create**, **list**, and **delete** short URLs. The routes are protected by JWT authentication.

#### Scenario: Successful URL creation

- **WHEN** the admin sends a `POST /admin/short-urls` request with a valid `targetUrl` in the body and a valid JWT in the `Authorization` header
- **THEN** the service _creates_ a record with a unique 6‑character code, stores the target URL, and returns the created `ShortUrl` payload

#### Scenario: Unauthorized creation attempt

- **WHEN** a request is made to `POST /admin/short-urls` _without_ an `Authorization` header
- **THEN** the system _rejects_ the request with HTTP status `401 UNAUTHORIZED`

#### Scenario: Listing URLs

- **WHEN** the admin sends a `GET /admin/short-urls` request with a valid JWT
- **THEN** the service _returns_ an array of all short URL records owned by the system

#### Scenario: Deleting a URL

- **WHEN** the admin sends a `DELETE /admin/short-urls/:code` request with a valid JWT
- **THEN** the system _deletes_ the matching record and returns `{ success: true }`

### Requirement: JWT‑Based Authentication for Admin Routes

User authentication _shall_ be performed using JSON Web Tokens (JWT). Tokens are issued at login and validated on each protected request.

#### Scenario: Token issuance

- **WHEN** the admin submits a `POST /auth/login` request with correct username and password
- **THEN** the system _returns_ a JSON payload `{ accessToken: string }` and the HTTP status `200 OK`

#### Scenario: Token validation failure

- **WHEN** an admin request contains an expired, malformed, or otherwise invalid token
- **THEN** the request is _rejected_ with HTTP status `401 UNAUTHORIZED`

### Requirement: Public Short‑URL Redirect

The system _must_ expose a public endpoint `GET /:code` that resolves a short code to the target URL, applies optional expiry logic, and performs an HTTP redirect.

#### Scenario: Valid and unexpired code

- **WHEN** a request is made to `GET /ABC123` with a code that exists and has not expired
- **THEN** the request is _redirected_ to the stored `targetUrl` with HTTP status `302 FOUND`

#### Scenario: Expired code

- **WHEN** a request is made to a code that exists but `expiresAt < now()`
- **THEN** the system _responds_ with HTTP status `404 NOT FOUND`

#### Scenario: Unknown code

- **WHEN** a request is made to an unknown code
- **THEN** the system _responds_ with HTTP status `404 NOT FOUND`

### Requirement: IP‑Based Rate Limiting on Public Requests

The system _shall_ enforce a per‑IP token bucket rate limit of **60 requests per minute** on public short URL lookups. Exceeding the limit results in HTTP status `429 TOO MANY REQUESTS`.

#### Scenario: Rate limit exceeded

- **WHEN** an IP makes more than 60 `GET /:code` requests within a 60 second window
- **THEN** the system _rejects_ subsequent requests with status `429 TOOMANYREQUESTS`

### Requirement: Click Tracking and Click Counter

Every successful redirect _must_ be recorded as a click audit entry containing the IP address and timestamp; the total click count on the `ShortUrl` record _must_ be incremented by one.

#### Scenario: Recording a click

- **WHEN** a request for a valid code is processed
- **THEN** a new `Click` record is _created_, the `clicks` column on `ShortUrl` is _incremented_ by one, and the public `GET` response proceeds as normal

### Requirement: Unique Code Generation

The code generator _shall_ produce a **6‑character alphanumeric** string, and the system _must_ guarantee uniqueness against the `code` column, retrying generation up to a sane maximum of attempts.

#### Scenario: Unique code generated

- **WHEN** the generator yields a string of 6 alphabetic/numeric characters
- **THEN** it _must_ be unique; insertion failures due to duplicate codes trigger a regeneration attempt

### Requirement: Optional URL Expiration

A short URL _may_ be assigned an expiry timestamp. After the expiration time, subsequent lookups _shall_ result in HTTP status `404 NOT FOUND`.

#### Scenario: Expired URL handling

- **WHEN** the stored `expiresAt` is in the past
- **THEN** the system _rejects_ lookup with `404 NOT FOUND` and does not record a click.

---

**Note:** Several of the above capabilities (click recording, database factory, token bucket logic reuse, unique code handling) are identified as pending implementation but their expected behaviour is captured herein.
