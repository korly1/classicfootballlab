"use client";

import { useState, useTransition } from "react";
import { twMerge } from "tailwind-merge";

import { reactivatePlayer } from "../actions";

const defaultBtnClass =
  "rounded border border-cfl-gold/40 px-3 py-1 text-sm text-cfl-gold transition hover:border-cfl-gold disabled:opacity-50";

export function ReactivatePlayerButton({
  playerId,
  className,
}: {
  playerId: string;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={isPending}
        className={twMerge(defaultBtnClass, className)}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await reactivatePlayer(playerId);
            if (result?.error) {
              setError(result.error);
            }
          });
        }}
      >
        {isPending ? "Reactivating…" : "Reactivate"}
      </button>
      {error ? (
        <p className="max-w-[12rem] text-right text-xs text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
