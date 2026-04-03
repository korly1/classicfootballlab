import type { Tables } from "@/lib/supabase/database.types";

import type { PlayerFormValues } from "../schemas/player-form-schema";

type PlayerRow = Tables<"players">;

export function playerRowToFormDefaults(row: PlayerRow): PlayerFormValues {
  return {
    full_name: row.full_name,
    birth_year: row.birth_year != null ? String(row.birth_year) : "",
    club: row.club ?? "",
    level: row.level ?? "",
    parent_name: row.parent_name ?? "",
    parent_phone: row.parent_phone ?? "",
    parent_email: row.parent_email ?? "",
    notes: row.notes ?? "",
  };
}
