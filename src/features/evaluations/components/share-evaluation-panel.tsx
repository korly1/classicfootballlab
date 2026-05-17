"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { buildParentShareMessage } from "@/features/evaluations/lib/share-message";
import { PlayerShareEnabledToggle } from "@/features/players/components/player-share-enabled-toggle";
import { formatCalendarDateShort } from "@/lib/format-calendar-date";

type Props = {
  playerId: string;
  evalId: string;
  playerName: string;
  parentName: string | null;
  parentEmail: string | null;
  parentPhone: string | null;
  sessionDate: string;
  sessionNumber: number;
  shareEnabled: boolean;
  shareUrl: string | null;
  isPublished: boolean;
};

export function ShareEvaluationPanel(props: Props) {
  const {
    playerId,
    evalId,
    playerName,
    parentName,
    parentEmail,
    parentPhone,
    sessionDate,
    sessionNumber,
    shareEnabled,
    shareUrl,
    isPublished,
  } = props;

  const [copyLinkDone, setCopyLinkDone] = useState(false);
  const [copyMessageDone, setCopyMessageDone] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const sessionLabel = formatCalendarDateShort(sessionDate);

  const message =
    shareUrl != null
      ? buildParentShareMessage({
          parentName,
          playerName,
          sessionDate,
          shareUrl,
        })
      : null;

  const copyText = useCallback(async (text: string, which: "link" | "message") => {
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(text);
      if (which === "link") {
        setCopyLinkDone(true);
        window.setTimeout(() => setCopyLinkDone(false), 2000);
      } else {
        setCopyMessageDone(true);
        window.setTimeout(() => setCopyMessageDone(false), 2000);
      }
    } catch {
      setCopyError("Could not copy. Select the text and copy manually.");
    }
  }, []);

  const reportUrlSection =
    shareUrl == null ? (
      <p className="mt-3 text-sm text-amber-200">
        Report link is not available. Check the player profile or contact support.
      </p>
    ) : (
      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-cfl-gray">
          Report URL
        </p>
        <p className="mt-1 break-all font-mono text-sm text-cfl-gold">{shareUrl}</p>
        <button
          type="button"
          disabled={!shareEnabled}
          className="mt-3 rounded border border-cfl-gold/50 px-4 py-2 text-sm font-medium text-cfl-gold transition hover:bg-cfl-gold/10 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => void copyText(shareUrl, "link")}
        >
          {copyLinkDone ? "Link copied" : "Copy report link"}
        </button>
        {!shareEnabled ? (
          <p className="mt-2 text-xs text-amber-200">
            Enable parent report link above before sharing the URL.
          </p>
        ) : null}
      </div>
    );

  return (
    <div className="mt-8 space-y-8">
      {!isPublished ? (
        <p
          className="rounded border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
          role="status"
        >
          This evaluation is still a draft. Go back and use{" "}
          <strong>Share with parent</strong> on the evaluation page to publish it first.
        </p>
      ) : null}

      <section className="rounded border border-cfl-gold/20 bg-cfl-navy-light/30 p-6">
        <h2 className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-wider text-cfl-white">
          Session
        </h2>
        <p className="mt-2 text-sm text-cfl-gray">
          <span className="text-cfl-white">{playerName}</span>
          {" · "}
          Session {sessionNumber}
          {" · "}
          {sessionLabel}
        </p>
      </section>

      <section className="rounded border border-cfl-gold/20 bg-cfl-navy-light/30 p-6">
        <h2 className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-wider text-cfl-white">
          Parent access
        </h2>
        <p className="mt-2 text-sm text-cfl-gray">
          Turn on the report link and copy the PIN when you enable it. Parents use the same
          link for every published evaluation.
        </p>
        <PlayerShareEnabledToggle playerId={playerId} initialEnabled={shareEnabled} />
        {reportUrlSection}
      </section>

      <section className="rounded border border-cfl-gold/20 bg-cfl-navy-light/30 p-6">
        <h2 className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-wider text-cfl-white">
          Send to parent
        </h2>
        <p className="mt-2 text-sm text-cfl-gray">
          Email and SMS from the app are not wired up yet. Copy the message below and send
          it by text, WhatsApp, or email.
        </p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <ContactRow label="Parent name" value={parentName} />
          <ContactRow label="Email" value={parentEmail} />
          <ContactRow label="Phone" value={parentPhone} />
        </dl>
        {message ? (
          <MessageBlock
            message={message}
            copyMessageDone={copyMessageDone}
            onCopy={() => void copyText(message, "message")}
          />
        ) : null}
        {copyError ? (
          <p className="mt-3 text-sm text-red-300" role="alert">
            {copyError}
          </p>
        ) : null}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/admin/players/${playerId}/evaluations/${evalId}`}
          className="rounded border border-cfl-gold/40 px-4 py-2 text-sm text-cfl-gold transition hover:border-cfl-gold"
        >
          ← Back to evaluation
        </Link>
        <Link
          href={`/admin/players/${playerId}`}
          className="text-sm text-cfl-gray transition hover:text-cfl-gold"
        >
          Player profile
        </Link>
      </div>
    </div>
  );
}

function ContactRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-cfl-gray">{label}</dt>
      <dd className="text-cfl-white">{value?.trim() || "—"}</dd>
    </div>
  );
}

function MessageBlock({
  message,
  copyMessageDone,
  onCopy,
}: {
  message: string;
  copyMessageDone: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="mt-4">
      <p className="text-xs font-medium uppercase tracking-wide text-cfl-gray">
        Message preview
      </p>
      <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded border border-cfl-gold/15 bg-cfl-navy/60 p-4 text-sm leading-relaxed text-cfl-white">
        {message}
      </pre>
      <button
        type="button"
        className="mt-3 rounded bg-cfl-gold px-4 py-2 text-sm font-medium text-cfl-navy transition hover:bg-cfl-gold/90"
        onClick={onCopy}
      >
        {copyMessageDone ? "Message copied" : "Copy message for parent"}
      </button>
    </div>
  );
}
