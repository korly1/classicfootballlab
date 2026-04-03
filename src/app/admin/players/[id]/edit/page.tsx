import Link from "next/link";
import { notFound } from "next/navigation";

import { EditPlayerForm } from "@/features/players/components/edit-player-form";
import { createClient } from "@/lib/supabase/server";

export default async function EditPlayerPage({
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
    .select("*")
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
        ← Back to profile
      </Link>
      <h1 className="mt-4 font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-gold">
        Edit player
      </h1>
      <p className="mt-2 text-sm text-cfl-gray">Update {player.full_name}&apos;s profile.</p>
      <EditPlayerForm player={player} />
    </div>
  );
}
