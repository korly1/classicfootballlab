import { z } from "zod";

/** Stages used in coach HTML reports (lowercase keys for JSON). */
export const SKILL_STAGES = [
  "identified",
  "working",
  "showing",
  "consistent",
  "mastered",
] as const;

export type SkillStage = (typeof SKILL_STAGES)[number];

export const skillStageSchema = z.enum(SKILL_STAGES);

const mechanicHistoryEntrySchema = z.object({
  date: z.string().min(1),
  note: z.string(),
  change: z.string().optional(),
});

const mechanicSchema = z.object({
  name: z.string().min(1),
  stage: skillStageSchema,
  description: z.string(),
  also_affects: z.array(z.string()).optional(),
  history: z.array(mechanicHistoryEntrySchema).optional(),
});

const techniqueSchema = z.object({
  name: z.string().min(1),
  /** Optional badge on the technique header (e.g. lowest stage across mechanics). */
  header_stage: skillStageSchema.optional(),
  mechanics: z.array(mechanicSchema),
});

const technicalCategorySchema = z.object({
  category: z.string().min(1),
  techniques: z.array(techniqueSchema),
});

export const richReportV1Schema = z.object({
  version: z.literal(1),
  player_tags: z.array(z.string()).default([]),
  /** Shown under coach note (e.g. coach name). */
  coach_attribution: z.string().optional(),
  session_overview: z.object({
    techniques_evaluated: z.number().int().min(0),
    mechanics_tracked: z.number().int().min(0),
    showing_or_above: z.number().int().min(0),
  }),
  snapshot_counts: z.object({
    identified: z.number().int().min(0),
    working: z.number().int().min(0),
    showing: z.number().int().min(0),
    consistent: z.number().int().min(0),
    mastered: z.number().int().min(0),
  }),
  technique_summary: z.array(
    z.object({
      name: z.string().min(1),
      category: z.string(),
      lowest_stage: skillStageSchema,
    }),
  ),
  technical_evaluation: z.array(technicalCategorySchema),
  /** Free text or bullet strings for “upcoming sessions”. */
  pending_upcoming: z.union([z.string(), z.array(z.string())]).optional(),
});

export type RichReportV1 = z.infer<typeof richReportV1Schema>;

export function parseRichReportV1(data: unknown): RichReportV1 | null {
  const r = richReportV1Schema.safeParse(data);
  return r.success ? r.data : null;
}
