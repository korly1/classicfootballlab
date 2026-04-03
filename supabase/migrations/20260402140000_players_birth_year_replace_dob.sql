-- Upgrade path: date_of_birth (date) -> birth_year (integer)
-- No-op when initial_schema already created birth_year only.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'players'
      and column_name = 'date_of_birth'
  ) then
    alter table public.players add column birth_year integer;
    update public.players
    set birth_year = extract(year from date_of_birth)::integer
    where date_of_birth is not null;
    alter table public.players drop column date_of_birth;
  end if;
end $$;

alter table public.players drop constraint if exists players_birth_year_reasonable;

alter table public.players
  add constraint players_birth_year_reasonable check (
    birth_year is null
    or (
      birth_year >= 1990
      and birth_year <= (extract(year from current_date)::integer + 1)
    )
  );
