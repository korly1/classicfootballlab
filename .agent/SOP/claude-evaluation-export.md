# SOP: Claude → CFL evaluation JSON

Use this when generating an import file for **Classic Football Lab** (admin → player → Import JSON).

## Workflow: dictate → transcript → Claude

1. Coach **dictates** the session (or pastes structured notes). A **transcript** is the usual input to Claude.
2. Attach the artifacts below (this SOP + golden JSON, optional HTML reference).
3. Ask Claude to output **one JSON object** that passes [`EvaluationImportSchema`](../../src/features/evaluations/schemas/evaluation-import-schema.ts).
4. Coach uploads the file on **Import JSON** for the correct player; if `rich_report` is present, the app shows a **preview** then **Save evaluation draft**.

**Primary payload:** `rich_report` (v1) for parent/admin HTML-style layout. **`items[]`** is optional: add only if you also want the canonical 1–10 skill grid filled (see mapping table below).

## Files to attach in Claude (recommended)

| File | Purpose |
|------|---------|
| This SOP | Rules, enums, transcript mapping |
| [`bianca_rich_v1.import.json`](../../src/features/evaluations/__fixtures__/bianca_rich_v1.import.json) | **Gold standard** — full structure, all sections, optional `items` |
| [`evaluation-import-rich-v1.template.json`](../../public/evaluation-import-rich-v1.template.json) | Minimal skeleton (see [`evaluation-import-rich-v1.template.README.txt`](../../public/evaluation-import-rich-v1.template.README.txt) for pointer to full example) |
| Source HTML (e.g. `bianca_report_mar30.html`) | Optional diff-check for wording and order |

**Validate locally:** `npm run validate-fixture` (checks the Bianca fixture against Zod).

## Output rules

1. Output **only valid JSON** (no markdown fences unless the user asks for display).
2. Root object must satisfy [`EvaluationImportSchema`](../../src/features/evaluations/schemas/evaluation-import-schema.ts):
   - `player` (string): **exact** `full_name` as stored for the player in the app (import page compares case-insensitively; mismatch requires coach acknowledgment).
   - `session_date`: `YYYY-MM-DD`.
   - `session_number`: integer ≥ 1.
   - `overall_notes`, `development_plan`: optional strings (shown in app and in the rich report coach block).
   - **`rich_report`**: optional; if present must match [`richReportV1Schema`](../../src/features/evaluations/schemas/rich-report-schema.ts) with `"version": 1`.
   - **`items`**: optional array of canonical grid rows (see `evaluation-skills.ts`). Use **exact** `category` / `skill` strings. `score` may be **omitted** or **`null`**. Omit rows for unevaluated skills.

3. At least one of: **`rich_report`**, **non-empty `items`**, or **non-empty** `overall_notes` / `development_plan`.

## Mapping transcript → `rich_report`

### Coach narrative

- Long session summary → **`overall_notes`** (renders as “Coach’s note”).
- Priorities / next-session focus → **`development_plan`**.
- Date + coach sign-off line → **`coach_attribution`** (e.g. `March 30, 2025 · Coach Name`).
- Position, flight, age labels → **`player_tags`**.

### Session overview and snapshot

- **`session_overview`**: from explicit counts in dictation, or **count** techniques (evaluated headers) and mechanics (individual observations under each technique). `showing_or_above` = mechanics at stage `showing`, `consistent`, or `mastered`.
- **`snapshot_counts`**: aggregate **every mechanic row** into the five buckets (`identified` … `mastered`). Totals should match what you said in the session (or match a reference HTML if mirroring a report).

### Technique bars (`technique_summary`)

- One object per **evaluated technique** in the transcript.
- **`lowest_stage`**: the **worst** stage among that technique’s mechanics (bottleneck), using the enum below.
- **`category`**: section title as you’d show the parent (e.g. `Ball Control & Dribbling` is allowed; it is display text, not the grid’s `Ball Control`).

