import { RichEvaluationReport } from "@/features/evaluations/components/rich-evaluation-report";
import { parseRichReportV1 } from "@/features/evaluations/schemas/rich-report-schema";
import type { Tables } from "@/lib/supabase/database.types";

type EvalRow = Tables<"evaluations">;
type ItemRow = Tables<"evaluation_items">;

function formatSessionDate(iso: string): string {
  const d = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function groupItemsByCategory(items: ItemRow[]): Map<string, ItemRow[]> {
  const map = new Map<string, ItemRow[]>();
  for (const item of items) {
    const list = map.get(item.category) ?? [];
    list.push(item);
    map.set(item.category, list);
  }
  return map;
}

type Props = {
  playerName: string;
  playerLevel?: string | null;
  playerClub?: string | null;
  evaluation: EvalRow;
  items: ItemRow[];
};

export function ParentReportBody({
  playerName,
  playerLevel,
  playerClub,
  evaluation,
  items,
}: Props) {
  const rich =
    evaluation.rich_report != null
      ? parseRichReportV1(evaluation.rich_report)
      : null;

  if (rich) {
    return (
      <RichEvaluationReport
        playerName={playerName}
        playerLevel={playerLevel}
        playerClub={playerClub}
        sessionDateFormatted={formatSessionDate(evaluation.session_date)}
        overallNotes={evaluation.overall_notes}
        developmentPlan={evaluation.development_plan}
        rich={rich}
      />
    );
  }

  const byCategory = groupItemsByCategory(items);
  const levelClubLine = [playerLevel?.trim(), playerClub?.trim()]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="text-cfl-text-body">
      <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-white">
        {playerName}
      </h2>
      <p className="mt-2 text-sm text-cfl-gray">
        Session {evaluation.session_number} ·{" "}
        {formatSessionDate(evaluation.session_date)}
      </p>
      {levelClubLine ? (
        <p className="mt-1 text-sm text-cfl-gray">{levelClubLine}</p>
      ) : null}

      <section className="mt-8 rounded border border-cfl-gold/20 bg-cfl-navy-light/30 p-6">
        <h3 className="font-[family-name:var(--font-bebas-neue)] text-lg tracking-wider text-cfl-white">
          Session notes
        </h3>
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
        <h3 className="font-[family-name:var(--font-bebas-neue)] text-lg tracking-wider text-cfl-gold">
          Skills
        </h3>
        {items.length === 0 ? (
          <p className="mt-3 text-sm text-cfl-gray">No skill details recorded.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-6">
            {Array.from(byCategory.entries()).map(([category, rows]) => (
              <div key={category}>
                <h4 className="text-sm font-medium uppercase tracking-wide text-cfl-gold">
                  {category}
                </h4>
                <ul className="mt-2 flex flex-col gap-3">
                  {rows.map((row) => (
                    <li
                      key={row.id}
                      className={`rounded border bg-cfl-navy-light/20 px-4 py-3 text-sm ${
                        row.focus_next
                          ? "border-cfl-gold/50 ring-1 ring-cfl-gold/25"
                          : "border-cfl-gold/15"
                      }`}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-medium text-cfl-white">
                          {row.skill}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {row.focus_next ? (
                            <span className="rounded border border-cfl-green/50 bg-cfl-green/15 px-2 py-0.5 font-[family-name:var(--font-bebas-neue)] text-[0.62rem] uppercase tracking-wide text-cfl-green">
                              Focus next session
                            </span>
                          ) : null}
                          {row.score != null ? (
                            <span className="text-cfl-gold">
                              Score: {row.score}/10
                            </span>
                          ) : (
                            <span className="text-cfl-gray">
                              Not evaluated this session
                            </span>
                          )}
                        </div>
                      </div>
                      {row.mechanics_notes?.trim() ? (
                        <p className="mt-2 whitespace-pre-wrap text-cfl-gray">
                          {row.mechanics_notes}
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
    </div>
  );
}
