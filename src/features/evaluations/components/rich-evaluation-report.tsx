import type { RichReportV1, SkillStage } from "../schemas/rich-report-schema";
import { SKILL_STAGES } from "../schemas/rich-report-schema";

const STAGE_INDEX: Record<SkillStage, number> = {
  identified: 0,
  working: 1,
  showing: 2,
  consistent: 3,
  mastered: 4,
};

const STAGE_LABEL: Record<SkillStage, string> = {
  identified: "Identified",
  working: "Working on it",
  showing: "Showing improvement",
  consistent: "Consistent",
  mastered: "★ Mastered",
};

function stageBadgeClass(stage: SkillStage): string {
  const base =
    "inline-block shrink-0 rounded border px-2 py-0.5 text-[0.62rem] font-[family-name:var(--font-bebas-neue)] uppercase tracking-wide";
  switch (stage) {
    case "identified":
      return `${base} border-white/10 text-white/40`;
    case "working":
      return `${base} border-cfl-gold/30 text-[#c49a35]`;
    case "showing":
      return `${base} border-sky-500/30 text-sky-300`;
    case "consistent":
      return `${base} border-cfl-green/40 text-cfl-green`;
    case "mastered":
      return `${base} border-emerald-400/50 text-emerald-300`;
    default:
      return base;
  }
}

function stageMutedLabelClass(stage: SkillStage): string {
  switch (stage) {
    case "identified":
      return "text-white/40";
    case "working":
      return "text-[#c49a35]";
    case "showing":
      return "text-sky-300";
    case "consistent":
      return "text-cfl-green";
    case "mastered":
      return "text-emerald-300";
    default:
      return "text-cfl-gray";
  }
}

function barFillForStage(stage: SkillStage): { width: string; bg: string } {
  const idx = STAGE_INDEX[stage];
  const pct = ((idx + 1) / 5) * 100;
  const colors = [
    "rgba(255,255,255,0.25)",
    "rgba(212,168,67,0.5)",
    "rgba(55,138,221,0.6)",
    "rgba(76,175,125,0.7)",
    "rgba(92,201,138,0.9)",
  ] as const;
  return { width: `${pct}%`, bg: colors[idx] ?? colors[0] };
}

export type RichEvaluationReportProps = {
  playerName: string;
  sessionDateFormatted: string;
  overallNotes: string | null | undefined;
  developmentPlan?: string | null | undefined;
  rich: RichReportV1;
  /** Profile fields from DB (optional; shown when set). */
  playerLevel?: string | null;
  playerClub?: string | null;
  /** When false, hides the header line (e.g. admin page already has a session date editor). */
  showHeaderSessionDate?: boolean;
};

