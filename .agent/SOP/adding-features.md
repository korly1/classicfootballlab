# Adding Features SOP

## Feature Structure

```
features/[feature]/
├── components/      # UI — only used within this feature
├── hooks/           # TanStack Query hooks
├── repositories/    # All Supabase queries
├── schemas/         # Zod schemas
├── types/           # TypeScript types
└── utils/           # Pure business logic helpers
```

## Step-by-Step

1. Define types in `features/[feature]/types/`
2. Write Zod schema in `features/[feature]/schemas/`
3. Write repository functions in `features/[feature]/repositories/`
   - Always throw on Supabase error, never return null silently
   - Use `lib/supabase/client.ts` for client-side repos
   - Use `lib/supabase/server.ts` for server-side repos and Server Actions
4. Write TanStack Query hooks in `features/[feature]/hooks/`
   - `useQuery` for reads, `useMutation` for writes
   - Always handle `isLoading` and error states
5. Build UI components in `features/[feature]/components/`
   - Mark `'use client'` only when interactivity or browser APIs are needed
6. Wire into the page under `app/`
7. Run: `npm run typecheck && npm run lint`
8. Update `.agent/README.md` and relevant System docs if anything changed

## Code Quality Checklist

- [ ] TypeScript compiles with no errors
- [ ] No `any` types
- [ ] Repository throws on error
- [ ] Hooks handle loading + error states
- [ ] Client Components are marked `'use client'`
- [ ] Server Actions use server or admin supabase client only
