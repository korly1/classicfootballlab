"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

const inputClassBase =
  "min-w-[12rem] max-w-full rounded border border-cfl-gold/40 bg-cfl-navy-light py-2 text-sm text-cfl-white placeholder:text-cfl-gray focus:border-cfl-gold focus:outline-none";

const btnClass =
  "rounded border border-cfl-gold/40 px-4 py-2 font-[family-name:var(--font-bebas-neue)] text-sm tracking-wider text-cfl-gold uppercase transition hover:border-cfl-gold hover:bg-cfl-gold/10 disabled:cursor-not-allowed disabled:opacity-40";

type PlayerOption = { id: string; full_name: string };

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export function DashboardQuickEval({ players }: { players: PlayerOption[] }) {
  const router = useRouter();
  const inputId = useId();
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const [selected, setSelected] = useState<PlayerOption | null>(null);

  const filtered = players.filter((p) =>
    normalize(p.full_name).includes(normalize(query)),
  );

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const pick = useCallback((p: PlayerOption) => {
    setSelected(p);
    setQuery(p.full_name);
    setOpen(false);
    inputRef.current?.blur();
  }, []);

  const onInputChange = (v: string) => {
    setQuery(v);
    setHighlight(0);
    setOpen(true);
    if (!selected || normalize(v) !== normalize(selected.full_name)) {
      setSelected(null);
    }
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      if (filtered.length === 0) return;
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      if (filtered.length === 0) return;
      setHighlight((h) => Math.max(h - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      if (!open || filtered.length === 0) return;
      e.preventDefault();
      const p = filtered[highlight] ?? filtered[0];
      if (p) pick(p);
    }
  };

  const playerId = selected?.id ?? "";

  const goManual = () => {
    if (!playerId) return;
    router.push(`/admin/players/${playerId}/evaluations/new`);
  };

  const goImport = () => {
    if (!playerId) return;
    router.push(`/admin/players/${playerId}/evaluations/import`);
  };

  const showClear = query.length > 0 || selected != null;

  const clearSearch = useCallback(() => {
    setQuery("");
    setSelected(null);
    setHighlight(0);
    setOpen(true);
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <div ref={containerRef} className="relative min-w-[12rem] max-w-full flex-1 sm:max-w-xs">
        <label className="sr-only" htmlFor={inputId}>
          Search player for new evaluation
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              open && filtered[highlight]
                ? `${listId}-option-${filtered[highlight].id}`
                : undefined
            }
            autoComplete="off"
            placeholder="Search player…"
            className={`${inputClassBase} w-full ${showClear ? "pl-3 pr-9" : "px-3"}`}
            value={query}
            onChange={(e) => onInputChange(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={onInputKeyDown}
          />
          {showClear ? (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 text-cfl-gray transition hover:bg-cfl-gold/10 hover:text-cfl-white"
              onMouseDown={(e) => e.preventDefault()}
              onClick={clearSearch}
            >
              <X className="size-4" strokeWidth={2} aria-hidden />
            </button>
          ) : null}
        </div>
        {open ? (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded border border-cfl-gold/30 bg-cfl-navy-light py-1 shadow-lg"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-cfl-gray" role="presentation">
                No matching players
              </li>
            ) : (
              filtered.map((p, i) => (
                <li
                  key={p.id}
                  id={`${listId}-option-${p.id}`}
                  role="option"
                  aria-selected={i === highlight}
                  className={`cursor-pointer px-3 py-2 text-sm text-cfl-white ${
                    i === highlight ? "bg-cfl-gold/15" : "hover:bg-cfl-gold/10"
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => pick(p)}
                >
                  {p.full_name}
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
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
