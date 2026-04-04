import Link from "next/link";
import { notFound } from "next/navigation";

import { NewEvaluationForm } from "@/features/evaluations/components/new-evaluation-form";
import { buildDefaultSkillRows } from "@/features/evaluations/schemas/manual-evaluation-schema";
import { pacificTodayIsoDate } from "@/lib/format-calendar-date";
import { createClient } from "@/lib/supabase/server";

export default async function NewEvaluationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    notFound();
  }

  const { data: player } = await supabase
    .from("players")
    .select("id, full_name, coach_id")
    .eq("id", id)
    .maybeSingle();

  if (!player || player.coach_id !== user.id) {
    notFound();
  }

  const { data: lastEval } = await supabase
    .from("evaluations")
    .select("session_number")
    .eq("player_id", id)
    .order("session_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  const defaultSessionNumber =
    lastEval?.session_number != null ? lastEval.session_number + 1 : 1;

  return (
    <div>
      <Link
        href={`/admin/players/${id}`}
        className="text-sm text-cfl-gray transition hover:text-cfl-gold"
      >
        ← Back to player
      </Link>
      <h1 className="mt-4 font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-gold">
        New evaluation
      </h1>
      <NewEvaluationForm
        playerId={player.id}
        playerName={player.full_name}
        defaultValues={{
          session_date: pacificTodayIsoDate(),
          session_number: defaultSessionNumber,
          overall_notes: "",
          development_plan: "",
          skillRows: buildDefaultSkillRows(),
        }}
      />
    </div>
  );
}
