import { z } from "zod";

import {
  ALLOWED_SKILL_PAIR_KEYS,
  buildDefaultSkillRows,
  skillPairKey,
  type ManualEvaluationFormValues,
} from "./manual-evaluation-schema";
import { richReportV1Schema } from "./rich-report-schema";

/** Row shape without category/skill pair validation (refined at root). */
const importItemLooseSchema = z.object({
  category: z.string(),
  skill: z.string(),
  score: z
    .union([z.number().int().min(1).max(10), z.null()])
    .optional(),
  mechanics_notes: z.string().optional(),
  focus_next: z.boolean().optional().default(false),
});

const evaluationImportBaseSchema = z.object({
  player: z.string().min(1, "player is required"),
  session_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "session_date must be YYYY-MM-DD"),
  session_number: z
    .number()
    .int("session_number must be a whole number")
    .min(1, "session_number must be at least 1"),
  overall_notes: z.string().optional(),
  development_plan: z.string().optional(),
  items: z.array(importItemLooseSchema).default([]),
  /** Structured report (HTML parity). Requires at least this or one valid grid item. */
  rich_report: richReportV1Schema.optional(),
});

function isCanonicalItemPair(category: string, skill: string): boolean {
  return ALLOWED_SKILL_PAIR_KEYS.has(skillPairKey(category, skill));
}

export const EvaluationImportSchema = evaluationImportBaseSchema
  .superRefine((data, ctx) => {
    const hasRich = data.rich_report != null;
    const rawItemCount = data.items.length;
    const canonicalCount = data.items.filter((row) =>
      isCanonicalItemPair(row.category, row.skill),
    ).length;
    const hasSessionText =
      (data.overall_notes?.trim() ?? "").length > 0 ||
      (data.development_plan?.trim() ?? "").length > 0;

    if (!hasRich && canonicalCount === 0 && !hasSessionText) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          rawItemCount > 0
            ? "All items[] rows were dropped: none matched the evaluation grid (category/skill must match evaluation-skills exactly). Add rich_report, fix grid names, or add overall_notes / development_plan."
            : "Provide rich_report and/or canonical items[], or at least overall_notes or development_plan for a session-only import.",
        path: ["items"],
      });
    }

    const seen = new Set<string>();
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      if (!isCanonicalItemPair(item.category, item.skill)) {
        continue;
      }
      const k = skillPairKey(item.category, item.skill);
      if (seen.has(k)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate skill row: ${item.category} / ${item.skill}`,
          path: ["items", i],
        });
      }
      seen.add(k);
    }
  })
  .transform((data) => ({
    ...data,
    items: data.items.filter((row) =>
      isCanonicalItemPair(row.category, row.skill),
    ),
  }));

export type EvaluationImport = z.infer<typeof EvaluationImportSchema>;

export function importJsonToManualFormValues(
  data: EvaluationImport,
): ManualEvaluationFormValues {
  const skillRows = buildDefaultSkillRows();
  const indexByKey = new Map(
    skillRows.map((r, i) => [skillPairKey(r.category, r.skill), i]),
  );

  for (const item of data.items) {
    const idx = indexByKey.get(skillPairKey(item.category, item.skill));
    if (idx === undefined) continue;
    const row = skillRows[idx];
    row.score = item.score != null ? String(item.score) : "";
    row.mechanics_notes = item.mechanics_notes?.trim() ?? "";
    row.focus_next = item.focus_next;
  }

  return {
    session_date: data.session_date,
    session_number: data.session_number,
    overall_notes: data.overall_notes ?? "",
    development_plan: data.development_plan ?? "",
    skillRows,
  };
}
