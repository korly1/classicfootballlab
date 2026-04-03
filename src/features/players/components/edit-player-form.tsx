"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";

import type { Tables } from "@/lib/supabase/database.types";

import { updatePlayer } from "../actions";
import { playerRowToFormDefaults } from "../lib/player-form-defaults";
import { PlayerFormFields } from "./player-form-fields";
import {
  playerFormSchema,
  type PlayerFormValues,
} from "../schemas/player-form-schema";

type PlayerRow = Tables<"players">;

export function EditPlayerForm({ player }: { player: PlayerRow }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const methods = useForm<PlayerFormValues>({
    defaultValues: playerRowToFormDefaults(player),
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
              if (typeof key === "string") {
                setError(key as keyof PlayerFormValues, { message: issue.message });
              }
            }
            return;
          }
          startTransition(async () => {
            const result = await updatePlayer(player.id, parsed.data);
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
            {isPending ? "Saving…" : "Save changes"}
          </button>
          <Link
            href={`/admin/players/${player.id}`}
            className="rounded border border-cfl-gold/40 px-6 py-2 font-[family-name:var(--font-bebas-neue)] text-lg tracking-wider text-cfl-gold transition hover:border-cfl-gold"
          >
            Cancel
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
