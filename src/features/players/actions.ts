"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import {
  playerFormSchema,
  playerFormToInsert,
  playerFormToUpdate,
} from "./schemas/player-form-schema";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function invalidId(): { error: string } {
  return { error: "Invalid player id." };
}

export async function createPlayer(
  input: unknown,
): Promise<{ error: string } | void> {
  const parsed = playerFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please fix the form errors." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in." };
  }

  const row = playerFormToInsert(parsed.data, user.id);
  const { data, error } = await supabase
    .from("players")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }
  if (!data) {
    return { error: "Could not create player." };
  }

  redirect(`/admin/players/${data.id}`);
}

export async function updatePlayer(
  playerId: string,
  input: unknown,
): Promise<{ error: string } | void> {
  if (!UUID_RE.test(playerId)) {
    return invalidId();
  }

  const parsed = playerFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please fix the form errors." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data: existing } = await supabase
    .from("players")
    .select("id, coach_id")
    .eq("id", playerId)
    .maybeSingle();

  if (!existing || existing.coach_id !== user.id) {
    return { error: "Player not found." };
  }

  const updateRow = playerFormToUpdate(parsed.data);
  const { error } = await supabase
    .from("players")
    .update({
      ...updateRow,
      updated_at: new Date().toISOString(),
    })
    .eq("id", playerId)
    .eq("coach_id", user.id);

  if (error) {
    return { error: error.message };
  }

  redirect(`/admin/players/${playerId}`);
}

export async function deactivatePlayer(
  playerId: string,
): Promise<{ error: string } | void> {
  if (!UUID_RE.test(playerId)) {
    return invalidId();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase
    .from("players")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", playerId)
    .eq("coach_id", user.id);

  if (error) {
    return { error: error.message };
  }

  redirect("/admin");
}

export async function reactivatePlayer(
  playerId: string,
): Promise<{ error: string } | void> {
  if (!UUID_RE.test(playerId)) {
    return invalidId();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase
    .from("players")
    .update({
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", playerId)
    .eq("coach_id", user.id);

  if (error) {
    return { error: error.message };
  }

  redirect("/admin?showInactive=1");
}
