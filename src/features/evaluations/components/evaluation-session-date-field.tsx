"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

import { updateEvaluationSessionDate } from "../actions";

type Props = {
  playerId: string;
  evalId: string;
  sessionNumber: number;
  initialSessionDate: string;
};

function sessionDateToInputValue(sessionDate: string): string {
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(sessionDate.trim());
  return m ? m[1] : "";
}

export function EvaluationSessionDateField({
  playerId,
  evalId,
  sessionNumber,
  initialSessionDate,
}: Props) {
  const router = useRouter();
  const [value, setValue] = useState(() =>
    sessionDateToInputValue(initialSessionDate),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setValue(sessionDateToInputValue(initialSessionDate));
  }, [initialSessionDate]);

  const dirty =
    value !== sessionDateToInputValue(initialSessionDate);

  const save = useCallback(() => {
    setError(null);
    startTransition(async () => {
      const result = await updateEvaluationSessionDate(
        playerId,
        evalId,
        value,
      );
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }, [evalId, playerId, router, value]);

  return (
    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-cfl-gray">Session {sessionNumber}</span>
        <span className="text-cfl-gray sm:inline" aria-hidden>
          ·
        </span>
        <label className="sr-only" htmlFor={`session_date_${evalId}`}>
          Session date
        </label>
        <input
          id={`session_date_${evalId}`}
          type="date"
          value={value}
          disabled={pending}
          onChange={(e) => setValue(e.target.value)}
          className="rounded border border-cfl-gold/30 bg-cfl-navy-light/40 px-2 py-1 text-sm text-cfl-white focus:border-cfl-gold focus:outline-none disabled:opacity-50"
        />
        <button
          type="button"
          disabled={pending || !dirty}
          onClick={save}
          className="rounded border border-cfl-gold/50 px-3 py-1 text-xs font-medium text-cfl-gold transition hover:bg-cfl-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save date"}
        </button>
      </div>
      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
