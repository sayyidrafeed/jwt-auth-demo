# 🔐 Next.js 16 JWT Authentication Demo

A production-ready, full-stack Next.js application demonstrating JSON Web Token (JWT) authentication, Refresh Token Rotation (RTR), Token Revocation (blacklisting), and **protected asset serving**. Built with **Next.js 16 (App Router)**, **Drizzle ORM**, **PostgreSQL**, and **Bun**.

---

## 🚀 Features

- **Stateless JWT Authentication** — Access tokens in `httpOnly`, `sameSite: "lax"`, `secure` (prod) cookies.
- **Refresh Token Rotation (RTR)** — Long-lived refresh tokens, hashed in the DB, rotated on each refresh.
- **Token Revocation (Blacklist)** — Optional blacklist via `ENABLE_TOKEN_BLACKLIST` env flag.
- **Protected Asset Serving** — `GET /api/assets/[filename]` serves images only to authenticated users. Attempts without a valid `access_token` cookie return `401 Unauthorized`.
- **Interactive Auth Demo** — Dashboard shows session JWT claims, renders a protected asset, and lets you test unauthenticated access to prove the auth gate works.
- **Token Inspector** — `/tokens` page decodes and displays raw JWT header, payload, signature; supports manual refresh and revoke actions.
- **Fully Type-Safe** — Strict TypeScript throughout, including DB schemas, API handlers, and utilities.
- **Oxlint** — Ultra-fast linting.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | [Bun](https://bun.sh/) |
| Framework | [Next.js 16 (App Router)](https://nextjs.org/) |
| Database ORM | [Drizzle ORM](https://orm.drizzle.team/) |
| Database | PostgreSQL (local via Docker Compose or Neon serverless) |
| JWT | [jose](https://github.com/panva/jose) (HS256) |
| Password Hashing | [bcryptjs](https://github.com/dcodeIO/bcrypt.js/) (12 rounds) |
| Styling | Plain CSS |
| Linter | [Oxlint](https://github.com/oxc-project/oxc) |

---

## 📁 Project Structure

```
jwt-auth-demo/
├── docker-compose.yml              # Local PostgreSQL (port 5433)
├── drizzle.config.ts               # Drizzle Kit config
├── oxlint.json                     # Oxlint config
├── package.json                    # Scripts & dependencies
├── tsconfig.json                   # Strict TypeScript config
├── src/
│   ├── assets/
│   │   └── cat-hihi.webp           # Demo protected image
│   ├── app/
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Public landing page
│   │   ├── (auth)/
│   │   │   ├── sign-in/page.tsx    # Sign In form
│   │   │   └── sign-up/page.tsx    # Sign Up form
│   │   ├── (protected)/
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx        # Dashboard (session info + protected asset)
│   │   │   │   └── auth-demo-panel.tsx  # Interactive 401 demo
│   │   │   └── tokens/page.tsx     # JWT token inspector
│   │   └── api/
│   │       ├── assets/[filename]/route.ts  # Protected asset serving
│   │       └── auth/
│   │           ├── sign-up/route.ts
│   │           ├── sign-in/route.ts
│   │           ├── sign-out/route.ts
│   │           ├── refresh/route.ts
│   │           ├── token-info/route.ts
│   │           └── verify-blacklist/route.ts
│   ├── components/
│   │   ├── navbar.tsx              # Navigation (auth-aware)
│   │   └── verify-button.tsx       # Token validity checker
│   ├── db/
│   │   ├── index.ts                # DB connection
│   │   └── schema.ts               # users, refresh_tokens, revoked_tokens
│   ├── lib/
│   │   ├── jwt.ts                  # Sign, verify, hash tokens
│   │   ├── password.ts             # bcryptjs hash/compare
│   │   └── session.ts              # Server-side session from cookie
│   └── proxy.ts                    # Middleware logic (not yet wired as middleware.ts)
```

---

## ⚙️ Getting Started

### Prerequisites

- [Bun](https://bun.sh/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local DB)

### 1. Install

```bash
bun install
```

### 2. Environment

```bash
cp .env.example .env.local
```

Key variables:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/jwtauth` |
| `JWT_SECRET` | HMAC signing key (min 32 bytes) | `openssl rand -base64 32` |
| `JWT_ACCESS_EXPIRY` | Access token lifetime | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token lifetime | `7d` |
| `ENABLE_TOKEN_BLACKLIST` | Enable blacklist queries | `false` or `true` |

### 3. Start Database

```bash
bun run docker:up
```

### 4. Migrate

```bash
bun run db:generate
bun run db:migrate
```

### 5. Run

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🛡️ Authentication Flow

### Token Strategy

1. **Access Token** — Short-lived (default `15m`). Signed with HS256 via `jose`. Contains `{ userId, email, jti }`. Stored in `access_token` cookie.
2. **Refresh Token** — Long-lived (default `7d`). SHA-256 hash stored in `refresh_tokens` table. Stored in `refresh_token` cookie. Rotated on each use.

### Sign Up / Sign In

1. Server validates credentials, signs both tokens, persists refresh token hash, sets cookies.
2. Client-side redirect to `/dashboard`.

### Silent Refresh (via proxy.ts)

The `proxy.ts` module contains logic to detect expired access tokens and automatically refresh them server-to-server using the refresh token cookie. To activate it, rename `src/proxy.ts` to `src/middleware.ts`. This is currently opt-in to keep the demo simple.

### Token Revocation

- On sign-out, refresh token is deleted from DB.
- If `ENABLE_TOKEN_BLACKLIST=true`, the access token's `jti` is inserted into `revoked_tokens`.
- Subsequent requests check the blacklist.

---

## 🧪 Demo Walkthrough

### Dashboard (`/dashboard`)

1. **Session Info** — Displays decoded JWT claims: email, userId, jti, iat, exp.
2. **Protected Asset** — Renders `cat-hihi.webp` via `/api/assets/cat-hihi.webp`. The browser automatically sends the `access_token` cookie, so the image loads. Attempts without the cookie return `401`.
3. **Authorization Demo** — Click "Test Unauthenticated Access" to fetch the same asset with `credentials: "omit"`, proving that the endpoint rejects unauthenticated requests.
4. **Verify Token** — Calls `/api/auth/token-info` to confirm the token is valid.

### Token Inspector (`/tokens`)

- Decodes and displays the JWT header, payload, signature, and raw token string.
- Supports manual token refresh and revoke + sign out actions.

---

## 💻 Commands

| Command | Description |
|---|---|
| `bun run dev` | Dev server (Turbopack) |
| `bun run build` | Production build |
| `bun run start` | Production server |
| `bun run lint` | Oxlint |
| `bun run lint:fix` | Oxlint auto-fix |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Apply migrations |
| `bun run db:studio` | Drizzle Studio |
| `bun run docker:up` | Start PostgreSQL container |
| `bun run docker:down` | Stop PostgreSQL container |
