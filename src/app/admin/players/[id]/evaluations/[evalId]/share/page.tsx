import Link from "next/link";
import { notFound } from "next/navigation";

import { ShareEvaluationPanel } from "@/features/evaluations/components/share-evaluation-panel";
import { playerReportShareUrl } from "@/features/players/lib/share-url";
import { formatCalendarDateShort } from "@/lib/format-calendar-date";
import { createClient } from "@/lib/supabase/server";

export default async function ShareEvaluationPage({
  params,
}: {
  params: Promise<{ id: string; evalId: string }>;
}) {
  const { id, evalId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    notFound();
  }

  const { data: evaluation } = await supabase
    .from("evaluations")
    .select("id, session_date, session_number, is_published, player_id, coach_id")
    .eq("id", evalId)
    .eq("player_id", id)
    .maybeSingle();

  if (!evaluation || evaluation.coach_id !== user.id) {
    notFound();
  }

  const { data: player } = await supabase
    .from("players")
    .select(
      "full_name, parent_name, parent_email, parent_phone, share_token, share_enabled",
    )
    .eq("id", id)
    .maybeSingle();

  if (!player) {
    notFound();
  }

  const sessionLabel = formatCalendarDateShort(evaluation.session_date);
  const shareUrl = playerReportShareUrl(player.share_token);

  return (
    <div>
      <Link
        href={`/admin/players/${id}/evaluations/${evalId}`}
        className="text-sm text-cfl-gray transition hover:text-cfl-gold"
      >
        ← Back to evaluation
      </Link>

      <h1 className="mt-4 font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-gold">
        Share with parent
      </h1>
      <p className="mt-2 text-cfl-gray">
        {player.full_name} · Session {evaluation.session_number}
        {sessionLabel ? ` · ${sessionLabel}` : null}
      </p>

      <ShareEvaluationPanel
        playerId={id}
        evalId={evalId}
        playerName={player.full_name}
        parentName={player.parent_name}
        parentEmail={player.parent_email}
        parentPhone={player.parent_phone}
        sessionDate={evaluation.session_date}
        sessionNumber={evaluation.session_number}
        shareEnabled={player.share_enabled}
        shareUrl={shareUrl}
        isPublished={evaluation.is_published}
      />
    </div>
  );
}
