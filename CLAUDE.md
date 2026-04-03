# DOCS

All project docs live in the `.agent` folder.

## .agent/

- **Tasks**: PRD & implementation plan for each feature
- **System**: Current state of the system (stack, DB schema, auth, data models)
- **SOP**: Best practices for specific recurring tasks
- **README.md**: Index of all documentation

## Guidelines

Always update `.agent` docs after implementing a feature.

Before planning any implementation, always read `.agent/README.md` first.

## Project-Specific Rules

- Next.js 16 App Router only — never use the Pages Router
- Never use index.ts barrel files to re-export components
- Never auto-run `npm run dev` without being asked
- Never hardcode secrets — use .env.local and Vercel environment variables
- All Supabase calls use the typed client generated from the database schema
- The public landing page at `/` never requires authentication
- The admin area at `/admin/*` requires the coach role (Eduardo or Camila only)
- Player report pages at `/report/[token]` require no login — secured by an unguessable token + a PIN set by the coach
- Never use `any` as a TypeScript type
- Always run `npm run typecheck` and `npm run lint` before marking a task done
- The SUPABASE_SERVICE_ROLE_KEY must never be imported in a Client Component
