# AuditFlow — Engineering Institution Audit & Compliance System

Next.js 14 App Router prototype for BUILDATHON 2026 Problem Statement 01.

## Run locally

1. Start the included MySQL service with `docker compose up -d` (or set your own `DATABASE_URL` in `.env`). The default local URL is `mysql://root:your_password@localhost:3306/auditflow_db`.
2. Run `npm install`, `npm run db:generate`, `npx prisma db push`, then `npm run db:seed`.
3. Run `npm run dev` and open `http://localhost:3000`.

Demo password: `Demo@2026`. Seeded accounts are `admin@audit.edu`, `coordinator@audit.edu`, `head.cse@audit.edu`, and `auditor@audit.edu`.

JWT role checks protect all API routes. For the UI prototype, wire the returned login token into a secure HTTP-only cookie or an authorization header through your preferred NextAuth/JWT session adapter.
