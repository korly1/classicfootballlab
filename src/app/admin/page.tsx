import Link from "next/link";
import { Users } from "lucide-react";

import { DashboardQuickEval } from "@/features/evaluations/components/dashboard-quick-eval";
import { DashboardPlayerAccordionList } from "@/features/players/components/dashboard-player-accordion-list";
import { ReactivatePlayerButton } from "@/features/players/components/reactivate-player-button";
import { createClient } from "@/lib/supabase/server";

const rowEvalLinkClass =
  "inline-flex min-h-[2.25rem] flex-1 items-center justify-center rounded border border-cfl-gold/40 px-3 py-2 font-[family-name:var(--font-bebas-neue)] text-xs tracking-wider text-cfl-gold uppercase transition hover:border-cfl-gold hover:bg-cfl-gold/10 sm:flex-initial sm:text-sm";

type SearchParams = { showInactive?: string };

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const showInactive = sp.showInactive === "1" || sp.showInactive === "true";

  const supabase = await createClient();
  const { data: activePlayers } = await supabase
    .from("players")
    .select("id, full_name, club, level, share_enabled")
    .eq("is_active", true)
    .order("full_name");

  const players = activePlayers ?? [];

  const { data: inactiveProbe } = await supabase
    .from("players")
    .select("id")
    .eq("is_active", false)
    .limit(1);

  const hasInactivePlayers = (inactiveProbe?.length ?? 0) > 0;

  const { data: inactivePlayers } = showInactive
    ? await supabase
        .from("players")
        .select("id, full_name, club, level")
        .eq("is_active", false)
        .order("full_name")
    : { data: null };

  const inactive = inactivePlayers ?? [];

  if (players.length === 0 && !hasInactivePlayers) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8">
        <div className="flex max-w-md flex-col items-center gap-6 rounded-lg border border-cfl-gold/20 bg-cfl-navy-light/40 px-8 py-12 text-center">
          <div
            className="flex size-16 items-center justify-center rounded-full border border-cfl-gold/30 bg-cfl-navy text-cfl-gold"
            aria-hidden
          >
            <Users className="size-8" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-[0.15em] text-cfl-white">
              No players yet
            </h1>
            <p className="text-sm leading-relaxed text-cfl-gray">
              Add your first player to start tracking evaluations and sharing
              reports with families.
            </p>
          </div>
          <Link
            href="/admin/players/new"
            className="rounded bg-cfl-gold px-6 py-2 font-[family-name:var(--font-bebas-neue)] text-lg tracking-wider text-cfl-navy transition hover:bg-cfl-gold/90"
          >
            Add first player
          </Link>
        </div>
      </div>
    );
  }

  const quickEvalPlayers = players.map((p) => ({
    id: p.id,
    full_name: p.full_name,
  }));

  const playerIds = players.map((p) => p.id);
  const sessionsByPlayer = new Map<
    string,
    {
      id: string;
      session_date: string;
      session_number: number;
      is_published: boolean;
    }[]
  >();
  for (const id of playerIds) {
    sessionsByPlayer.set(id, []);
  }

  if (playerIds.length > 0) {
    const { data: evalRows } = await supabase
      .from("evaluations")
      .select("id, player_id, session_date, session_number, is_published")
      .in("player_id", playerIds)
      .order("session_date", { ascending: false, nullsFirst: false })
      .order("session_number", { ascending: false, nullsFirst: false });

    for (const row of evalRows ?? []) {
      const list = sessionsByPlayer.get(row.player_id);
      if (list) {
        list.push({
          id: row.id,
          session_date: row.session_date,
          session_number: row.session_number,
          is_published: row.is_published,
        });
      }
    }
  }

  const dashboardPlayers = players.map((p) => ({
    id: p.id,
    full_name: p.full_name,
    club: p.club,
    level: p.level,
    share_enabled: p.share_enabled,
    sessions: sessionsByPlayer.get(p.id) ?? [],
  }));

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-gold">
          Players
        </h1>
        <div className="flex w-full max-w-full flex-col gap-4 sm:w-auto sm:max-w-none sm:items-end">
          {players.length > 0 ? (
            <DashboardQuickEval players={quickEvalPlayers} />
          ) : null}
          <Link
            href="/admin/players/new"
            className="inline-flex justify-center rounded bg-cfl-gold px-5 py-2 font-[family-name:var(--font-bebas-neue)] text-lg tracking-wider text-cfl-navy transition hover:bg-cfl-gold/90 sm:self-end"
          >
            New Player
          </Link>
        </div>
      </div>

      {players.length > 0 ? (
        <DashboardPlayerAccordionList items={dashboardPlayers} />
      ) : (
        <p className="mt-6 text-sm text-cfl-gray">
          No active players. Use inactive list below to reactivate someone.
        </p>
      )}

      <div className="mt-10 border-t border-cfl-gold/15 pt-8">
        {showInactive ? (
          <Link
            href="/admin"
            className="text-sm text-cfl-gold transition hover:underline"
          >
            Hide inactive players
          </Link>
        ) : (
          <Link
            href="/admin?showInactive=1"
            className="text-sm text-cfl-gold transition hover:underline"
          >
            Show inactive players
          </Link>
        )}

        {showInactive && inactive.length > 0 ? (
          <>
            <h2 className="mt-6 font-[family-name:var(--font-bebas-neue)] text-xl tracking-wider text-cfl-white">
              Inactive players
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {inactive.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col gap-3 rounded border border-cfl-gold/15 bg-cfl-navy-light/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <span className="font-medium text-cfl-white">{p.full_name}</span>
                    {(p.club || p.level) && (
                      <span className="mt-1 block text-sm text-cfl-gray">
                        {[p.club, p.level].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                    <Link
                      href={`/admin/players/${p.id}`}
                      className="text-center text-sm text-cfl-gold transition hover:underline sm:px-2 sm:text-left"
                    >
                      Profile
                    </Link>
                    <Link
                      href={`/admin/players/${p.id}/evaluations/new`}
                      className={rowEvalLinkClass}
                    >
                      New manual evaluation
                    </Link>
                    <Link
                      href={`/admin/players/${p.id}/evaluations/import`}
                      className={rowEvalLinkClass}
                    >
                      Import JSON evaluation
                    </Link>
                    <div className="flex justify-center sm:inline-flex sm:justify-start">
                      <ReactivatePlayerButton playerId={p.id} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {showInactive && inactive.length === 0 ? (
          <p className="mt-4 text-sm text-cfl-gray">No inactive players.</p>
        ) : null}
      </div>
    </div>
  );
}
