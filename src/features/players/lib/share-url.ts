/**
 * Parent report URL. Set NEXT_PUBLIC_APP_URL in `.env.local` (e.g. http://localhost:3000)
 * so share links are correct in development.
 */
export function playerReportShareUrl(shareToken: string | null): string | null {
  if (!shareToken) return null;
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
  if (!base) return `/report/${shareToken}`;
  return `${base}/report/${shareToken}`;
}
