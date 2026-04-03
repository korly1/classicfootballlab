# CLAUDE.md — App Directory

Classic Football Lab — Next.js 16 App Router. Hosted on Vercel. Backend is Supabase.

## Commands

- `npm run dev` — localhost:3000
- `npm run build` — Production build
- `npm run typecheck` — TS check
- `npm run lint` — ESLint

## Three Areas

1. `(public)/` — Public landing page — no auth
2. `admin/` — Coach portal — Eduardo and Camila only (`/login` + `src/proxy.ts` guard)
3. `report/[token]/` — Parent report — token + PIN, no login

## Supabase Clients

**Browser (Client Components):**

```ts
import { createClient } from '@/lib/supabase/client'
```

**Server (Server Components + Server Actions):**

```ts
import { createClient } from '@/lib/supabase/server'
```

**Admin — bypasses RLS (Server Actions only, NEVER in Client Components):**

```ts
import { createAdminClient } from '@/lib/supabase/admin'
```

## Brand Colors (in `globals.css` / `@theme`)

- navy: `#0A1128`
- gold: `#D4A843`
- green: `#1A6B3C`

## Hard Rules

- App Router only — never use Pages Router
- Mark `'use client'` only when interactivity or browser APIs are needed
- Never use `any` as a TypeScript type
- Never create a new Supabase client — use the three singletons above
- Never import admin client in a Client Component
- Landing page must work without JavaScript (progressive enhancement)
- The `SUPABASE_SERVICE_ROLE_KEY` must never appear in client-side code
