import Link from "next/link";
import { notFound } from "next/navigation";

import { EvaluationDetailShell } from "@/features/evaluations/components/evaluation-detail-shell";
import {
  PublishDraftButton,
  PublishThenShareButton,
} from "@/features/evaluations/components/evaluation-publish-actions";
import { RichEvaluationReport } from "@/features/evaluations/components/rich-evaluation-report";
import { parseRichReportV1 } from "@/features/evaluations/schemas/rich-report-schema";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type ItemRow = Tables<"evaluation_items">;

function groupItemsByCategory(items: ItemRow[]): Map<string, ItemRow[]> {
  const map = new Map<string, ItemRow[]>();
  for (const item of items) {
    const list = map.get(item.category) ?? [];
    list.push(item);
    map.set(item.category, list);
  }
  return map;
}

export default async function EvaluationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; evalId: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  const { id, evalId } = await params;
  const sp = await searchParams;
  const initialShareModal = sp.new === "1";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    notFound();
  }

  const { data: evaluation } = await supabase
    .from("evaluations")
    .select("*")
    .eq("id", evalId)
    .eq("player_id", id)
    .maybeSingle();

  if (!evaluation || evaluation.coach_id !== user.id) {
    notFound();
  }

  const { data: playerRow } = await supabase
    .from("players")
    .select("full_name")
    .eq("id", id)
    .maybeSingle();

  const playerName = playerRow?.full_name ?? "Player";

  const rich =
    evaluation.rich_report != null
      ? parseRichReportV1(evaluation.rich_report)
      : null;

  const { data: itemRows } = await supabase
    .from("evaluation_items")
    .select("*")
    .eq("evaluation_id", evalId)
    .order("category")
    .order("skill");

  const items = itemRows ?? [];
  const byCategory = groupItemsByCategory(items);
  const shareHref = `/admin/players/${id}/evaluations/${evalId}/share`;

  return (
    <div>
      <Link
        href={`/admin/players/${id}`}
        className="text-sm text-cfl-gray transition hover:text-cfl-gold"
      >
        ← Back to player
      </Link>

      <EvaluationDetailShell
        playerId={id}
        evalId={evalId}
        shareHref={shareHref}
        initialShareModal={initialShareModal}
      >
        <div className="mt-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-gold">
              Evaluation
            </h1>
            {!evaluation.is_published ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-amber-400/50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-amber-200">
                  Draft
                </span>
                <PublishDraftButton
                  playerId={id}
                  evalId={evalId}
                  className="rounded bg-cfl-green/90 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cfl-navy transition hover:bg-cfl-green disabled:opacity-50"
                >
                  Publish
                </PublishDraftButton>
              </div>
            ) : (
              <span className="rounded border border-cfl-green/50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cfl-green">
                Published
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-cfl-gray">
            Session {evaluation.session_number} ·{" "}
            {formatDate(evaluation.session_date)}
          </p>

          {evaluation.updated_at ? (
            <p className="mt-1 text-xs text-cfl-gray/80">
              Last updated{" "}
              {new Date(evaluation.updated_at).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          ) : null}

          {rich ? (
            <div className="mt-8">
              <RichEvaluationReport
                playerName={playerName}
                sessionDateFormatted={formatDate(evaluation.session_date)}
                overallNotes={evaluation.overall_notes}
                developmentPlan={evaluation.development_plan}
                rich={rich}
              />
            </div>
          ) : (
            <>
              <section className="mt-8 rounded border border-cfl-gold/20 bg-cfl-navy-light/30 p-6">
                <h2 className="font-[family-name:var(--font-bebas-neue)] text-lg tracking-wider text-cfl-white">
                  Session notes
                </h2>
                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="text-cfl-gray">Overall notes</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-cfl-white">
                      {evaluation.overall_notes?.trim() || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-cfl-gray">Development plan</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-cfl-white">
                      {evaluation.development_plan?.trim() || "—"}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="mt-8">
                <h2 className="font-[family-name:var(--font-bebas-neue)] text-lg tracking-wider text-cfl-gold">
                  Skills
                </h2>
                {items.length === 0 ? (
                  <p className="mt-3 text-sm text-cfl-gray">
                    No skill rows recorded for this evaluation.
                  </p>
                ) : (
                  <div className="mt-4 flex flex-col gap-6">
                    {Array.from(byCategory.entries()).map(([category, rows]) => (
                      <div key={category}>
                        <h3 className="text-sm font-medium uppercase tracking-wide text-cfl-gold">
                          {category}
                        </h3>
                        <ul className="mt-2 flex flex-col gap-3">
                          {rows.map((row) => (
                            <li
                              key={row.id}
                              className="rounded border border-cfl-gold/15 bg-cfl-navy-light/20 px-4 py-3 text-sm"
                            >
                              <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <span className="font-medium text-cfl-white">
                                  {row.skill}
                                </span>
                                {row.score != null ? (
                                  <span className="text-cfl-gold">
                                    Score: {row.score}/10
                                  </span>
                                ) : (
                                  <span className="text-cfl-gray">No score</span>
                                )}
                              </div>
                              {row.mechanics_notes?.trim() ? (
                                <p className="mt-2 whitespace-pre-wrap text-cfl-gray">
                                  {row.mechanics_notes}
                                </p>
                              ) : null}
                              {row.focus_next ? (
                                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-amber-200">
                                  Focus next session
                                </p>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          <div className="mt-8">
            <PublishThenShareButton
              playerId={id}
              evalId={evalId}
              shareHref={shareHref}
              className="inline-block rounded border border-cfl-gold/40 px-4 py-2 text-sm text-cfl-gold transition hover:border-cfl-gold disabled:opacity-50"
            >
              Share with parent
            </PublishThenShareButton>
          </div>
        </div>
      </EvaluationDetailShell>
    </div>
  );
}
