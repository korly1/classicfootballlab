/**
 * Only allow same-origin relative paths under /admin after login.
 * Prevents open redirects via ?redirectTo=https://evil.com
 */
export function sanitizeAdminRedirect(raw: string | null | undefined): string {
  if (raw == null || typeof raw !== "string") {
    return "/admin";
  }
  const trimmed = raw.trim();
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("..") ||
    trimmed.includes("\\") ||
    trimmed.includes("\0")
  ) {
    return "/admin";
  }
  if (!trimmed.startsWith("/admin")) {
    return "/admin";
  }
  return trimmed;
}
