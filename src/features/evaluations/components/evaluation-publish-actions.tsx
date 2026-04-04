"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { publishEvaluation } from "../actions";

type PublishThenShareProps = {
  playerId: string;
  evalId: string;
  shareHref: string;
  className: string;
  children: React.ReactNode;
  /** Called after a successful publish, before navigating (e.g. close a modal). */
  onBeforeNavigate?: () => void;
};

/** Publishes the evaluation (parent can see it on /report) then navigates to share. */
export function PublishThenShareButton({
  playerId,
  evalId,
  shareHref,
  className,
  children,
  onBeforeNavigate,
}: PublishThenShareProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <button
        type="button"
        disabled={pending}
        className={className}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await publishEvaluation(playerId, evalId);
            if (result?.error) {
              setError(result.error);
              return;
            }
            onBeforeNavigate?.();
            router.push(shareHref);
          });
        }}
      >
        {pending ? "Publishing…" : children}
      </button>
      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type PublishOnlyProps = {
  playerId: string;
  evalId: string;
  className: string;
  children: React.ReactNode;
};

/** Publishes without navigating (refreshes the current page). */
export function PublishDraftButton({
  playerId,
  evalId,
  className,
  children,
}: PublishOnlyProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={pending}
        className={className}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await publishEvaluation(playerId, evalId);
            if (result?.error) {
              setError(result.error);
              return;
            }
            router.refresh();
          });
        }}
      >
        {pending ? "Publishing…" : children}
      </button>
      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
