# Classic Football Lab — Documentation Index

CFL is a Next.js 16 web app for a youth football development business in Santa Clarita, CA. It hosts the public marketing site, an admin portal for coaches (Eduardo and Camila), and secure evaluation reports for parents.

## Quick Start

Read these in order:

1. Project Architecture → `System/project-architecture.md`
2. Database Schema → `System/database-schema.md`
3. Auth & Roles → `System/auth-and-roles.md`
4. Evaluation Model → `System/evaluation-model.md`
5. Notification Model → `System/notification-model.md`
6. Development Workflow → `SOP/development-workflow.md`
7. Claude evaluation JSON export → `SOP/claude-evaluation-export.md`

## Three Areas of the App

1. **Public** `/` — Marketing landing page (no auth)
2. **Admin** `/admin/*` — Coach portal — Eduardo and Camila only (email/password via `/login`; `src/proxy.ts` requires a valid session and a `public.coaches` row)
3. **Reports** `/report/[token]` — Parent evaluation view (token + PIN)

## Tech Stack

- Next.js 16 App Router (TypeScript)
- Supabase (Postgres + Auth + RLS + Storage)
- Tailwind CSS
- TanStack Query (server state + mutations)
- Zustand (UI state)
- Zod (validation)
- Resend (transactional email)
- Twilio (SMS — optional, very low cost per message)
- Vercel (hosting + environment variables)

## Roles

- **coach** — Full admin access. Currently Eduardo and Camila. Adding a third coach = insert one row in `public.coaches`. No code change.
- **public** — Landing page only. No auth.
- **parent** — Report view only. Unique link + PIN. No account required.
