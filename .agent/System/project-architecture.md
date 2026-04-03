# Project Architecture

## Overview

Classic Football Lab is a Next.js 16 App Router application. Public marketing site + coach admin portal + parent-facing evaluation reports. Hosted on Vercel. Backend is Supabase.

## Tech Stack

| Layer         | Technology          | Version | Purpose                    |
| ------------- | ------------------- | ------- | -------------------------- |
| Framework     | Next.js             | 16.x    | App Router, RSC, routing   |
| Language      | TypeScript          | 5.x     | Type safety                |
| Styling       | Tailwind CSS        | 3.x     | Utility-first CSS          |
| Icons         | Lucide React        | latest  | Icon set                   |
| Server state  | TanStack Query      | 5.x     | Caching, mutations         |
| Client state  | Zustand             | 4.x     | UI state, modals, toasts   |
| Forms         | react-hook-form     | 7.x     | Form state                 |
| Validation    | Zod                 | 3.x     | Schema validation          |
| Database      | Supabase (Postgres) | latest  | RLS, Auth, Storage         |
| Email         | Resend              | latest  | Transactional email        |
| SMS           | Twilio              | latest  | Optional SMS share         |
| Hosting       | Vercel              | —       | Auto-deploy from GitHub    |

## Folder Structure

```
src/
├── app/
│   ├── (public)/                   # Public marketing site
│   │   ├── layout.tsx              # Landing page nav + footer
│   │   └── page.tsx                # Landing page (ported from index.html)
│   ├── admin/                      # Coach-only area
│   │   ├── layout.tsx              # Admin sidebar layout
│   │   ├── page.tsx                # Dashboard: player list
│   │   └── players/
│   │       ├── new/page.tsx        # Create player form
│   │       └── [id]/
│   │           ├── page.tsx        # Player profile + evaluation history
│   │           ├── edit/page.tsx   # Edit player details
│   │           └── evaluations/
│   │               ├── new/page.tsx          # New evaluation (manual)
│   │               ├── import/page.tsx       # Import evaluation from JSON file
│   │               └── [evalId]/
│   │                   ├── page.tsx          # View/edit evaluation
│   │                   └── share/page.tsx    # Share settings + send to parent
│   ├── report/
│   │   └── [token]/
│   │       ├── page.tsx            # PIN entry gate
│   │       └── view/page.tsx       # Evaluation report (after PIN unlock)
│   ├── login/page.tsx
│   ├── layout.tsx                  # Root layout
│   └── not-found.tsx
├── features/
│   ├── players/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   └── types/
│   ├── evaluations/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   └── types/
│   ├── reports/
│   │   ├── components/             # Parent-facing report UI
│   │   └── hooks/
│   └── notifications/
│       ├── email.ts                # Resend integration
│       ├── sms.ts                  # Twilio integration
│       └── templates/              # Email/SMS message templates
├── components/
│   ├── ui/                         # Button, Card, Badge, Input, Modal...
│   └── layout/                     # AdminNav, PublicNav, Footer
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client singleton
│   │   ├── server.ts               # Server client (RSC + Server Actions)
│   │   └── admin.ts                # Service role client (server-only)
│   ├── query-client.ts
│   └── utils.ts
├── store/                          # Zustand stores
├── constants/
│   └── evaluation-skills.ts        # Skill category definitions
├── hooks/                          # Global hooks
└── proxy.ts                        # Auth guard for /admin/* (Next.js 16 proxy convention)
```

## Key Patterns

### Route Groups

- `(public)` — Marketing site — no auth, can be statically rendered
- `admin/` — Coach access only — guarded by `src/proxy.ts`
- `report/[token]` — Public URL, gated by token + PIN validation

### Data Flow

- **Server Component** → `lib/supabase/server.ts` → Supabase → Postgres
- **Client Component** → TanStack Query hook → repository → `lib/supabase/client.ts`
- **Server Action** → `lib/supabase/server.ts` or `lib/supabase/admin.ts`

### Naming Conventions

| Type            | Convention      | Example               |
| --------------- | --------------- | --------------------- |
| Page            | page.tsx        | app/admin/page.tsx    |
| Component file  | kebab-case.tsx  | player-card.tsx       |
| Hook            | use-\*.ts       | use-player-list.ts    |
| Repository      | \*-repository.ts | player-repository.ts  |
| Component       | PascalCase      | PlayerCard            |
| Constant        | UPPER_SNAKE     | MAX_SKILL_SCORE       |
