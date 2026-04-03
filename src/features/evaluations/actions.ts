"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

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
