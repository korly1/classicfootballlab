"use client";

import { useState, useTransition } from "react";

import { createImportedEvaluation } from "../actions";
import type { EvaluationImport } from "../schemas/evaluation-import-schema";
import { RichEvaluationReport } from "./rich-evaluation-report";

function formatSessionDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type Props = {
  playerId: string;
  playerName: string;
  data: EvaluationImport;
};

export function RichImportPreview({ playerId, playerName, data }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const rich = data.rich_report;
  if (!rich) return null;

  return (
    <div className="mt-8 space-y-6">
      <RichEvaluationReport
        playerName={playerName}
        sessionDateFormatted={formatSessionDate(data.session_date)}
        overallNotes={data.overall_notes}
        developmentPlan={data.development_plan}
        rich={rich}
      />

      {serverError ? (
        <p
          className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
          role="alert"
        >
          {serverError}
        </p>
      ) : null}

      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setServerError(null);
          startTransition(async () => {
            const result = await createImportedEvaluation(playerId, data);
            if (result?.error) setServerError(result.error);
          });
        }}
        className="rounded bg-cfl-gold px-6 py-2 font-[family-name:var(--font-bebas-neue)] text-lg tracking-wider text-cfl-navy transition hover:bg-cfl-gold/90 disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Save evaluation draft"}
      </button>
    </div>
  );
}
