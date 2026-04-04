"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { SKILL_CATEGORIES } from "@/constants/evaluation-skills";

const FLAT_SKILLS = SKILL_CATEGORIES.flatMap((c) =>
  c.skills.map((skill) => ({ category: c.category, skill })),
);

const SKILL_INDEX = new Map(
  FLAT_SKILLS.map((entry, i) => [
    `${entry.category}\0${entry.skill}`,
    i,
  ]),
);

import { createManualEvaluation } from "../actions";
import {
  manualEvaluationFormSchema,
  type ManualEvaluationFormValues,
} from "../schemas/manual-evaluation-schema";

const inputClass =
  "rounded border border-cfl-gold/30 bg-cfl-navy-light px-3 py-2 text-cfl-white placeholder:text-cfl-gray/60 focus:border-cfl-gold focus:outline-none";

const labelClass = "text-sm text-cfl-gray";

type Props = {
  playerId: string;
  playerName: string;
  defaultValues: ManualEvaluationFormValues;
  /** Shown under the player line (e.g. JSON import source name). */
  previewHint?: string;
  submitLabel?: string;
};

export function NewEvaluationForm({
  playerId,
  playerName,
  defaultValues,
  previewHint,
  submitLabel = "Save draft",
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const methods = useForm<ManualEvaluationFormValues>({
    defaultValues,
  });

  const { handleSubmit, register, setError } = methods;

  return (
    <FormProvider {...methods}>
      <form
        className="mt-8 flex max-w-4xl flex-col gap-8"
        noValidate
        onSubmit={handleSubmit((raw) => {
          setServerError(null);
          const parsed = manualEvaluationFormSchema.safeParse(raw);
          if (!parsed.success) {
            for (const issue of parsed.error.issues) {
              const path = issue.path;
              if (path[0] === "skillRows" && typeof path[1] === "number") {
                const idx = path[1];
                const field = path[2];
                if (field === "score" || field === "skill") {
                  setError(`skillRows.${idx}.${field}` as const, {
                    message: issue.message,
                  });
                }
              } else if (path[0] === "session_date") {
                setError("session_date", { message: issue.message });
              } else if (path[0] === "session_number") {
                setError("session_number", { message: issue.message });
              } else if (path[0] === "skillRows") {
                setError("skillRows", { message: issue.message });
              }
            }
            return;
          }
          startTransition(async () => {
            const result = await createManualEvaluation(playerId, parsed.data);
            if (result?.error) {
              setServerError(result.error);
            }
          });
        })}
      >
        <p className="text-sm text-cfl-gray">
          Player:{" "}
          <span className="text-cfl-white">{playerName}</span>
        </p>
        {previewHint ? (
          <p className="text-sm text-cfl-gray">{previewHint}</p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className={labelClass} htmlFor="session_date">
              Session date <span className="text-red-400">*</span>
            </label>
            <input
              id="session_date"
              type="date"
              className={inputClass}
              {...register("session_date")}
            />
            {methods.formState.errors.session_date ? (
              <p className="text-sm text-red-400">
                {methods.formState.errors.session_date.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass} htmlFor="session_number">
              Session number <span className="text-red-400">*</span>
            </label>
            <input
              id="session_number"
              type="number"
              inputMode="numeric"
              min={1}
              className={inputClass}
              {...register("session_number", { valueAsNumber: true })}
            />
            {methods.formState.errors.session_number ? (
              <p className="text-sm text-red-400">
                {methods.formState.errors.session_number.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="overall_notes">
            Overall notes
          </label>
          <textarea
            id="overall_notes"
            rows={4}
            className={`${inputClass} resize-y`}
            {...register("overall_notes")}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="development_plan">
            Development plan
          </label>
          <textarea
            id="development_plan"
            rows={4}
            className={`${inputClass} resize-y`}
            {...register("development_plan")}
          />
        </div>

        <div className="border-t border-cfl-gold/20 pt-6">
          <h2 className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-wider text-cfl-gold">
            Skills
          </h2>
          <p className="mt-1 text-sm text-cfl-gray">
            Score (1–10) and mechanics notes are optional per skill. Leave both
            blank to skip. Focus marks the skill for next session.
          </p>

          <div className="mt-6 flex flex-col gap-8">
            {SKILL_CATEGORIES.map((cat) => (
              <section key={cat.category}>
                <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-cfl-gold">
                  {cat.category}
                </h3>
                <div className="flex flex-col gap-4">
                  {cat.skills.map((skill) => {
                    const i = SKILL_INDEX.get(`${cat.category}\0${skill}`);
                    if (i === undefined) return null;
                    const base = `skillRows.${i}` as const;
                    return (
                      <div
                        key={`${cat.category}-${skill}`}
                        className="rounded border border-cfl-gold/15 bg-cfl-navy-light/20 p-4"
                      >
                        <p className="text-sm font-medium text-cfl-white">
                          {skill}
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,7rem)_1fr] sm:items-start">
                          <div className="flex flex-col gap-1">
                            <label
                              className={labelClass}
                              htmlFor={`${base}.score`}
                            >
                              Score (1–10)
                            </label>
                            <input
                              id={`${base}.score`}
                              type="text"
                              inputMode="numeric"
                              placeholder="1–10"
                              className={inputClass}
                              {...register(`${base}.score`)}
                            />
                            {methods.formState.errors.skillRows?.[i]?.score ? (
                              <p className="text-sm text-red-400">
                                {
                                  methods.formState.errors.skillRows[i]?.score
                                    ?.message
                                }
                              </p>
                            ) : null}
                          </div>
                          <div className="flex flex-col gap-1">
                            <label
                              className={labelClass}
                              htmlFor={`${base}.mechanics_notes`}
                            >
                              Mechanics notes
                            </label>
                            <textarea
                              id={`${base}.mechanics_notes`}
                              rows={2}
                              className={`${inputClass} resize-y`}
                              {...register(`${base}.mechanics_notes`)}
                            />
                          </div>
                        </div>
                        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-cfl-gray">
                          <input
                            type="checkbox"
                            className="size-4 rounded border-cfl-gold/40 bg-cfl-navy-light text-cfl-gold focus:ring-cfl-gold"
                            {...register(`${base}.focus_next`)}
                          />
                          Focus next session
                        </label>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>

        {methods.formState.errors.skillRows &&
        !Array.isArray(methods.formState.errors.skillRows) &&
        methods.formState.errors.skillRows.message ? (
          <p className="text-sm text-red-400" role="alert">
            {methods.formState.errors.skillRows.message}
          </p>
        ) : null}

        {serverError ? (
          <p
            className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
            role="alert"
          >
            {serverError}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-cfl-gold px-6 py-2 font-[family-name:var(--font-bebas-neue)] text-lg tracking-wider text-cfl-navy transition hover:bg-cfl-gold/90 disabled:opacity-50"
          >
            {isPending ? "Saving…" : submitLabel}
          </button>
          <Link
            href={`/admin/players/${playerId}`}
            className="rounded border border-cfl-gold/40 px-6 py-2 font-[family-name:var(--font-bebas-neue)] text-lg tracking-wider text-cfl-gold transition hover:border-cfl-gold"
          >
            Cancel
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
