"use client";

import { useState, useTransition } from "react";

import { deactivatePlayer } from "../actions";

export function DeactivatePlayerButton({ playerId }: { playerId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={isPending}
        className="rounded border border-red-500/50 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
        onClick={() => {
          setError(null);
          if (
            !window.confirm(
              "Deactivate this player? They will be hidden from the default list; data is kept.",
            )
          ) {
            return;
          }
          startTransition(async () => {
            const result = await deactivatePlayer(playerId);
            if (result?.error) {
              setError(result.error);
            }
          });
        }}
      >
        {isPending ? "Deactivating…" : "Deactivate player"}
      </button>
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
