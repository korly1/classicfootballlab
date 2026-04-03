import Link from "next/link";
import { notFound } from "next/navigation";

import { DeactivatePlayerButton } from "@/features/players/components/deactivate-player-button";
import { ReactivatePlayerButton } from "@/features/players/components/reactivate-player-button";
import { ageFromBirthYear } from "@/features/players/lib/age-from-birth-year";
import { playerReportShareUrl } from "@/features/players/lib/share-url";
import { createClient } from "@/lib/supabase/server";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function PlayerProfilePage({
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

  const { data: evaluations } = await supabase
    .from("evaluations")
    .select("id, session_date, session_number, is_published")
    .eq("player_id", id)
    .order("session_date", { ascending: false, nullsFirst: false })
    .order("session_number", { ascending: false, nullsFirst: false });

  const evals = evaluations ?? [];
  const shareUrl = playerReportShareUrl(player.share_token);
  const age = ageFromBirthYear(player.birth_year);

  return (
    <div>
      <Link
        href="/admin"
        className="text-sm text-cfl-gray transition hover:text-cfl-gold"
      >
        ← Back to players
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-gold">
            {player.full_name}
          </h1>
          {!player.is_active ? (
            <p className="mt-2 text-sm text-amber-300">Inactive</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/players/${id}/edit`}
            className="rounded border border-cfl-gold/40 px-4 py-2 text-sm text-cfl-gold transition hover:border-cfl-gold"
          >
            Edit
          </Link>
          {player.is_active ? (
            <DeactivatePlayerButton playerId={id} />
          ) : (
            <ReactivatePlayerButton
              playerId={id}
              className="border-transparent bg-cfl-gold/20 px-4 py-2 hover:bg-cfl-gold/30"
            />
          )}
        </div>
      </div>

      <section className="mt-8 rounded border border-cfl-gold/20 bg-cfl-navy-light/30 p-6">
        <h2 className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-wider text-cfl-white">
          Details
        </h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-cfl-gray">Birth year</dt>
            <dd className="text-cfl-white">
              {player.birth_year != null ? String(player.birth_year) : "—"}
              {age !== null ? ` (~${age} years)` : null}
            </dd>
          </div>
          <div>
            <dt className="text-cfl-gray">Club</dt>
            <dd className="text-cfl-white">{player.club?.trim() || "—"}</dd>
          </div>
          <div>
            <dt className="text-cfl-gray">Level</dt>
            <dd className="text-cfl-white">{player.level?.trim() || "—"}</dd>
          </div>
          <div>
            <dt className="text-cfl-gray">Parent / guardian name</dt>
            <dd className="text-cfl-white">{player.parent_name?.trim() || "—"}</dd>
          </div>
          <div>
            <dt className="text-cfl-gray">Parent phone</dt>
            <dd className="text-cfl-white">{player.parent_phone?.trim() || "—"}</dd>
          </div>
          <div>
            <dt className="text-cfl-gray">Parent email</dt>
            <dd className="text-cfl-white">{player.parent_email?.trim() || "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-cfl-gray">Notes</dt>
            <dd className="whitespace-pre-wrap text-cfl-white">
              {player.notes?.trim() || "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-8 rounded border border-cfl-gold/20 bg-cfl-navy-light/30 p-6">
        <h2 className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-wider text-cfl-white">
          Share link
        </h2>
        <p className="mt-2 text-sm text-cfl-gray">
          Parents open this URL and enter their PIN to view reports.
        </p>
        {shareUrl ? (
          <p className="mt-3 break-all font-mono text-sm text-cfl-gold">{shareUrl}</p>
        ) : (
          <p className="mt-3 text-sm text-amber-200">
            Share link is not available yet. If this persists, contact support.
          </p>
        )}
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-wider text-cfl-gold">
            Evaluations
          </h2>
          <Link
            href={`/admin/players/${id}/evaluations/new`}
            className="rounded bg-cfl-gold px-4 py-2 text-sm font-medium text-cfl-navy transition hover:bg-cfl-gold/90"
          >
            New Evaluation
          </Link>
        </div>

        {evals.length === 0 ? (
          <div className="mt-6 rounded border border-cfl-gold/15 bg-cfl-navy-light/20 px-6 py-10 text-center">
            <p className="text-cfl-gray">
              No evaluations yet. Create the first one to get started.
            </p>
            <Link
              href={`/admin/players/${id}/evaluations/new`}
              className="mt-4 inline-block rounded bg-cfl-gold px-5 py-2 text-sm font-medium text-cfl-navy transition hover:bg-cfl-gold/90"
            >
              New Evaluation
            </Link>
          </div>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {evals.map((ev) => (
              <li key={ev.id}>
                <Link
                  href={`/admin/players/${id}/evaluations/${ev.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded border border-cfl-gold/20 bg-cfl-navy-light/30 px-4 py-3 text-cfl-white transition hover:border-cfl-gold/50"
                >
                  <span>
                    Session {ev.session_number ?? "—"}
                    {ev.session_date
                      ? ` · ${formatDate(ev.session_date)}`
                      : null}
                  </span>
                  <span className="text-sm text-cfl-gray">
                    {ev.is_published ? "Published" : "Draft"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
