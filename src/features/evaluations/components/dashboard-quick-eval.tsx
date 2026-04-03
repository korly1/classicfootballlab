"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const selectClass =
  "min-w-[12rem] max-w-full rounded border border-cfl-gold/40 bg-cfl-navy-light px-3 py-2 text-sm text-cfl-white focus:border-cfl-gold focus:outline-none";

const btnClass =
  "rounded border border-cfl-gold/40 px-4 py-2 font-[family-name:var(--font-bebas-neue)] text-sm tracking-wider text-cfl-gold uppercase transition hover:border-cfl-gold hover:bg-cfl-gold/10 disabled:cursor-not-allowed disabled:opacity-40";

type PlayerOption = { id: string; full_name: string };

export function DashboardQuickEval({ players }: { players: PlayerOption[] }) {
  const router = useRouter();
  const [playerId, setPlayerId] = useState("");

  const goManual = () => {
    if (!playerId) return;
    router.push(`/admin/players/${playerId}/evaluations/new`);
  };

  const goImport = () => {
    if (!playerId) return;
    router.push(`/admin/players/${playerId}/evaluations/import`);
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <label className="sr-only" htmlFor="dashboard-quick-eval-player">
        Player for new evaluation
      </label>
      <select
        id="dashboard-quick-eval-player"
        className={selectClass}
        value={playerId}
        onChange={(e) => setPlayerId(e.target.value)}
      >
        <option value="">Choose player…</option>
        {players.map((p) => (
          <option key={p.id} value={p.id}>
            {p.full_name}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnClass}
          disabled={!playerId}
          onClick={goManual}
        >
          Evaluate
        </button>
        <button
          type="button"
          className={btnClass}
          disabled={!playerId}
          onClick={goImport}
        >
          Import
        </button>
      </div>
    </div>
  );
}
