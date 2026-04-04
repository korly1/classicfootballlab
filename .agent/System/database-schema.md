# Database Schema

## Applying migrations (remote)

With the Supabase project linked (`npx supabase link`), push pending SQL migrations to the hosted database:

```bash
npx supabase db push
```

If the app errors on a missing column (e.g. `rich_report` on `evaluations`), the remote DB is usually behind the repo; run the command above or execute the SQL in `supabase/migrations/` from the Dashboard SQL editor.

## Regenerating Types

Run after any schema change:

```bash
npx supabase gen types typescript --local > src/lib/supabase/database.types.ts
```

## Tables

### coaches

One row per coach. Eduardo and Camila each have a row. Linked to `auth.users` — the Supabase auth user id IS the coach id. Adding a new coach = create a Supabase auth user, insert a row here. No code change.

```sql
create table public.coaches (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  email       text not null,
  created_at  timestamptz default now()
);

alter table public.coaches enable row level security;

create policy "Coaches read own row"
  on public.coaches for select using (auth.uid() = id);
```

### players

One row per player. Belongs to a coach.

```sql
create table public.players (
  id              uuid primary key default gen_random_uuid(),
  coach_id        uuid not null references public.coaches(id) on delete cascade,
  full_name       text not null,
  birth_year      integer,  -- optional; check: 1990 .. current calendar year + 1
  club            text,
  level           text,         -- e.g. 'Flight 1', 'Recreational'
  parent_name     text,
  parent_phone    text,
  parent_email    text,
  is_active       boolean not null default true,
  share_token     text unique default gen_random_uuid()::text,
  share_pin       text,         -- bcrypt hash of the app-generated 6-digit PIN (set when share_enabled turns on)
  share_enabled   boolean not null default false,
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.players enable row level security;

create policy "Coaches manage own players"
  on public.players for all using (coach_id = auth.uid());
```

Note: `share_token` and `share_pin` live on the player, not the evaluation. This gives parents a permanent link to their player's page, which always shows the latest evaluation. The link never changes unless Eduardo regenerates it.

### evaluations

One row per session. A player can have many evaluations over time.

```sql
create table public.evaluations (
  id               uuid primary key default gen_random_uuid(),
  player_id        uuid not null references public.players(id) on delete cascade,
  coach_id         uuid not null references public.coaches(id),
  session_date     date not null default current_date,
  session_number   integer not null default 1,
  overall_notes    text,
  development_plan text,
  rich_report      jsonb,  -- optional v1 structured report (see rich-report-schema.ts)
  is_published     boolean not null default false,  -- true = parent can see it
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table public.evaluations enable row level security;

create policy "Coaches manage own evaluations"
  on public.evaluations for all using (coach_id = auth.uid());
```

**Time convention:** `session_date` is a **Pacific (Los Angeles) civil calendar day** — coaches enter and read it as PT; the app stores the `YYYY-MM-DD` string in Postgres `date` with no UTC offset math. `created_at` / `updated_at` are `timestamptz` (UTC in Postgres); the UI formats those instants in Pacific via `formatPacificDateTime` in [`src/lib/format-calendar-date.ts`](../../src/lib/format-calendar-date.ts).

### evaluation_items

One row per skill scored within an evaluation.

```sql
create table public.evaluation_items (
  id               uuid primary key default gen_random_uuid(),
  evaluation_id    uuid not null references public.evaluations(id) on delete cascade,
  category         text not null,
  skill            text not null,
  score            integer check (score between 1 and 10),
  mechanics_notes  text,
  focus_next       boolean not null default false,
  created_at       timestamptz default now()
);

alter table public.evaluation_items enable row level security;

create policy "Coaches manage own items"
  on public.evaluation_items for all
  using (
    evaluation_id in (
      select id from public.evaluations where coach_id = auth.uid()
    )
  );
```

### notification_log

Audit trail for every email and SMS sent to parents.

```sql
create table public.notification_log (
  id             uuid primary key default gen_random_uuid(),
  player_id      uuid not null references public.players(id) on delete cascade,
  evaluation_id  uuid references public.evaluations(id) on delete set null,
  coach_id       uuid not null references public.coaches(id),
  channel        text not null check (channel in ('email', 'sms', 'clipboard')),
  recipient      text not null,   -- email address or phone number
  status         text not null default 'sent',
  sent_at        timestamptz default now()
);

alter table public.notification_log enable row level security;

create policy "Coaches read own notification log"
  on public.notification_log for all using (coach_id = auth.uid());
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server only — never NEXT_PUBLIC_
RESEND_API_KEY=your-resend-api-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_FROM_NUMBER=+1xxxxxxxxxx
NEXT_PUBLIC_APP_URL=https://lab.football
```
