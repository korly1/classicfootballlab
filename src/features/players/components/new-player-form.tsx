"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { createPlayer } from "../actions";
import { PlayerFormFields } from "./player-form-fields";
import {
  playerFormSchema,
  type PlayerFormValues,
} from "../schemas/player-form-schema";

const emptyDefaults: PlayerFormValues = {
  full_name: "",
  birth_year: "",
  club: "",
  level: "",
  parent_name: "",
  parent_phone: "",
  parent_email: "",
  notes: "",
};

export function NewPlayerForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const methods = useForm<PlayerFormValues>({
    defaultValues: emptyDefaults,
  });

  const { handleSubmit, setError } = methods;

  return (
    <FormProvider {...methods}>
      <form
        className="mt-8 flex max-w-xl flex-col gap-6"
        noValidate
        onSubmit={handleSubmit((raw) => {
          setServerError(null);
          const parsed = playerFormSchema.safeParse(raw);
          if (!parsed.success) {
            for (const issue of parsed.error.issues) {
              const key = issue.path[0];
              if (
                typeof key === "string" &&
                key in emptyDefaults &&
                key !== "full_name"
              ) {
                setError(key as keyof PlayerFormValues, { message: issue.message });
              }
            }
            const nameIssue = parsed.error.issues.find(
              (i) => i.path[0] === "full_name",
            );
            if (nameIssue) {
              setError("full_name", { message: nameIssue.message });
            }
            return;
          }
          startTransition(async () => {
            const result = await createPlayer(parsed.data);
            if (result?.error) {
              setServerError(result.error);
            }
          });
        })}
      >
        <PlayerFormFields />
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
            {isPending ? "Saving…" : "Create player"}
          </button>
          <Link
            href="/admin"
            className="rounded border border-cfl-gold/40 px-6 py-2 font-[family-name:var(--font-bebas-neue)] text-lg tracking-wider text-cfl-gold transition hover:border-cfl-gold"
          >
            Cancel
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