export function RichEvaluationReport({
  playerName,
  sessionDateFormatted,
  overallNotes,
  developmentPlan,
  rich,
  playerLevel,
  playerClub,
  showHeaderSessionDate = true,
}: RichEvaluationReportProps) {
  const levelClubLine = [playerLevel?.trim(), playerClub?.trim()]
    .filter(Boolean)
    .join(" · ");
  const pendingText = Array.isArray(rich.pending_upcoming)
    ? rich.pending_upcoming.join(" · ")
    : (rich.pending_upcoming ?? "");

  return (
    <div className="text-cfl-text-body">
      <div className="border-b border-cfl-gold/15 pb-6">
        <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-white">
          {playerName}
        </h2>
        {showHeaderSessionDate ? (
          <p className="mt-2 text-sm text-cfl-gray">
            Session date: {sessionDateFormatted}
          </p>
        ) : null}
        {levelClubLine ? (
          <p className="mt-1 text-sm text-cfl-gray">{levelClubLine}</p>
        ) : null}
        {rich.player_tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {rich.player_tags.map((tag) => (
              <span
                key={tag}
                className="border border-white/10 px-2 py-0.5 font-[family-name:var(--font-bebas-neue)] text-[0.72rem] tracking-wider text-cfl-gray"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <section className="mt-8">
        <h3 className="border-b border-cfl-gold/15 pb-2 font-[family-name:var(--font-bebas-neue)] text-sm tracking-[0.2em] text-cfl-gold">
          Coach&apos;s note
        </h3>
        <div className="mt-4 border-l-[3px] border-cfl-green bg-cfl-green/10 px-4 py-4">
          {overallNotes?.trim() ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-cfl-white">
              {overallNotes.trim()}
            </p>
          ) : (
            <p className="text-sm text-cfl-gray">—</p>
          )}
          {rich.coach_attribution ? (
            <p className="mt-3 text-xs text-cfl-gray">{rich.coach_attribution}</p>
          ) : null}
        </div>
      </section>

      {developmentPlan?.trim() ? (
        <section className="mt-8 rounded border border-cfl-gold/15 bg-cfl-navy-light/30 p-6">
          <h3 className="font-[family-name:var(--font-bebas-neue)] text-sm tracking-wider text-cfl-white">
            Development plan
          </h3>
          <p className="mt-3 whitespace-pre-wrap text-sm text-cfl-text-body">
            {developmentPlan.trim()}
          </p>
        </section>
      ) : null}

      <section className="mt-10">
        <h3 className="border-b border-cfl-gold/15 pb-2 font-[family-name:var(--font-bebas-neue)] text-sm tracking-[0.2em] text-cfl-gold">
          Session overview
        </h3>
        <div className="mt-4 grid grid-cols-3 gap-px bg-white/10">
          <div className="bg-cfl-navy-light px-4 py-4 text-center">
            <div className="font-[family-name:var(--font-bebas-neue)] text-3xl text-cfl-gold">
              {rich.session_overview.techniques_evaluated}
            </div>
            <div className="mt-1 font-[family-name:var(--font-bebas-neue)] text-[0.68rem] uppercase tracking-wider text-cfl-gray">
              Techniques evaluated
            </div>
          </div>
          <div className="bg-cfl-navy-light px-4 py-4 text-center">
            <div className="font-[family-name:var(--font-bebas-neue)] text-3xl text-cfl-gold">
              {rich.session_overview.mechanics_tracked}
            </div>
            <div className="mt-1 font-[family-name:var(--font-bebas-neue)] text-[0.68rem] uppercase tracking-wider text-cfl-gray">
              Mechanics tracked
            </div>
          </div>
          <div className="bg-cfl-navy-light px-4 py-4 text-center">
            <div className="font-[family-name:var(--font-bebas-neue)] text-3xl text-cfl-green">
              {rich.session_overview.showing_or_above}
            </div>
            <div className="mt-1 font-[family-name:var(--font-bebas-neue)] text-[0.68rem] uppercase tracking-wider text-cfl-gray">
              Showing improvement or above
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h3 className="border-b border-cfl-gold/15 pb-2 font-[family-name:var(--font-bebas-neue)] text-sm tracking-[0.2em] text-cfl-gold">
          Development scale
        </h3>
        <p className="mt-4 text-xs text-cfl-gray">
          Identified → Working on it → Showing improvement → Consistent →
          Mastered
        </p>
      </section>

      <section className="mt-10">
        <h3 className="border-b border-cfl-gold/15 pb-2 font-[family-name:var(--font-bebas-neue)] text-sm tracking-[0.2em] text-cfl-gold">
          Progress at a glance
        </h3>
        <p className="mt-3 font-[family-name:var(--font-bebas-neue)] text-[0.68rem] uppercase tracking-wider text-cfl-gray">
          Overall snapshot
        </p>
        <div className="mt-3 grid grid-cols-5 gap-px bg-white/10">
          {SKILL_STAGES.map((stage) => {
            const key = stage as keyof typeof rich.snapshot_counts;
            const val = rich.snapshot_counts[key];
            return (
              <div key={stage} className="bg-cfl-navy-light px-2 py-3 text-center">
                <div className="font-[family-name:var(--font-bebas-neue)] text-2xl text-cfl-white">
                  {val}
                </div>
                <div className="mt-1 font-[family-name:var(--font-bebas-neue)] text-[0.6rem] uppercase tracking-wider text-cfl-gray">
                  {STAGE_LABEL[stage]}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 font-[family-name:var(--font-bebas-neue)] text-[0.68rem] uppercase tracking-wider text-cfl-gray">
          Progress per technique
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {rich.technique_summary.map((t) => {
            const fill = barFillForStage(t.lowest_stage);
            return (
              <div
                key={`${t.category}-${t.name}`}
                className="flex flex-wrap items-center gap-3 sm:flex-nowrap"
              >
                <div className="min-w-[140px] shrink-0 text-right sm:min-w-[160px]">
                  <span className="text-sm text-cfl-white">{t.name}</span>
                  <span className="mt-0.5 block text-[0.62rem] text-cfl-gray">
                    {t.category}
                  </span>
                </div>
                <div className="h-1.5 min-w-0 flex-1 bg-white/10">
                  <div
                    className="h-full"
                    style={{ width: fill.width, background: fill.bg }}
                  />
                </div>
                <span
                  className={`min-w-[120px] text-[0.62rem] font-light ${stageMutedLabelClass(t.lowest_stage)}`}
                >
                  {STAGE_LABEL[t.lowest_stage]}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h3 className="border-b border-cfl-gold/15 pb-2 font-[family-name:var(--font-bebas-neue)] text-sm tracking-[0.2em] text-cfl-gold">
          Technical evaluation
        </h3>
        <div className="mt-6 flex flex-col gap-10">
          {rich.technical_evaluation.map((cat) => (
            <div key={cat.category}>
              <h4 className="font-[family-name:var(--font-bebas-neue)] text-xs uppercase tracking-[0.2em] text-cfl-gray">
                {cat.category}
              </h4>
              <div className="mt-4 flex flex-col gap-8">
                {cat.techniques.map((tech) => (
                  <div key={tech.name}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-[family-name:var(--font-bebas-neue)] text-lg tracking-wide text-cfl-white">
                        {tech.name}
                      </span>
                      {tech.header_stage ? (
                        <span className={stageBadgeClass(tech.header_stage)}>
                          {STAGE_LABEL[tech.header_stage]}
                        </span>
                      ) : null}
                    </div>
                    <ul className="mt-3 flex flex-col gap-2">
                      {tech.mechanics.map((m) => (
                        <li
                          key={m.name}
                          className="border-l-2 border-white/10 bg-white/[0.02] px-4 py-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <span className="text-sm font-semibold text-cfl-white">
                              {m.name}
                            </span>
                            <span className={stageBadgeClass(m.stage)}>
                              {STAGE_LABEL[m.stage]}
                            </span>
                          </div>
                          <p className="mt-2 text-sm font-light leading-relaxed text-cfl-text-body">
                            {m.description}
                          </p>
                          {m.also_affects && m.also_affects.length > 0 ? (
                            <p className="mt-2 text-xs italic text-cfl-gray">
                              Also affects: {m.also_affects.join(", ")}
                            </p>
                          ) : null}
                          {m.history && m.history.length > 0 ? (
                            <div className="mt-3">
                              <p className="font-[family-name:var(--font-bebas-neue)] text-[0.68rem] uppercase tracking-wider text-cfl-gray">
                                History
                              </p>
                              <ul className="mt-2 space-y-2">
                                {m.history.map((h, i) => (
                                  <li
                                    key={`${h.date}-${i}`}
                                    className="flex gap-3 text-xs"
                                  >
                                    <span className="shrink-0 text-cfl-gray">
                                      {h.date}
                                    </span>
                                    <div>
                                      <p className="text-cfl-text-body">
                                        {h.note}
                                      </p>
                                      {h.change ? (
                                        <p className="mt-0.5 text-cfl-green">
                                          {h.change}
                                        </p>
                                      ) : null}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {pendingText.trim() ? (
        <section className="mt-10 rounded border border-white/10 bg-white/[0.02] p-5">
          <h3 className="font-[family-name:var(--font-bebas-neue)] text-xs tracking-[0.2em] text-cfl-gray">
            Scheduled for upcoming sessions
          </h3>
          <p className="mt-3 whitespace-pre-wrap text-sm font-light leading-relaxed text-cfl-gray">
            {pendingText.trim()}
          </p>
        </section>
      ) : null}
    </div>
  );
}