### Technical tree (`technical_evaluation`)

- Each major heading (Passing, Shooting, …) → one object with `category` and `techniques[]`.
- Each technique → `name`, optional `header_stage` (badge for the whole technique), `mechanics[]`.
- Each mechanic → `name`, `stage`, `description` (required prose), optional `also_affects` (string array), optional `history` (`date`, `note`, optional `change`).
- Techniques **not evaluated** in this session: **omit** from `technical_evaluation`; list them in **`pending_upcoming`** instead.

### Stage phrases → JSON enum (lowercase)

| Say this (examples) | Use |
|---------------------|-----|
| Identified | `identified` |
| Working on it | `working` |
| Showing improvement | `showing` |
| Consistent | `consistent` |
| Mastered | `mastered` |

Allowed values only: `identified` | `working` | `showing` | `consistent` | `mastered`.

### Pending / upcoming

- **`pending_upcoming`**: string or string array — topics named but not evaluated (matches “scheduled for upcoming sessions” in the Bianca HTML).

## Rich report (`rich_report`) — field reference

- **`version`**: must be `1`.
- **`player_tags`**: string array (e.g. position, flight, age label). Display-only.
- **`coach_attribution`**: optional line under the coach note (e.g. date · coach name).
- **`session_overview`**: three non-negative integers: `techniques_evaluated`, `mechanics_tracked`, `showing_or_above`.
- **`snapshot_counts`**: five non-negative integers: `identified`, `working`, `showing`, `consistent`, `mastered`.
- **`technique_summary`**: bar chart rows: `{ "name", "category", "lowest_stage" }`.
- **`technical_evaluation`**: nested list:
  - `category` (string)
  - `techniques[]`: `name`, optional `header_stage`, `mechanics[]` with `name`, `stage`, `description`, optional `also_affects[]`, optional `history[]` (`date`, `note`, optional `change`).
- **`pending_upcoming`**: string **or** string array (upcoming session topics).

Technique and mechanic names in `technical_evaluation` are **free text** (they do not need to match `evaluation-skills.ts`). The flat **`items`** grid is separate.

## Canonical grid (`items`) — optional

Only when you need 1–10 scores on the standard skill list. Pairs must match [`src/constants/evaluation-skills.ts`](../../src/constants/evaluation-skills.ts) exactly.

**Bianca-style HTML technique → canonical row** (when emitting `items` alongside `rich_report`):

| Report technique | `category` / `skill` |
|------------------|----------------------|
| Inside-of-foot pass | Passing / **Short passes** |
| Long ground pass | Passing / **Long ground passes** |
| Power shot | Shooting / **Power shots** |
| Finishing from crosses | Finishing / **Finishing from crosses** |
| Control and finish | Finishing / **Control and finish** |
| Dribbling | Ball Control / **Soft touches** |
| First touch / receiving | Ball Control / **Controlling the ball** |

Scores are **not** in the HTML (stages only); map roughly: identified ≈ 4, working ≈ 5–6, showing ≈ 7 (coach may adjust).

## User message templates

### From transcript

> Here is the raw transcript of my session evaluation:  
> [paste transcript]  
>  
> Generate **one** CFL import JSON for player **full name** **[name]**, session date **[YYYY-MM-DD]**, session number **[n]**.  
> Mirror the **structure and depth** of [`bianca_rich_v1.import.json`](../../src/features/evaluations/__fixtures__/bianca_rich_v1.import.json) (all `rich_report` sections).  
> Include **`items[]`** with canonical skill rows only if I need the 1–10 grid populated; otherwise use `"items": []`.

### From HTML or notes

> Generate CFL evaluation import JSON for **[player full name]**, session date **[YYYY-MM-DD]**, session number **[n]**.  
> Source material: [paste HTML, notes, or bullets].  
> Prefer **`rich_report`** so the parent/admin report matches the structured HTML style. Include **`items`** only if you also need the canonical 1–10 grid populated.
