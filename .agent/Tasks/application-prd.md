# Classic Football Lab — Application PRD
## Tasks & User Stories

Place this file at `.agent/Tasks/application-prd.md` in your Cursor project.

---

## How to Use This Document in Cursor

For each feature, open a new Cursor chat and paste this prompt:

```
Read .agent/README.md, then .agent/Tasks/application-prd.md.
I want to implement Feature [N]: [Feature name].
Before writing any code, propose an implementation plan based on the
acceptance criteria in the PRD and the architecture in .agent/System/.
Wait for my approval before starting.
```

Asking for the plan first prevents the agent from going in the wrong direction. Review the plan, push back on anything that looks off, then tell it to proceed.

When a feature is done, tell the agent to update `.agent/README.md` and any relevant System docs if anything changed.

---

## Feature Build Order

| # | Feature |
|---|---------|
| 1 | Project foundation + landing page |
| 2 | Coach authentication |
| 3 | Player management |
| 4 | Evaluation — manual entry |
| 5 | Evaluation — JSON import from Claude |
| 6 | Parent report page |
| 7 | Share + notify parent |
| 8 | Edit evaluation |
| 9 | Player activate / deactivate |

---

## Feature 1 — Project Foundation + Landing Page

Set up the project structure, Supabase connection, Tailwind brand config, and port the existing landing page into the app.

### User Stories

- As a visitor, I can open lab.football and see the full CFL landing page, including all sections (hero, method, positions, FAQ, booking form).
- As a visitor, the page loads fast and works without JavaScript enabled for the static content.
- As Eduardo, the CFL brand colors (navy, gold, green) are available as Tailwind classes throughout the app.

### Acceptance Criteria

