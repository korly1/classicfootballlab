"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { verifyReportPin } from "../actions";

type Props = { token: string };

export function ReportPinForm({ token }: Props) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPin, setShowPin] = useState(false);

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setPending(true);
        try {
          const result = await verifyReportPin(token, pin);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          router.push(`/report/${token}/view`);
          router.refresh();
        } finally {
          setPending(false);
        }
      }}
    >
      <label className="flex flex-col gap-1 text-left text-sm text-cfl-gray">
        PIN
        <div className="relative w-full">
          <input
            name="pin"
            type={showPin ? "text" : "password"}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            className="w-full rounded border border-cfl-gold/30 bg-cfl-navy-light py-2 pl-3 pr-10 text-cfl-white placeholder:text-cfl-gray/60 focus:border-cfl-gold focus:outline-none"
            placeholder="4–6 digits"
            required
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-cfl-gray transition hover:text-cfl-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-cfl-gold/50"
            aria-label={showPin ? "Hide PIN" : "Show PIN"}
            aria-pressed={showPin}
            onClick={() => setShowPin((v) => !v)}
          >
            {showPin ? (
              <EyeOff className="size-5" aria-hidden />
            ) : (
              <Eye className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </label>
      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-cfl-gold px-4 py-2 font-medium text-cfl-navy transition hover:bg-cfl-gold/90 disabled:opacity-50"
      >
        {pending ? "Checking…" : "View report"}
      </button>
    </form>
  );
}
