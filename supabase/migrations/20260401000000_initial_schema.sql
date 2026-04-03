-- Classic Football Lab — initial schema
-- Source of truth: .agent/System/database-schema.md

-- coaches: one row per coach; id = auth.users.id
create table public.coaches (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  email       text not null,
  created_at  timestamptz default now()
);

alter table public.coaches enable row level security;

create policy "Coaches read own row"
  on public.coaches for select using (auth.uid() = id);

-- players: belongs to a coach; share link lives on the player row
create table public.players (
  id              uuid primary key default gen_random_uuid(),
  coach_id        uuid not null references public.coaches(id) on delete cascade,
  full_name       text not null,
  birth_year      integer
    constraint players_birth_year_reasonable check (
      birth_year is null
      or (
        birth_year >= 1990
        and birth_year <= (extract(year from current_date)::integer + 1)
      )
    ),
  club            text,
  level           text,         -- e.g. 'Flight 1', 'Recreational'
  parent_name     text,
  parent_phone    text,
  parent_email    text,
  is_active       boolean not null default true,
  share_token     text unique default gen_random_uuid()::text,
  share_pin       text,         -- bcrypt hash of the 4-6 digit PIN
  share_enabled   boolean not null default false,
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.players enable row level security;

create policy "Coaches manage own players"
  on public.players for all using (coach_id = auth.uid());

-- evaluations: one row per session
create table public.evaluations (
  id               uuid primary key default gen_random_uuid(),
  player_id        uuid not null references public.players(id) on delete cascade,
  coach_id         uuid not null references public.coaches(id),
  session_date     date not null default current_date,
  session_number   integer not null default 1,
  overall_notes    text,
  development_plan text,
  is_published     boolean not null default false,  -- true = parent can see it
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table public.evaluations enable row level security;

create policy "Coaches manage own evaluations"
  on public.evaluations for all using (coach_id = auth.uid());

-- evaluation_items: one row per skill scored
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

-- notification_log: audit trail for email / SMS / clipboard
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
