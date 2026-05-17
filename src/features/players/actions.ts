"use server";

import { randomInt } from "node:crypto";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
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

/** Cryptographically random 6-digit PIN for parent report access. */
function generateParentPin(): string {
  return String(randomInt(100_000, 1_000_000));
}

function revalidateParentReportPaths(shareToken: string) {
  revalidatePath(`/report/${shareToken}`);
  revalidatePath(`/report/${shareToken}/view`);
}

export type SetPlayerShareEnabledResult =
  | { ok: true; shareEnabled: true; parentPin: string }
  | { ok: true; shareEnabled: false }
  | { ok: false; error: string };

export type ResetPlayerSharePinResult =
  | { ok: true; parentPin: string }
  | { ok: false; error: string };

/** New PIN while keeping sharing on. Old PIN stops working immediately. */
export async function resetPlayerSharePin(
  playerId: string,
): Promise<ResetPlayerSharePinResult> {
  if (!UUID_RE.test(playerId)) {
    return { ok: false, error: invalidId().error };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  const { data: existing } = await supabase
    .from("players")
    .select("share_enabled, share_token")
    .eq("id", playerId)
    .eq("coach_id", user.id)
    .maybeSingle();

  if (!existing) {
    return { ok: false, error: "Player not found." };
  }
  if (!existing.share_enabled) {
    return {
      ok: false,
      error: "Turn on the parent report link before issuing a PIN.",
    };
  }

  const plainPin = generateParentPin();
  const share_pin = await bcrypt.hash(plainPin, 10);
  const { error } = await supabase
    .from("players")
    .update({
      share_pin,
      updated_at: new Date().toISOString(),
    })
    .eq("id", playerId)
    .eq("coach_id", user.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(`/admin/players/${playerId}`);
  revalidatePath("/admin");
  if (existing.share_token) {
    revalidateParentReportPaths(existing.share_token);
  }

  return { ok: true, parentPin: plainPin };
}

export async function setPlayerShareEnabled(
  playerId: string,
  shareEnabled: boolean,
): Promise<SetPlayerShareEnabledResult> {
  if (!UUID_RE.test(playerId)) {
    return { ok: false, error: invalidId().error };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  if (shareEnabled) {
    const plainPin = generateParentPin();
    const share_pin = await bcrypt.hash(plainPin, 10);
    const { data: row, error } = await supabase
      .from("players")
      .update({
        share_enabled: true,
        share_pin,
        updated_at: new Date().toISOString(),
      })
      .eq("id", playerId)
      .eq("coach_id", user.id)
      .select("share_token")
      .maybeSingle();

    if (error) {
      return { ok: false, error: error.message };
    }
    if (!row?.share_token) {
      return { ok: false, error: "Player not found." };
    }

    revalidatePath(`/admin/players/${playerId}`);
    revalidatePath("/admin");
    revalidateParentReportPaths(row.share_token);
    return { ok: true, shareEnabled: true, parentPin: plainPin };
  }

  const { data: row, error } = await supabase
    .from("players")
    .update({
      share_enabled: false,
      share_pin: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", playerId)
    .eq("coach_id", user.id)
    .select("share_token")
    .maybeSingle();

  if (error) {
    return { ok: false, error: error.message };
  }
  if (!row?.share_token) {
    return { ok: false, error: "Player not found." };
  }

  revalidatePath(`/admin/players/${playerId}`);
  revalidatePath("/admin");
  revalidateParentReportPaths(row.share_token);
  return { ok: true, shareEnabled: false };
}

