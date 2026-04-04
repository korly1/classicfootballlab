"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import {
  EvaluationImportSchema,
  importJsonToManualFormValues,
} from "./schemas/evaluation-import-schema";
import {
  manualEvaluationFormSchema,
  manualFormToEvaluationItems,
} from "./schemas/manual-evaluation-schema";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function invalidId(): { error: string } {
  return { error: "Invalid id." };
}

function emptyToNull(s: string): string | null {
  const t = s.trim();
  return t === "" ? null : t;
}

export async function createManualEvaluation(
  playerId: string,
  input: unknown,
): Promise<{ error: string } | void> {
  if (!UUID_RE.test(playerId)) {
    return invalidId();
  }

  const parsed = manualEvaluationFormSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: first?.message ?? "Please fix the form errors." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data: player } = await supabase
    .from("players")
    .select("id, coach_id")
    .eq("id", playerId)
    .maybeSingle();

  if (!player || player.coach_id !== user.id) {
    return { error: "Player not found." };
  }

  const data = parsed.data;
  const now = new Date().toISOString();

  const { data: evaluation, error: evalError } = await supabase
    .from("evaluations")
    .insert({
      player_id: playerId,
      coach_id: user.id,
      session_date: data.session_date,
      session_number: data.session_number,
      overall_notes: emptyToNull(data.overall_notes),
      development_plan: emptyToNull(data.development_plan),
      is_published: false,
      updated_at: now,
    })
    .select("id")
    .single();

  if (evalError) {
    return { error: evalError.message };
  }
  if (!evaluation) {
    return { error: "Could not create evaluation." };
  }

  const items = manualFormToEvaluationItems(data, evaluation.id);
  if (items.length > 0) {
    const { error: itemsError } = await supabase
      .from("evaluation_items")
      .insert(items);

    if (itemsError) {
      await supabase.from("evaluations").delete().eq("id", evaluation.id);
      return { error: itemsError.message };
    }
  }

  redirect(
    `/admin/players/${playerId}/evaluations/${evaluation.id}?new=1`,
  );
}

/** Import path: optional rich_report JSON + optional flat items → one evaluation row. */
export async function createImportedEvaluation(
  playerId: string,
  input: unknown,
): Promise<{ error: string } | void> {
  if (!UUID_RE.test(playerId)) {
    return invalidId();
  }

  const parsed = EvaluationImportSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: first?.message ?? "Invalid import data." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data: player } = await supabase
    .from("players")
    .select("id, coach_id")
    .eq("id", playerId)
    .maybeSingle();

  if (!player || player.coach_id !== user.id) {
    return { error: "Player not found." };
  }

  const data = parsed.data;
  const now = new Date().toISOString();

  const { data: evaluation, error: evalError } = await supabase
    .from("evaluations")
    .insert({
      player_id: playerId,
      coach_id: user.id,
      session_date: data.session_date,
      session_number: data.session_number,
      overall_notes: emptyToNull(data.overall_notes ?? ""),
      development_plan: emptyToNull(data.development_plan ?? ""),
      rich_report: data.rich_report ?? null,
      is_published: false,
      updated_at: now,
    })
    .select("id")
    .single();

  if (evalError) {
    return { error: evalError.message };
  }
  if (!evaluation) {
    return { error: "Could not create evaluation." };
  }

  const formValues = importJsonToManualFormValues(data);
  const items = manualFormToEvaluationItems(formValues, evaluation.id);
  if (items.length > 0) {
    const { error: itemsError } = await supabase
      .from("evaluation_items")
      .insert(items);

    if (itemsError) {
      await supabase.from("evaluations").delete().eq("id", evaluation.id);
      return { error: itemsError.message };
    }
  }

  redirect(
    `/admin/players/${playerId}/evaluations/${evaluation.id}?new=1`,
  );
}

/** Marks the evaluation as visible on the parent report (`/report/[token]/view`). */
export async function publishEvaluation(
  playerId: string,
  evalId: string,
): Promise<{ error: string } | undefined> {
  if (!UUID_RE.test(playerId) || !UUID_RE.test(evalId)) {
    return invalidId();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data: row, error: fetchError } = await supabase
    .from("evaluations")
    .select("id, coach_id, is_published")
    .eq("id", evalId)
    .eq("player_id", playerId)
    .maybeSingle();

  if (fetchError) {
    return { error: fetchError.message };
  }
  if (!row || row.coach_id !== user.id) {
    return { error: "Evaluation not found." };
  }

  if (row.is_published) {
    revalidatePath(`/admin/players/${playerId}/evaluations/${evalId}`);
    revalidatePath(`/admin/players/${playerId}`);
    return undefined;
  }

  const now = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("evaluations")
    .update({ is_published: true, updated_at: now })
    .eq("id", evalId)
    .eq("player_id", playerId)
    .eq("coach_id", user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath(`/admin/players/${playerId}/evaluations/${evalId}`);
  revalidatePath(`/admin/players/${playerId}`);
  return undefined;
}

