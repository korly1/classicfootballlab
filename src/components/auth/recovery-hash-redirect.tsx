"use client";

import { useEffect } from "react";

/**
 * Supabase password-recovery emails redirect to Site URL (/) with tokens in the hash.
 * Send users to the reset page before the hash is lost.
 */
export function RecoveryHashRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes("type=recovery")) {
      return;
    }
    if (window.location.pathname === "/auth/reset-password") {
      return;
    }
    window.location.replace(`/auth/reset-password${hash}`);
  }, []);

  return null;
}
