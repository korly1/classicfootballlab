import { formatCalendarDateLong } from "@/lib/format-calendar-date";

type BuildShareMessageInput = {
  parentName: string | null;
  playerName: string;
  sessionDate: string;
  shareUrl: string;
  pin?: string | null;
};

export function buildParentShareMessage({
  parentName,
  playerName,
  sessionDate,
  shareUrl,
  pin,
}: BuildShareMessageInput): string {
  const greeting = parentName?.trim()
    ? `Hi ${parentName.trim()},`
    : "Hi,";
  const dateLabel = formatCalendarDateLong(sessionDate);
  const lines = [
    greeting,
    "",
    `${playerName}'s latest Classic Football Lab evaluation from ${dateLabel} is ready.`,
    "",
    `View the report: ${shareUrl}`,
  ];
  if (pin?.trim()) {
    lines.push("", `PIN: ${pin.trim()}`);
  } else {
    lines.push(
      "",
      "Use the PIN you received when we first shared the report link.",
    );
  }
  lines.push("", "— Classic Football Lab");
  return lines.join("\n");
}
