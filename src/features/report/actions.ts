"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import { createAdminClient } from "@/lib/supabase/admin";

import { REPORT_ACCESS_COOKIE } from "./constants";

export async function verifyReportPin(
  token: string,
  pin: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = pin.trim();
  if (!/^\d{4,6}$/.test(trimmed)) {
    return { ok: false, error: "PIN must be 4–6 digits." };
  }

  const admin = createAdminClient();
  const { data: player } = await admin
    .from("players")
    .select("id, share_pin, share_enabled")
    .eq("share_token", token)
    .maybeSingle();

  if (!player || !player.share_enabled) {
    return { ok: false, error: "This report link is not available." };
  }
  if (!player.share_pin) {
    return { ok: false, error: "PIN has not been set yet. Contact your coach." };
  }

  const match = await bcrypt.compare(trimmed, player.share_pin);
  if (!match) {
    return {
      ok: false,
      error: "Incorrect PIN. Please try again.",
    };
  }

  const jar = await cookies();
  jar.set(REPORT_ACCESS_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });

  return { ok: true };
}
