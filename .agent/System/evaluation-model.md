# Evaluation Model

## Overview

An evaluation is a snapshot of a player's technical development at a point in time. Coaches create one per session. Parents see it on their player's report page. Multiple evaluations build a history that shows progress over time.

## Data Hierarchy

```
Player
└── Evaluations[] (one per session, ordered by session_number desc)
    ├── session_date, session_number, overall_notes, development_plan
    ├── is_published  (false = draft, true = visible to parent)
    └── EvaluationItems[]
        ├── category        (e.g. 'Passing')
        ├── skill           (e.g. 'Short passes')
        ├── score           (1-10, or null if not evaluated this session)
        ├── mechanics_notes (coach's observation for this skill)
        └── focus_next      (true = flagged as focus for next session)
```

## Parent Report Page

The page at `/report/[token]` always shows:

- The player's most recent evaluation where `is_published = true`
- If no published evaluation exists yet, it shows an empty state: player name, date profile created, "Your first evaluation is coming soon."
- CFL branding (dark navy, gold, green — matching the landing page)

## Creating Evaluations — Two Paths

### Path A: Manual entry in the admin form

Coach opens a player, clicks "New Evaluation", fills in the form. All skill categories are shown. Coach enters scores and notes per skill. Scores are optional — unscored skills show as "not evaluated".

### Path B: Import from Claude-generated JSON file

Coach generates an evaluation with Claude, saves it as a `.json` file, uploads it in the admin at `/admin/players/[id]/evaluations/import`. App parses and validates the JSON, shows a preview, coach confirms.

## JSON Import Format

This is the exact format Claude should produce for evaluation imports. The app validates against this schema using Zod before saving anything.

```json
{
  "player_name": "Bianca",
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
    },
    {
      "category": "Shooting",
      "skill": "Power shots",
      "score": 6,
      "mechanics_notes": "Standing leg planting too close to ball. Reducing hip extension.",
      "focus_next": true
    }
  ]
}
```

Rules:

- `player_name` must match an existing player in the database (matched by `full_name`)
- `session_date` is ISO 8601 (YYYY-MM-DD)
- `session_number` is a positive integer
- `score` is 1-10 or null (omit the key if not evaluated this session)
- `focus_next` defaults to false if omitted
- `items` may be a subset — not every skill needs to appear in every session
- `category` and `skill` values must match `constants/evaluation-skills.ts` exactly

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
