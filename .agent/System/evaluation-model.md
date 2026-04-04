# Evaluation Model

## Overview

An evaluation is a snapshot of a player's technical development at a point in time. Coaches create one per session. Parents see it on their player's report page. Multiple evaluations build a history that shows progress over time.

## Data Hierarchy

```
Player
└── Evaluations[] (one per session, ordered by session_number desc)
    ├── session_date, session_number, overall_notes, development_plan
    ├── rich_report   (optional JSON v1 — HTML-style report: stages, mechanics, charts)
    ├── is_published  (false = draft, true = visible to parent)
    └── EvaluationItems[]
        ├── category        (e.g. 'Passing')
        ├── skill           (e.g. 'Short passes')
        ├── score           (1-10, or null if not evaluated this session)
        ├── mechanics_notes (coach's observation for this skill)
        └── focus_next      (true = flagged as focus for next session)
```

## Parent Report Page

- `/report/[token]` — PIN entry; on success sets an httpOnly cookie and redirects to `/report/[token]/view`.
- `/report/[token]/view` — Requires cookie matching the token. Loads the player by `share_token` (service role on server). Shows the latest evaluation where `is_published = true`.
- If `rich_report` is set, the **rich report layout** is used (coach note, overview stats, snapshot, technique bars, technical tree, pending).
- Otherwise the page shows **flat** session notes + `evaluation_items` (1–10 scores).
- If no published evaluation exists yet: empty state with player name and “Your first evaluation is on its way.”

## Creating Evaluations — Two Paths

### Path A: Manual entry in the admin form

Coach opens a player, clicks "New Evaluation", fills in the form. All skill categories are shown. Coach enters scores and notes per skill. Scores are optional — unscored skills show as "not evaluated".

**Implementation:** [`/admin/players/[id]/evaluations/new`](../../src/app/admin/players/[id]/evaluations/new/page.tsx) — Zod schema in [`src/features/evaluations/schemas/manual-evaluation-schema.ts`](../../src/features/evaluations/schemas/manual-evaluation-schema.ts), server action [`createManualEvaluation`](../../src/features/evaluations/actions.ts). Saving inserts a draft evaluation and sparse `evaluation_items`; redirect to the evaluation detail page opens the share prompt (full notification flow is Feature 7).

### Path B: Import from Claude-generated JSON file

Coach uploads a `.json` file at [`/admin/players/[id]/evaluations/import`](../../src/app/admin/players/[id]/evaluations/import/page.tsx). Validation uses [`evaluation-import-schema.ts`](../../src/features/evaluations/schemas/evaluation-import-schema.ts).

- **Rich import** (`rich_report` present): preview via [`RichEvaluationReport`](../../src/features/evaluations/components/rich-evaluation-report.tsx); save calls [`createImportedEvaluation`](../../src/features/evaluations/actions.ts), which persists `rich_report` and any optional flat `items` as `evaluation_items`.
- **Grid-only import** (no `rich_report`): editable manual form + [`createManualEvaluation`](../../src/features/evaluations/actions.ts) as before.

If the JSON `player` string does not match the profile’s `full_name`, the coach must acknowledge before preview/save.

**Prompt + template:** [`SOP/claude-evaluation-export.md`](../SOP/claude-evaluation-export.md), [`public/evaluation-import-rich-v1.template.json`](../../public/evaluation-import-rich-v1.template.json) (see [`evaluation-import-rich-v1.template.README.txt`](../../public/evaluation-import-rich-v1.template.README.txt) for pointer to full example). Gold standard JSON: [`src/features/evaluations/__fixtures__/bianca_rich_v1.import.json`](../../src/features/evaluations/__fixtures__/bianca_rich_v1.import.json). Validate fixture: `npm run validate-fixture`.

**Schema:** [`rich-report-schema.ts`](../../src/features/evaluations/schemas/rich-report-schema.ts) (`version: 1`).

## JSON Import Format

Root object: see [`evaluation-import-schema.ts`](../../src/features/evaluations/schemas/evaluation-import-schema.ts). You must provide at least one of: **`rich_report`**, **non-empty `items`**, or **session text** (`overall_notes` / `development_plan`).

**Flat `items` example** (canonical grid only):

```json
{
  "player": "Bianca",
  "session_date": "2026-03-30",
  "session_number": 3,
  "overall_notes": "Good energy today. Responded well to feedback on hip rotation.",
  "development_plan": "Focus next two sessions on standing leg position in power shots.",
  "items": [
    {
      "category": "Passing",
      "skill": "Short passes",
      "score": 7,
      "mechanics_notes": "Hip rotation cleaner. Still collapsing left shoulder on driven passes.",
      "focus_next": false
    }
  ]
}
```

**Rich report:** add optional `"rich_report": { "version": 1, ... }` per [`rich-report-schema.ts`](../../src/features/evaluations/schemas/rich-report-schema.ts). See template under `public/evaluation-import-rich-v1.template.json`.

Rules:

- `player` should match the player profile you are importing for (matched to `full_name` on the import page; mismatch requires explicit acknowledgment)
- `session_date` is ISO 8601 (YYYY-MM-DD)
- `session_number` is a positive integer
- `score` in `items` may be 1–10, `null`, or omitted
- `focus_next` defaults to false if omitted
- `items` may be a subset — not every skill needs to appear in every session
- `category` and `skill` in `items` must match `constants/evaluation-skills.ts` exactly
- Technique/mechanic names inside `rich_report` are free text

## Skill Categories (`constants/evaluation-skills.ts`)

```ts
export const SKILL_CATEGORIES = [
  {
    category: 'Passing',
    skills: [
      'Short passes',
      'Long ground passes',
      'Lob passes',
      'Crossing (stationary)',
      'Crossing (running)'
    ]
  },
  {
    category: 'Ball Control',
    skills: ['Controlling the ball', 'Juggling', 'Soft touches']
  },
  {
    category: 'Shooting',
    skills: [
      'Power shots',
      'Finesse shots',
      'Stationary shooting',
      'On-the-move shooting'
    ]
  },
  {
    category: 'Balance & Movement',
    skills: ['Upper body balance', 'Arm usage', 'Scanning']
  },
  {
    category: 'Finishing',
    skills: ['One-touch finishes', 'Finishing from crosses', 'Control and finish']
  },
  {
    category: 'Ball Protection',
    skills: ['Shielding', 'Body positioning']
  },
  {
    category: 'Ball Recovery',
    skills: ['Tackling timing', 'Pressing angle']
  }
]
```

## Admin Workflow for a New Evaluation

1. Coach opens a player profile
2. Clicks "New Evaluation" (manual) or "Import from file" (JSON)
3. Fills in or reviews/edits the evaluation
4. Saves as draft (`is_published = false`) — parent cannot see it yet
5. App prompts: "This evaluation is ready. Share with parent?"
6. Coach confirms → evaluation is published + notification sent to parent (or coach dismisses the prompt and publishes manually later)
