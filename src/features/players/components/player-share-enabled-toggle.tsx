"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import { setPlayerShareEnabled } from "../actions";

type Props = {
  playerId: string;
  initialEnabled: boolean;
  /** Called when a new plain-text PIN is generated (enable or reset elsewhere). */
  onPinKnown?: (pin: string) => void;
};

export function PlayerShareEnabledToggle({
  playerId,
  initialEnabled,
  onPinKnown,
}: Props) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initialEnabled);
  const [shownPin, setShownPin] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onToggle = useCallback(
    (next: boolean) => {
      setError(null);
      setCopyDone(false);
      const previous = enabled;
      setEnabled(next);
      if (!next) {
        setShownPin(null);
      }
      startTransition(async () => {
        const result = await setPlayerShareEnabled(playerId, next);
        if (!result.ok) {
          setEnabled(previous);
          if (!next) {
            setShownPin(null);
          }
          setError(result.error);
          return;
        }
        if (result.shareEnabled) {
          setShownPin(result.parentPin);
          onPinKnown?.(result.parentPin);
        } else {
          setShownPin(null);
        }
        router.refresh();
      });
    },
    [enabled, onPinKnown, playerId, router],
  );

  const copyPin = useCallback(() => {
    if (!shownPin) return;
    void navigator.clipboard.writeText(shownPin).then(() => {
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 2000);
    });
  }, [shownPin]);

  return (
    <div className="mt-4 rounded border border-cfl-gold/15 bg-cfl-navy-light/20 px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex shrink-0 items-center gap-2.5 sm:pt-0.5">
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label={enabled ? "Sharing on" : "Sharing off"}
            aria-busy={pending}
            disabled={pending}
            onClick={() => onToggle(!enabled)}
            className={`relative h-9 w-[3.25rem] shrink-0 rounded-full border-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cfl-navy-light disabled:opacity-50 ${
              enabled
                ? "border-cfl-green/70 bg-cfl-green/25 focus-visible:ring-cfl-green"
                : "border-zinc-500/60 bg-zinc-900/80 focus-visible:ring-zinc-400"
            }`}
          >
            <span
              className={`absolute top-1 left-1 size-7 rounded-full shadow-md transition-all duration-200 ease-out ${
                enabled
                  ? "translate-x-4 bg-cfl-gold ring-2 ring-cfl-green/40"
                  : "translate-x-0 bg-zinc-500 ring-0"
              }`}
              aria-hidden
            />
          </button>
          <span
            className={`min-w-[2rem] text-xs font-bold uppercase tracking-wider ${
              enabled ? "text-cfl-green" : "text-zinc-500"
            }`}
          >
            {enabled ? "On" : "Off"}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-cfl-white">
            Parent report link
          </p>
          <p className="mt-1 text-sm text-cfl-gray">
            When off, parents see &quot;This report is not currently
            available.&quot; When on, they enter the PIN shown here (once per
            enable) to open published evaluations.
          </p>
        </div>
      </div>

      {shownPin ? (
        <div
          className="mt-4 rounded border border-cfl-green/40 bg-cfl-green/10 px-4 py-3"
          role="status"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-cfl-green">
            Parent PIN — copy and share (stored hashed only)
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="font-mono text-2xl tracking-widest text-cfl-white">
              {shownPin}
            </span>
            <button
              type="button"
              onClick={copyPin}
              className="rounded border border-cfl-gold/50 px-3 py-1 text-xs font-medium text-cfl-gold transition hover:bg-cfl-gold/10"
            >
              {copyDone ? "Copied" : "Copy PIN"}
            </button>
          </div>
        </div>
      ) : enabled ? (
        <p className="mt-3 text-xs text-cfl-gray">
          Sharing is on. The PIN is not shown again for security — use{" "}
          <strong>Issue new PIN</strong> on the share page if you need to send
          it to the parent (the old PIN will stop working).
        </p>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
