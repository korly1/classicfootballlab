import Link from "next/link";
import { notFound } from "next/navigation";

import { ImportEvaluationClient } from "@/features/evaluations/components/import-evaluation-client";
import { createClient } from "@/lib/supabase/server";

export default async function ImportEvaluationPage({
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

  return (
    <div>
      <Link
        href={`/admin/players/${id}`}
        className="text-sm text-cfl-gray transition hover:text-cfl-gold"
      >
        ← Back to player
      </Link>
      <h1 className="mt-4 font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-gold">
        Import evaluation
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-cfl-gray">
        Upload a JSON file from Claude. After validation you can edit the full
        skill grid and save a draft like a manual evaluation.
      </p>
      <ImportEvaluationClient
        playerId={player.id}
        playerName={player.full_name}
        expectedFullName={player.full_name}
      />
    </div>
  );
}
