# 🔐 Next.js 16 JWT Authentication Demo

A production-ready, highly secure, full-stack Next.js application demonstrating state-of-the-art JSON Web Token (JWT) authentication, Refresh Token Rotation (RTR), and Token Revocation (Blacklisting). Built with modern tech standards: **Next.js 16 (App Router)**, **Tailwind CSS v4**, **Drizzle ORM**, **PostgreSQL**, and **Bun**.

---

## 🚀 Key Features

*   **Stateless JWT Authentication**: Access tokens are stored in secure, `httpOnly`, `sameSite: "lax"`, and `secure` (in production) cookies, minimizing CSRF and XSS vulnerability risks.
*   **Refresh Token Rotation (RTR)**: Long-lived refresh tokens are stored as secure cookies and hashed in the database. When a user requests a new access token, the current refresh token is rotated (invalidated, and a new one is issued) to prevent replay attacks.
*   **Graceful Silent Refresh**: Next.js middleware detects expired or expiring access tokens and performs an automatic, server-to-server silent token refresh using the refresh token, providing a seamless UX without page flashes or unauthenticated states.
*   **Optional Token Revocation (Blacklist)**: An optimized revocation mechanism tracks revoked token identifiers (`jti`) in a database blacklist. Can be enabled/disabled via the `ENABLE_TOKEN_BLACKLIST` environment flag.
*   **Fully Type-Safe**: Implements strict TypeScript checks throughout the application, including DB schemas, API handlers, and utilities.
*   **Supercharged Tooling**: Integrated with **Oxlint** for ultra-fast, modern linting.

---

## 🛠️ Tech Stack

