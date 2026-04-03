import { z } from "zod";

import { SKILL_CATEGORIES } from "@/constants/evaluation-skills";

/** Fixed order of every (category, skill) for form rows and validation. */
export const ALLOWED_CATEGORY_SKILL = SKILL_CATEGORIES.flatMap((c) =>
  c.skills.map((skill) => ({ category: c.category, skill })),
);

const PAIR_KEY = (category: string, skill: string) => `${category}\0${skill}`;

const ALLOWED_PAIR_KEYS = new Set(
  ALLOWED_CATEGORY_SKILL.map((p) => PAIR_KEY(p.category, p.skill)),
);

export type SkillFormRow = {
  category: string;
  skill: string;
  score: string;
  mechanics_notes: string;
  focus_next: boolean;
};

export function buildDefaultSkillRows(): SkillFormRow[] {
  return ALLOWED_CATEGORY_SKILL.map(({ category, skill }) => ({
    category,
    skill,
    score: "",
    mechanics_notes: "",
    focus_next: false,
  }));
}

const skillFormRowSchema = z
  .object({
    category: z.string(),
    skill: z.string(),
    score: z.string().optional().default(""),
    mechanics_notes: z.string().optional().default(""),
    focus_next: z.boolean().optional().default(false),
  })
  .superRefine((row, ctx) => {
    if (!ALLOWED_PAIR_KEYS.has(PAIR_KEY(row.category, row.skill))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid category or skill",
        path: ["skill"],
      });
    }
    const t = row.score.trim();
    if (t !== "") {
      if (!/^\d{1,2}$/.test(t)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Score must be a whole number from 1 to 10",
          path: ["score"],
        });
        return;
      }
      const n = parseInt(t, 10);
      if (n < 1 || n > 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Score must be from 1 to 10",
          path: ["score"],
        });
      }
    }
  });

export const manualEvaluationFormSchema = z
  .object({
    session_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date (YYYY-MM-DD)"),
    session_number: z.coerce
      .number()
      .int("Session number must be a whole number")
      .min(1, "Session number must be at least 1"),
    overall_notes: z.string().optional().default(""),
    development_plan: z.string().optional().default(""),
    skillRows: z.array(skillFormRowSchema),
  })
  .superRefine((data, ctx) => {
    if (data.skillRows.length !== ALLOWED_CATEGORY_SKILL.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Form is incomplete",
        path: ["skillRows"],
      });
      return;
    }
    for (let i = 0; i < ALLOWED_CATEGORY_SKILL.length; i++) {
      const expected = ALLOWED_CATEGORY_SKILL[i];
      const row = data.skillRows[i];
      if (row.category !== expected.category || row.skill !== expected.skill) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Skill rows are out of order",
          path: ["skillRows", i],
        });
      }
    }
  });

export type ManualEvaluationFormValues = z.infer<
  typeof manualEvaluationFormSchema
>;

function emptyNotesToNull(s: string): string | null {
  const t = s.trim();
  return t === "" ? null : t;
}

export function manualFormToEvaluationItems(
  data: ManualEvaluationFormValues,
  evaluationId: string,
): Array<{
  evaluation_id: string;
  category: string;
  skill: string;
  score: number | null;
  mechanics_notes: string | null;
  focus_next: boolean;
}> {
  const out: Array<{
    evaluation_id: string;
    category: string;
    skill: string;
    score: number | null;
    mechanics_notes: string | null;
    focus_next: boolean;
  }> = [];

  for (const row of data.skillRows) {
    const scoreStr = row.score.trim();
    const score =
      scoreStr === "" ? null : (parseInt(scoreStr, 10) as number);
    const mechanics_notes = emptyNotesToNull(row.mechanics_notes);
    if (score === null && mechanics_notes === null) {
      continue;
    }
    out.push({
      evaluation_id: evaluationId,
      category: row.category,
      skill: row.skill,
      score,
      mechanics_notes,
      focus_next: row.focus_next,
    });
  }

  return out;
}