| # | Criteria |
|---|----------|
| 1.1 | The existing index.html is ported to `src/app/(public)/page.tsx` as a React component. All sections render correctly in the browser. |
| 1.2 | Tailwind config includes custom colors: navy (#0A1128), gold (#D4A843), green (#1A6B3C). |
| 1.3 | Fonts Bebas Neue and Barlow load via next/font or a link tag in the root layout. |
| 1.4 | The Supabase browser client singleton exists at `src/lib/supabase/client.ts`. |
| 1.5 | The Supabase server client singleton exists at `src/lib/supabase/server.ts`. |
| 1.6 | The Supabase admin client singleton exists at `src/lib/supabase/admin.ts`. It imports `SUPABASE_SERVICE_ROLE_KEY` (no NEXT_PUBLIC_ prefix). |
| 1.7 | `src/constants/evaluation-skills.ts` exists and contains all skill categories and skills exactly as defined in `.agent/System/evaluation-model.md`. |
| 1.8 | `npm run build` passes with no errors. `npm run typecheck` passes with no errors. |

---

## Feature 2 — Coach Authentication

Eduardo and Camila log in with email and password. The admin area is protected. Everyone else is blocked from /admin.

### User Stories

- As Eduardo or Camila, I can go to /login, enter my email and password, and access the admin area.
- As Eduardo or Camila, if I try to access /admin without being logged in, I am redirected to /login.
- As Eduardo or Camila, I can log out from any admin page.
- As anyone who is not Eduardo or Camila, even if I somehow create a Supabase account, I cannot access /admin because I have no row in the coaches table.

### Acceptance Criteria

| # | Criteria |
|---|----------|
| 2.1 | `src/proxy.ts` intercepts all requests to `/admin/*`. If there is no valid Supabase session, it redirects to /login. |
| 2.2 | After session check, proxy queries `public.coaches` for a row matching the session user id. If no row exists, it redirects to /login. |
| 2.3 | The login page at /login has email and password fields and a submit button. On success it redirects to /admin. |
| 2.4 | On failed login, the form shows an error message. It does not reveal whether the email exists. |
| 2.5 | A logout button in the admin nav calls `supabase.auth.signOut()` and redirects to /. |
| 2.6 | The admin layout shows the coach's name in the nav (fetched from `public.coaches`). |
| 2.7 | Visiting /login while already logged in redirects to /admin. |

> **Setup note:** Eduardo and Camila's accounts are created once via the Supabase dashboard. A row in `public.coaches` is inserted manually for each. This is a one-time setup, not a feature to build.

---

## Feature 3 — Player Management

Create, view, edit, deactivate, and reactivate players. When a player is created, their share token is generated automatically and their report page exists immediately — even with no evaluations yet.

### User Stories

- As Eduardo or Camila, I can see a list of all active players on the admin dashboard.
- As Eduardo or Camila, I can create a new player with their full details.
- As Eduardo or Camila, when I create a player, a permanent share link is generated automatically.
- As Eduardo or Camila, I can open a player's profile and see all their details and evaluation history.
- As Eduardo or Camila, I can edit a player's details at any time.
- As Eduardo or Camila, I can deactivate a player. They disappear from the active list but their data is not deleted.
- As Eduardo or Camila, I can view deactivated players in a separate list and reactivate them.

### Player Fields

| Field | Notes |
|-------|-------|
| full_name | Required. Text. |
| birth_year | Optional. Four-digit year. Used to show approximate age. |
| club | Optional. The team the player plays for (e.g. 'Santa Clarita Soccer Club'). |
| level | Optional. Free text (e.g. 'Flight 1', 'Recreational', 'Travel'). |
| parent_name | Optional. Text. |
| parent_phone | Optional. Phone number. Used for SMS notifications. |
| parent_email | Optional. Email address. Used for email notifications. |
| notes | Optional. Internal notes visible only to coaches. Never shown to parents. |
| is_active | Boolean. Defaults to true. False = deactivated. |
| share_token | Auto-generated by the database on insert. Never editable manually. |

### Acceptance Criteria

| # | Criteria |
|---|----------|
| 3.1 | The admin dashboard at /admin lists all players where `is_active = true`, ordered by full_name. |
| 3.2 | Each player row shows: full_name, club, level, and a link to their profile. |
| 3.3 | The dashboard has a 'New Player' button that goes to /admin/players/new. |
| 3.4 | The new player form validates required fields (full_name) before submitting. All other fields are optional. |
| 3.5 | On save, the player row is inserted. The database auto-generates share_token. The coach is redirected to the player profile. |
| 3.6 | The player profile at `/admin/players/[id]` shows all fields, the share link, and the evaluation history list (empty state if no evaluations). |
| 3.7 | The empty evaluation state says: 'No evaluations yet. Create the first one to get started.' with a 'New Evaluation' button. |
| 3.8 | The player profile has an 'Edit' button that goes to `/admin/players/[id]/edit`. |
| 3.9 | The edit form is pre-filled with current values. Saving updates the row and redirects back to the player profile. |
| 3.10 | The player profile has a 'Deactivate Player' button. On confirmation, `is_active` is set to false. The coach is redirected to /admin. |
| 3.11 | The admin dashboard has a toggle to show deactivated players. Each deactivated player has a 'Reactivate' button. |
| 3.12 | The share link displayed on the player profile is the full URL: `https://lab.football/report/[token]`. |

---

## Feature 4 — Evaluation: Manual Entry

Eduardo or Camila fills in an evaluation directly in the admin form. All skill categories are shown. Scores and notes are optional per skill. The evaluation saves as a draft until the coach publishes it.

### User Stories

- As Eduardo or Camila, I can open a player's profile and click 'New Evaluation' to start a new evaluation.
- As Eduardo or Camila, I can see all skill categories and skills in the form, enter a score (1-10) for each skill I observed, and add mechanics notes.
- As Eduardo or Camila, I can mark any skill as 'Focus for next session'.
- As Eduardo or Camila, I can write overall session notes and a development plan.
- As Eduardo or Camila, the evaluation saves as a draft. The parent cannot see it until I publish it.
- As Eduardo or Camila, after saving, I am prompted to share the evaluation with the parent.

### Acceptance Criteria

| # | Criteria |
|---|----------|
| 4.1 | The new evaluation form at `/admin/players/[id]/evaluations/new` shows all categories and skills from `constants/evaluation-skills.ts`. |
| 4.2 | Each skill row has: a score input (1-10 or blank = not evaluated), a mechanics notes text area, and a 'Focus next session' toggle. |
| 4.3 | The form has a session date field (defaults to today) and a session number field (defaults to last session number + 1, or 1 if first). |
| 4.4 | The form has an 'Overall Notes' text area and a 'Development Plan' text area. |
| 4.5 | Saving creates one evaluation row (`is_published = false`) and one evaluation_item row per skill that has a score or notes entered. Skills with no score and no notes are not saved. |
| 4.6 | After saving, a share prompt modal appears: 'This evaluation is ready. Share it with the parent?' (see Feature 7 for full share flow). |
| 4.7 | If the coach dismisses the share prompt, a yellow banner reads: 'This evaluation has not been shared yet.' with a 'Share with parent' button. |
| 4.8 | Score inputs only accept integers 1-10. Entering 0 or 11 shows a validation error. |
| 4.9 | The form can be saved even if no scores are entered (all fields optional except session_date). |

---

## Feature 5 — Evaluation: JSON Import from Claude

Eduardo generates an evaluation in Claude, exports it as a JSON file, and uploads it in the admin. The app parses it, validates it, shows a preview, and the coach confirms before saving.

### User Stories

- As Eduardo or Camila, I can go to a player's profile and click 'Import from file' to upload a Claude-generated evaluation.
- As Eduardo or Camila, after uploading the file, I see a preview of the evaluation before it is saved.
- As Eduardo or Camila, if the file has errors, I see clear error messages that tell me exactly what is wrong.
- As Eduardo or Camila, I can edit any field in the preview before confirming.
- As Eduardo or Camila, after confirming, the evaluation is saved as a draft and I am prompted to share it with the parent.

### JSON Format

This is the exact schema Claude produces. The app validates against this with Zod.

```json
{
  "player": "Bianca",
  "session_date": "2026-03-30",
  "session_number": 3,
  "overall_notes": "Good energy today.",
  "development_plan": "Focus next session on standing leg position.",
  "items": [
    {
      "category": "Passing",
      "skill": "Short passes",
      "score": 7,
      "mechanics_notes": "Hip rotation improving.",
      "focus_next": false
    },
    {
      "category": "Shooting",
      "skill": "Power shots",
      "score": 6,
      "mechanics_notes": "Standing leg too close to ball.",
      "focus_next": true
    }
  ]
}
```

### Validation Rules

- `player` must match an existing player's full_name in the database (case-insensitive).
- `session_date` must be a valid ISO date (YYYY-MM-DD).
- `score` must be an integer between 1 and 10, or omitted entirely.
- `category` and `skill` must match values in `constants/evaluation-skills.ts` exactly.
- `focus_next` defaults to false if omitted.
- `overall_notes` and `development_plan` are optional.

### Acceptance Criteria

| # | Criteria |
|---|----------|
| 5.1 | The import page at `/admin/players/[id]/evaluations/import` has a file upload input that accepts .json files only. |
| 5.2 | After upload, the file is parsed and validated with Zod. If validation passes, a preview is shown. If it fails, all errors are listed clearly. |
| 5.3 | The preview shows: session date, session number, overall notes, development plan, and a table of all skills with score, mechanics notes, and focus_next. |
| 5.4 | Every field in the preview is editable inline before confirming. |
| 5.5 | Confirming saves the evaluation as a draft (`is_published = false`) and triggers the share prompt modal (Feature 7). |
| 5.6 | If the player field in the JSON does not match the current player's profile, a warning is shown with a confirm option. |
| 5.7 | The import page has a link to cancel and go back to the player profile. |

---

## Feature 6 — Parent Report Page

The parent-facing page at `/report/[token]`. No account needed. Protected by PIN. Always shows the most recent published evaluation for that player.

### User Stories

- As a parent, I can open the link Eduardo sent me and see a PIN entry screen.
- As a parent, I enter my PIN and see my child's latest evaluation report.
- As a parent, the report is clearly designed and easy to read.
- As a parent, if no evaluation has been published yet, I see a message telling me the first evaluation is coming.
- As a parent, if I enter the wrong PIN, I see a clear error message.

### PIN Gate

| # | Criteria |
|---|----------|
| 6.1 | The page at `/report/[token]` shows a PIN entry form. It does not reveal the player name before the PIN is entered. |
| 6.2 | On submit, a Server Action fetches the player by share_token using adminClient. It bcrypt-compares the entered PIN against `players.share_pin`. |
| 6.3 | If the PIN is correct and `share_enabled = true`, a session cookie is set and the user is redirected to `/report/[token]/view`. |
| 6.4 | If the PIN is wrong, the form shows: 'Incorrect PIN. Please try again.' |
| 6.5 | If `share_enabled = false`, the page shows: 'This report is not currently available.' No PIN form is shown. |
| 6.6 | The PIN cookie expires after 30 days. |

### Report View

| # | Criteria |
|---|----------|
| 6.7 | The report page at `/report/[token]/view` checks the session cookie. If invalid or expired, it redirects back to `/report/[token]`. |
| 6.8 | The page fetches the player and their most recent evaluation where `is_published = true`. |
| 6.9 | If no published evaluation exists, the page shows the player's name and 'Your first evaluation is on its way.' with the CFL logo. |
| 6.10 | If a published evaluation exists, the report shows: player name, position/level, session date, session number, overall notes, development plan, all scored skills grouped by category with scores and mechanics notes, and focus areas highlighted. |
| 6.11 | Focus areas (`focus_next = true`) are visually distinct — a badge or highlight. |
| 6.12 | The report uses CFL branding: dark navy background, gold accents, green highlights, Bebas Neue for headings, Barlow for body text. |
| 6.13 | Skills with no score show as 'Not evaluated this session'. |
| 6.14 | The page has no edit controls, no coach UI, no links to the admin area. |
| 6.15 | The page is mobile-friendly. Parents will view it on their phones. |

---

## Feature 7 — Share + Notify Parent

After creating or updating an evaluation, the coach is prompted to notify the parent. Notifications go via email (Resend), SMS (Twilio), clipboard, or all three. Every send is logged.

### User Stories

- As Eduardo or Camila, after saving a new evaluation, I am automatically prompted to share it with the parent.
- As Eduardo or Camila, after editing a published evaluation, I am prompted to notify the parent that it was updated.
- As Eduardo or Camila, I can send the notification by email, SMS, clipboard, or all at once.
- As Eduardo or Camila, I can skip the prompt and share later from the evaluation page.
- As Eduardo or Camila, I can always see what notifications were sent to a parent and when.

### Share Prompt Modal

| # | Criteria |
|---|----------|
| 7.1 | The share prompt modal appears automatically after saving a new evaluation and after saving edits to a published evaluation. |
| 7.2 | The modal shows checkboxes for each available channel. Email shown only if parent_email exists. SMS shown only if parent_phone exists. Clipboard always shown. |
| 7.3 | Channels with contact info available are pre-checked by default. |
| 7.4 | The modal shows a preview of the message that will be sent for each checked channel. |
| 7.5 | Clicking 'Send' sets `is_published = true`, sends email via Resend (if checked), sends SMS via Twilio (if checked), and logs each send to notification_log. |
| 7.6 | After sending, the modal shows a confirmation summary of what was delivered. |
| 7.7 | Clicking 'Skip for now' closes the modal. A yellow banner appears: 'Not shared yet — Share with parent'. |

### PIN Setup (First Time)

| # | Criteria |
|---|----------|
| 7.8 | If `players.share_pin` is null when the coach tries to share, the modal shows a PIN setup step first. Input accepts 4-6 digits. |
| 7.9 | The PIN is bcrypt-hashed before saving to `players.share_pin`. The plain-text PIN is shown once in the notification message and never stored. |
| 7.10 | If a PIN is already set, the coach can reset it from the player profile. |

### Notification Log

| # | Criteria |
|---|----------|
| 7.11 | The player profile shows a 'Notification History' section: date, channel, recipient, and status for every send. |
| 7.12 | Every send (success or failure) is written to notification_log. Failed sends show a 'Failed' status. |

### Message Content

| Channel | Message |
|---------|---------|
| Email subject | [Player name]'s CFL Evaluation — [Month YYYY] |
| Email body | Hi [parent_name], [player_name]'s latest evaluation from [session_date] is ready. View it at: lab.football/report/[token] — PIN: [pin]. — Classic Football Lab |
| SMS | CFL: [player_name]'s evaluation is ready. lab.football/report/[token] PIN: [pin] |
| Clipboard | Full URL copied: https://lab.football/report/[token] |

---

## Feature 8 — Edit Evaluation

Eduardo or Camila can edit any evaluation after it is created. Editing a published evaluation triggers the share prompt to notify the parent of the update.

### User Stories

- As Eduardo or Camila, I can open any evaluation and edit any field.
- As Eduardo or Camila, if I edit a published evaluation, I am prompted to notify the parent.
- As Eduardo or Camila, I can add scores or notes to skills not included in the original evaluation.
- As Eduardo or Camila, I can publish a draft evaluation from the evaluation page.

### Acceptance Criteria

| # | Criteria |
|---|----------|
| 8.1 | The evaluation detail page at `/admin/players/[id]/evaluations/[evalId]` has an 'Edit' button. |
| 8.2 | The edit form is pre-filled with all existing values. Skill rows with no existing data show blank inputs. |
| 8.3 | Saving updates the evaluation row and all evaluation_item rows. New items are inserted. Existing items are updated. Items fully cleared are deleted. |
| 8.4 | If `is_published = true` when saving edits, the share prompt modal appears with the label 'Notify parent of update?' |
| 8.5 | If `is_published = false` when saving edits, no share prompt appears. The yellow banner stays. |
| 8.6 | A 'Publish' button is available on draft evaluation pages. Clicking it sets `is_published = true` and opens the share prompt. |
| 8.7 | Saving edits updates `evaluations.updated_at`. The evaluation detail page shows the last updated timestamp. |

---

## Feature 9 — Player Activate / Deactivate

Players are never deleted. Deactivating removes them from the active view but preserves all data.

### User Stories

- As Eduardo or Camila, I can deactivate a player who is no longer training with CFL. Their data and evaluation history are preserved.
- As Eduardo or Camila, deactivated players do not appear in my main player list.
- As Eduardo or Camila, I can reactivate a player if they return to training.
- As a parent, if my child's profile is deactivated, their report link still works and shows the last published evaluation.

### Acceptance Criteria

| # | Criteria |
|---|----------|
| 9.1 | The admin dashboard shows only active players (`is_active = true`) by default. |
| 9.2 | A 'Show inactive players' toggle reveals deactivated players in a separate section. |
| 9.3 | The player profile has a 'Deactivate' button with a confirmation dialog. |
| 9.4 | Confirming sets `is_active = false` and redirects to /admin. |
| 9.5 | Deactivated players have a 'Reactivate' button on their profile. |
| 9.6 | The parent report page continues to work for deactivated players as long as `share_enabled = true`. |
| 9.7 | No player data or evaluation data is ever deleted through this feature. |

---

## Appendix — Evaluation JSON Schema (Zod)

Place this at: `src/features/evaluations/schemas/evaluation-import-schema.ts`

```typescript
import { z } from 'zod'
import { SKILL_CATEGORIES } from '@/constants/evaluation-skills'

const validSkills = SKILL_CATEGORIES.flatMap(cat =>
  cat.skills.map(skill => ({ category: cat.category, skill }))
)

const EvaluationItemSchema = z.object({
  category: z.string(),
  skill: z.string(),
  score: z.number().int().min(1).max(10).optional(),
  mechanics_notes: z.string().optional(),
  focus_next: z.boolean().default(false),
}).refine(item => validSkills.some(
  s => s.category === item.category && s.skill === item.skill
), {
  message: 'Unknown skill combination',
})

export const EvaluationImportSchema = z.object({
  player: z.string().min(1),
  session_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  session_number: z.number().int().positive(),
  overall_notes: z.string().optional(),
  development_plan: z.string().optional(),
  items: z.array(EvaluationItemSchema).min(1),
})

export type EvaluationImport = z.infer<typeof EvaluationImportSchema>
```