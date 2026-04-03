# Development Workflow SOP

## Prerequisites

- Node.js 20.9+
- Supabase CLI: `brew install supabase/tap/supabase`
- Vercel CLI: `npm i -g vercel` (optional)

## First-Time Setup

```bash
git clone [repo-url]
cd cfl-web
npm install
npx supabase start
npx supabase db reset
npx supabase gen types typescript --local > src/lib/supabase/database.types.ts
cp .env.example .env.local      # Fill in all values
npm run dev
```

## Daily Commands

```bash
npm run dev              # Next.js dev server (localhost:3000)
npx supabase start       # Local Supabase stack
npx supabase studio      # Supabase Studio (localhost:54323)
```

## All Commands

| Command                                                           | Description        |
| ----------------------------------------------------------------- | ------------------ |
| `npm run dev`                                                     | Dev server         |
| `npm run build`                                                   | Production build   |
| `npm run typecheck`                                               | TS check (no emit) |
| `npm run lint`                                                    | ESLint             |
| `npx supabase start`                                              | Start local stack  |
| `npx supabase stop`                                               | Stop local stack   |
| `npx supabase db push`                                            | Push to remote DB  |
| `npx supabase db reset`                                           | Reset local DB     |
| `npx supabase migration new [name]`                               | New migration      |
| `npx supabase gen types typescript --local > src/lib/supabase/...` | Regenerate types   |

## Vercel Deploy

`main` branch auto-deploys to production. Feature branches auto-deploy as preview URLs.

Environment variables set in Vercel dashboard (not in code):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`
- `NEXT_PUBLIC_APP_URL=https://lab.football`

## Git Workflow

- `feat/player-management`
- `feat/evaluation-import`
- `feat/parent-report-view`
- `feat/share-notifications`
- `fix/pin-validation`

## Before Committing

```bash
npm run typecheck
npm run lint
```

## Troubleshooting

| Problem                 | Solution                                       |
| ----------------------- | ---------------------------------------------- |
| Types out of date       | Re-run gen types command                       |
| `/admin` redirect loop  | Check `coaches` table has row for user's auth id |
| PIN not working         | Check `share_enabled = true` on player row     |
| Resend not sending      | Verify domain DNS in Resend dashboard          |
| Twilio SMS failing      | Check phone number format (+1xxxxxxxxxx)       |
| Build fails on Vercel   | Run `npm run build` locally first              |
