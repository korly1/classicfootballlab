-- Rich HTML-style evaluation payload (import + parent report rendering)
alter table public.evaluations
  add column rich_report jsonb;

comment on column public.evaluations.rich_report is
  'Optional v1 structured report (coach note, mechanics, stages). See rich-report-schema.ts';
