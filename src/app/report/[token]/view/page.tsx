import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ParentReportBody } from "@/features/report/components/parent-report-body";
import { REPORT_ACCESS_COOKIE } from "@/features/report/constants";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ReportViewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  noStore();
  const { token } = await params;
  const jar = await cookies();
  if (jar.get(REPORT_ACCESS_COOKIE)?.value !== token) {
    redirect(`/report/${token}`);
  }

  const admin = createAdminClient();
  const { data: player } = await admin
    .from("players")
    .select("id, full_name, share_enabled, level, club")
    .eq("share_token", token)
    .maybeSingle();

  if (!player || player.share_enabled !== true) {
    redirect(`/report/${token}`);
  }

  const { data: evaluation } = await admin
    .from("evaluations")
    .select("*")
    .eq("player_id", player.id)
    .eq("is_published", true)
    .order("session_date", { ascending: false, nullsFirst: false })
    .order("session_number", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  const itemRows =
    evaluation != null
      ? (
          await admin
            .from("evaluation_items")
            .select("*")
            .eq("evaluation_id", evaluation.id)
            .order("category")
            .order("skill")
        ).data ?? []
      : [];

  return (
    <main className="min-h-screen bg-cfl-navy px-4 py-10 text-cfl-text-body">
      <div className="mx-auto max-w-2xl">
        {!evaluation ? (
          <div className="rounded border border-cfl-gold/20 bg-cfl-navy-light/40 px-6 py-12 text-center">
            <p className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide text-cfl-white">
              {player.full_name}
            </p>
            {[player.level?.trim(), player.club?.trim()].filter(Boolean)
              .length > 0 ? (
              <p className="mt-2 text-sm text-cfl-gray">
                {[player.level?.trim(), player.club?.trim()]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            ) : null}
            <p className="mt-4 text-cfl-gray">
              No published evaluation is available yet. Your coach will publish
              it when it is ready — check back soon.
            </p>
            <p className="mt-8 font-[family-name:var(--font-bebas-neue)] text-sm tracking-[0.3em] text-cfl-gold">
              Classic Football Lab
            </p>
          </div>
        ) : (
          <ParentReportBody
            playerName={player.full_name}
            playerLevel={player.level}
            playerClub={player.club}
            evaluation={evaluation}
            items={itemRows}
          />
        )}
      </div>
    </main>
  );
}
