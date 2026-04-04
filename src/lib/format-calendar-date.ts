import { APP_TIME_ZONE } from "@/constants/app-time";

/** Format `YYYY-MM-DD` as that same civil date (no browser timezone shift). */
const CIVIL_DATE_TIME_ZONE = "UTC";

function parseYyyyMmDdPrefix(iso: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!y || !mo || !d) return null;
  return { y, m: mo, d };
}

function formatCivilYyyyMmDd(
  iso: string,
  month: "short" | "long",
): string {
  const parts = parseYyyyMmDdPrefix(iso);
  if (!parts) {
    const d = new Date(iso.trim());
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("en-US", {
      timeZone: APP_TIME_ZONE,
      year: "numeric",
      month,
      day: "numeric",
    }).format(d);
  }
  const instant = Date.UTC(parts.y, parts.m - 1, parts.d);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: CIVIL_DATE_TIME_ZONE,
    year: "numeric",
    month,
    day: "numeric",
  }).format(instant);
}

/** Session / import `session_date` (Pacific civil calendar day, stored as Postgres `date`). */
export function formatCalendarDateShort(iso: string | null | undefined): string {
  if (!iso) return "—";
  return formatCivilYyyyMmDd(iso, "short");
}

export function formatCalendarDateLong(iso: string | null | undefined): string {
  if (!iso) return "—";
  return formatCivilYyyyMmDd(iso, "long");
}

/** `timestamptz` / ISO instants — always shown in Pacific. */
export function formatPacificDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIME_ZONE,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

/** Today's calendar date in Pacific, as `YYYY-MM-DD` (for form defaults). */
export function pacificTodayIsoDate(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
