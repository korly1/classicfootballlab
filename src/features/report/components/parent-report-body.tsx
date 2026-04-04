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
  evaluation: EvalRow;
  items: ItemRow[];
};

export function ParentReportBody({ playerName, evaluation, items }: Props) {
  const rich =
    evaluation.rich_report != null
      ? parseRichReportV1(evaluation.rich_report)
      : null;

  if (rich) {
    return (
      <RichEvaluationReport
        playerName={playerName}
        sessionDateFormatted={formatSessionDate(evaluation.session_date)}
        overallNotes={evaluation.overall_notes}
        developmentPlan={evaluation.development_plan}
        rich={rich}
      />
    );
  }

  const byCategory = groupItemsByCategory(items);

  return (
    <div className="text-cfl-text-body">
      <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-white">
        {playerName}
      </h2>
      <p className="mt-2 text-sm text-cfl-gray">
        Session {evaluation.session_number} ·{" "}
        {formatSessionDate(evaluation.session_date)}
      </p>

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
                          <span className="text-cfl-gray">Not evaluated</span>
                        )}
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