*   **Runtime**: [Bun](https://bun.sh/)
*   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
*   **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
*   **Database**: PostgreSQL (Support for [Neon Database](https://neon.tech/) serverless driver & local PostgreSQL via Docker Compose)
*   **JWT & Cryptography**: [jose](https://github.com/panva/jose) (Lightweight, web-standards compliant) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Linter**: [Oxlint](https://github.com/oxc-project/oxc)

---

## 📁 Project Structure

```text
jwt-auth-demo/
├── docker-compose.yml       # Local PostgreSQL database setup
├── drizzle.config.ts        # Drizzle migration and schema config
├── oxlint.json              # Oxlint configuration
├── package.json             # Scripts & dependency definitions
├── tsconfig.json            # TypeScript configuration
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication Route Group (sign-in, sign-up)
│   │   ├── (protected)/     # Protected Routes Group (dashboard)
│   │   ├── api/auth/        # Auth REST endpoints (sign-in, sign-up, sign-out, refresh, verify-blacklist)
│   │   ├── globals.css      # Core styles & Tailwind directives
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── components/          # Reusable UI components (Navbar, etc.)
│   ├── db/
│   │   ├── index.ts         # Database connection setup
│   │   └── schema.ts        # Database schema (users, refresh_tokens, revoked_tokens)
│   ├── lib/
│   │   ├── jwt.ts           # Token generation, verification, and hashing utils
│   │   ├── password.ts      # Password hashing & validation utilities
│   │   └── session.ts       # Utility to get current authenticated user session
│   └── middleware.ts        # Route protection, redirect rules, and silent token refresh
```

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed:
*   [Bun](https://bun.sh/)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local database execution)

---

### 1. Installation

Clone the repository and install the project dependencies:

```bash
bun install
```

---

### 2. Configure Environment Variables

Copy the example environment configuration file to create your local environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` and configure the settings. Below are the key environment variables:

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection string to your PostgreSQL instance. | `postgresql://postgres:password@localhost:5432/jwtauth` |
| `JWT_SECRET` | A secure string used to sign JWTs (minimum 32 bytes). | Run `openssl rand -base64 32` to generate |
| `JWT_ACCESS_EXPIRY` | Lifetime of access tokens. | `15m` |
| `JWT_REFRESH_EXPIRY` | Lifetime of refresh tokens. | `7d` |
| `ENABLE_TOKEN_BLACKLIST` | Toggles query checks to the blacklist database on every request. | `false` (default) or `true` |

---

### 3. Spin Up the Local Database

Run the Docker Compose setup to pull and launch a local PostgreSQL container:

```bash
bun run docker:up
```

---

### 4. Database Migrations

Generate and apply the database migrations to set up the schemas for users, refresh tokens, and revoked tokens:

```bash
# Generate SQL migration files based on src/db/schema.ts
bun run db:generate

# Apply migrations to the PostgreSQL database
bun run db:migrate
```

---

### 5. Running the Application

Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🛡️ Security Architecture & Authentication Flow

### 📦 Access & Refresh Tokens Strategy
1.  **Access Token**: Short-lived (e.g., `15m`). Signed with `jose.SignJWT` using the HMAC SHA-256 algorithm (`HS256`). Contains user identifiers and a unique `jti` (JWT ID). Stored in a secure `access_token` cookie.
2.  **Refresh Token**: Long-lived (e.g., `7d`). Signed securely and stored in a secure `refresh_token` cookie. An SHA-256 hash of this token is saved in the `refresh_tokens` database table associated with the user.

---

### 🔄 Silent Refresh Flow
The Next.js Middleware acts as the primary gatekeeper for protected routes:

```mermaid
sequenceDiagram
    autonumber
    actor User as Client Browser
    participant MW as Next.js Middleware
    participant API as /api/auth/refresh
    participant DB as PostgreSQL DB

    User->>MW: Request Protected Route (/dashboard)
    alt Access Token is Valid
        MW-->>User: Allow Access (NextResponse.next)
    else Access Token is Expired / Missing
        MW->>MW: Check for refresh_token cookie
        alt refresh_token is Missing
            MW-->>User: Redirect to /sign-in
        else refresh_token is Present
            MW->>API: Call POST /api/auth/refresh (sending refresh_token)
            API->>DB: Lookup & verify active refresh token hash
            alt Token Valid & Active
                API->>DB: Delete old token, save new rotated refresh token hash
                API-->>MW: Return new access_token & refresh_token cookies
                MW-->>User: Set-Cookie & Allow Access (NextResponse.next)
            else Token Invalid / Replay Detected
                API-->>MW: Return 401 Unauthorized
                MW-->>User: Clear Cookies & Redirect to /sign-in
            end
        end
    end
```

---

### 🚫 Token Revocation & Blacklisting
When users sign out, their tokens can optionally be revoked to ensure they cannot be reused if compromised:
*   The refresh token is permanently deleted from the `refresh_tokens` table.
*   If `ENABLE_TOKEN_BLACKLIST` is set to `true`, the access token's `jti` is inserted into the `revoked_tokens` table with an expiration timestamp equal to the token's lifetime.
*   During every subsequent request validation, the system queries the `revoked_tokens` table to check if the incoming `jti` is blacklisted.

---

## 💻 Development Commands Reference

Here is a summary of the scripts defined in `package.json`:

*   `bun run dev` - Launches the Next.js development server with Turbopack enabled.
*   `bun run build` - Builds the application for production.
*   `bun run start` - Starts the Next.js production server.
*   `bun run lint` - Runs `oxlint` to analyze the source code for bugs and anti-patterns.
*   `bun run lint:fix` - Runs `oxlint` and applies automatic fixes where possible.
*   `bun run typecheck` - Compiles TypeScript with the `--noEmit` flag to run strict type checking.
*   `bun run db:generate` - Generates SQL migration files from the Drizzle schemas.
*   `bun run db:migrate` - Applies outstanding database migrations.
*   `bun run db:studio` - Launches Drizzle Studio (web database browser) at `https://local.drizzle.studio`.
*   `bun run docker:up` - Starts the local PostgreSQL database Docker container.
*   `bun run docker:down` - Shuts down the local PostgreSQL database Docker container.
