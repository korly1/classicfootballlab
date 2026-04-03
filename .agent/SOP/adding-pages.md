# Adding Pages SOP

## Route Reference

| File                                        | URL                         | Auth     |
| ------------------------------------------- | --------------------------- | -------- |
| `src/app/(public)/page.tsx`                 | `/`                         | None     |
| `src/app/login/page.tsx`                    | `/login`                    | None     |
| `src/app/admin/page.tsx`                    | `/admin`                    | Coach    |
| `src/app/admin/players/new/page.tsx`          | `/admin/players/new`        | Coach    |
| `src/app/admin/players/[id]/page.tsx`       | `/admin/players/:id`        | Coach    |
| `src/app/admin/players/[id]/edit/page.tsx`    | `/admin/players/:id/edit`   | Coach    |
| `src/app/admin/players/[id]/evaluations/...`  | `/admin/players/:id/evals/..` | Coach    |
| `src/app/report/[token]/page.tsx`           | `/report/:token`            | PIN only |
| `src/app/report/[token]/view/page.tsx`      | `/report/:token/view`       | PIN only |

## Adding an Admin Page

1. Create `src/app/admin/[your-route]/page.tsx`
2. Fetch data using `lib/supabase/server.ts` (Server Component)
3. Add a link to it in `components/layout/admin-nav.tsx`
4. Middleware already guards `/admin/*` — no extra auth check needed in the page (add a secondary redirect as a fallback if you want belt-and-suspenders)

## Adding a Public Page

1. Create `src/app/(public)/[your-route]/page.tsx`
2. No auth needed — shares the public layout (nav + footer)

## Page Checklist

- [ ] Default export is the page component
- [ ] Uses Server Component for data fetching where possible
- [ ] Loading + error states handled
- [ ] Added to `.agent/System/project-architecture.md` route table
