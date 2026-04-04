"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

import { formatCalendarDateShort } from "@/lib/format-calendar-date";

export type DashboardSessionRow = {
  id: string;
  session_date: string;
  session_number: number;
  is_published: boolean;
};

export type DashboardPlayerRow = {
  id: string;
  full_name: string;
  club: string | null;
  level: string | null;
  share_enabled: boolean;
  sessions: DashboardSessionRow[];
};

const rowEvalLinkClass =
  "inline-flex min-h-[2.25rem] flex-1 items-center justify-center rounded border border-cfl-gold/40 px-3 py-2 font-[family-name:var(--font-bebas-neue)] text-xs tracking-wider text-cfl-gold uppercase transition hover:border-cfl-gold hover:bg-cfl-gold/10 sm:flex-initial sm:text-sm";

type Props = {
  items: DashboardPlayerRow[];
};

export function DashboardPlayerAccordionList({ items }: Props) {
  const [open, setOpen] = useState<Set<string>>(() => new Set());

  const toggle = useCallback((id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <ul className="mt-6 flex flex-col gap-2">
      {items.map((p) => {
        const expanded = open.has(p.id);
        const panelId = `player-sessions-${p.id}`;
        return (
          <li
            key={p.id}
            className="rounded border border-cfl-gold/20 bg-cfl-navy-light/30 transition hover:border-cfl-gold/50"
          >
            <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 items-start gap-2">
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => toggle(p.id)}
                  className="mt-0.5 shrink-0 rounded border border-cfl-gold/25 p-1 text-cfl-gold transition hover:border-cfl-gold hover:bg-cfl-gold/10"
                >
                  <ChevronDown
                    className={`size-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                  <span className="sr-only">
                    {expanded ? "Collapse" : "Expand"} sessions for {p.full_name}
                  </span>
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/players/${p.id}`}
                      className="text-cfl-white transition hover:text-cfl-gold"
                    >
                      <span className="font-medium">{p.full_name}</span>
                    </Link>
                    {p.share_enabled ? (
                      <span
                        className="shrink-0 rounded border border-cfl-green/50 px-2 py-0.5 font-[family-name:var(--font-bebas-neue)] text-[0.65rem] tracking-wide text-cfl-green"
                        title="Parent report link is on"
                      >
                        Report shared
                      </span>
                    ) : (
                      <span
                        className="shrink-0 rounded border border-white/15 px-2 py-0.5 font-[family-name:var(--font-bebas-neue)] text-[0.65rem] tracking-wide text-cfl-gray"
                        title="Parent report link is off"
                      >
                        Not shared
                      </span>
                    )}
                  </div>
                  {(p.club || p.level) && (
                    <Link
                      href={`/admin/players/${p.id}`}
                      className="mt-1 block text-sm text-cfl-gray transition hover:text-cfl-gold"
                    >
                      {[p.club, p.level].filter(Boolean).join(" · ")}
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-shrink-0 flex-wrap gap-2 sm:w-auto sm:justify-end">
                <Link
                  href={`/admin/players/${p.id}/evaluations/new`}
                  className={rowEvalLinkClass}
                >
                  New evaluation
                </Link>
                <Link
                  href={`/admin/players/${p.id}/evaluations/import`}
                  className={rowEvalLinkClass}
                >
                  Import
                </Link>
              </div>
            </div>

            {expanded ? (
              <div
                id={panelId}
                className="border-t border-cfl-gold/15 bg-cfl-navy/40 px-4 py-3 pl-11 sm:pl-12"
              >
                {p.sessions.length === 0 ? (
                  <p className="text-sm text-cfl-gray">No recorded sessions yet.</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {p.sessions.map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/admin/players/${p.id}/evaluations/${s.id}`}
                          className="flex flex-wrap items-center justify-between gap-2 rounded border border-transparent px-2 py-1.5 text-sm transition hover:border-cfl-gold/20 hover:bg-cfl-navy-light/30"
                        >
                          <span className="text-cfl-white">
                            Session {s.session_number}
                            <span className="text-cfl-gray">
                              {" "}
                              · {formatCalendarDateShort(s.session_date)}
                            </span>
                          </span>
                          {s.is_published ? (
                            <span className="shrink-0 rounded border border-cfl-green/50 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-cfl-green">
                              Published
                            </span>
                          ) : (
                            <span className="shrink-0 rounded border border-amber-400/50 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-amber-200">
                              Draft
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
