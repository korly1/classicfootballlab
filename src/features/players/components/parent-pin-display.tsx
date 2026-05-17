"use client";

import { Eye, EyeOff } from "lucide-react";
import { useCallback, useState, type ReactNode } from "react";

type Props = {
  pin: string;
  title: string;
  footer?: ReactNode;
};

export function ParentPinDisplay({ pin, title, footer }: Props) {
  const [visible, setVisible] = useState(false);
  const [copyDone, setCopyDone] = useState(false);

  const copyPin = useCallback(() => {
    void navigator.clipboard.writeText(pin).then(() => {
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 2000);
    });
  }, [pin]);

  const masked = "\u2022".repeat(pin.length);

  return (
    <div
      className="mt-4 rounded border border-cfl-green/40 bg-cfl-green/10 px-4 py-3"
      role="status"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-cfl-green">
        {title}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <span className="font-mono text-2xl tracking-widest text-cfl-white">
          {visible ? pin : masked}
        </span>
        <button
          type="button"
          className="rounded p-1 text-cfl-gray transition hover:text-cfl-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-cfl-gold/50"
          aria-label={visible ? "Hide PIN" : "Show PIN"}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? (
            <EyeOff className="size-5" aria-hidden />
          ) : (
            <Eye className="size-5" aria-hidden />
          )}
        </button>
        <button
          type="button"
          onClick={copyPin}
          className="rounded border border-cfl-gold/50 px-3 py-1 text-xs font-medium text-cfl-gold transition hover:bg-cfl-gold/10"
        >
          {copyDone ? "Copied" : "Copy PIN"}
        </button>
      </div>
      {footer ? <div className="mt-3">{footer}</div> : null}
    </div>
  );
}
