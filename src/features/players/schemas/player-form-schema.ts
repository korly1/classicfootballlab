import { z } from "zod";

function emptyToNull(s: string | undefined): string | null {
  if (s === undefined) return null;
  const t = s.trim();
  return t === "" ? null : t;
}

function currentYear(): number {
  return new Date().getFullYear();
}

export const playerFormSchema = z
  .object({
    full_name: z.string().trim().min(1, "Full name is required"),
    birth_year: z.string().optional().default(""),
    club: z.string().optional().default(""),
    level: z.string().optional().default(""),
    parent_name: z.string().optional().default(""),
    parent_phone: z.string().optional().default(""),
    parent_email: z.string().optional().default(""),
    notes: z.string().optional().default(""),
  })
  .superRefine((data, ctx) => {
    const raw = data.birth_year.trim();
    if (raw === "") return;
    if (!/^\d{4}$/.test(raw)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a 4-digit year",
        path: ["birth_year"],
      });
      return;
    }
    const y = parseInt(raw, 10);
    const maxY = currentYear() + 1;
    if (y < 1990 || y > maxY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Year must be between 1990 and ${maxY}`,
        path: ["birth_year"],
      });
    }
  });

export type PlayerFormValues = z.infer<typeof playerFormSchema>;

export function playerFormToInsert(
  data: PlayerFormValues,
  coachId: string,
): {
  coach_id: string;
  full_name: string;
  birth_year: number | null;
  club: string | null;
  level: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  parent_email: string | null;
  notes: string | null;
} {
  const raw = data.birth_year.trim();
  return {
    coach_id: coachId,
    full_name: data.full_name.trim(),
    birth_year: raw === "" ? null : parseInt(raw, 10),
    club: emptyToNull(data.club),
    level: emptyToNull(data.level),
    parent_name: emptyToNull(data.parent_name),
    parent_phone: emptyToNull(data.parent_phone),
    parent_email: emptyToNull(data.parent_email),
    notes: emptyToNull(data.notes),
  };
}

export function playerFormToUpdate(data: PlayerFormValues): {
  full_name: string;
  birth_year: number | null;
  club: string | null;
  level: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  parent_email: string | null;
  notes: string | null;
} {
  const row = playerFormToInsert(data, "");
  return {
    full_name: row.full_name,
    birth_year: row.birth_year,
    club: row.club,
    level: row.level,
    parent_name: row.parent_name,
    parent_phone: row.parent_phone,
    parent_email: row.parent_email,
    notes: row.notes,
  };
}
