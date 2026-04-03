"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

type Props = {
  playerId: string;
  evalId: string;
  shareHref: string;
  initialShareModal: boolean;
  children: ReactNode;
};

export function EvaluationDetailShell({
  playerId,
  evalId,
  shareHref,
  initialShareModal,
  children,
}: Props) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(initialShareModal);
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    if (!initialShareModal) return;
    const path = `/admin/players/${playerId}/evaluations/${evalId}`;
    window.history.replaceState(null, "", path);
  }, [initialShareModal, playerId, evalId]);

  return (
    <div>
      {modalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="presentation"
        >
          <div
            className="max-w-md rounded-lg border border-cfl-gold/30 bg-cfl-navy-light p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-eval-title"
          >
            <h2
              id="share-eval-title"
              className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-wider text-cfl-gold"
            >
              Share evaluation
            </h2>
            <p className="mt-3 text-sm text-cfl-gray">
              This evaluation is ready. Share it with the parent?
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded bg-cfl-gold px-4 py-2 text-sm font-medium text-cfl-navy transition hover:bg-cfl-gold/90"
                onClick={() => {
                  setModalOpen(false);
                  router.push(shareHref);
                }}
              >
                Share
              </button>
              <button
                type="button"
                className="rounded border border-cfl-gold/40 px-4 py-2 text-sm text-cfl-gold transition hover:border-cfl-gold"
                onClick={() => {
                  setModalOpen(false);
                  setBannerVisible(true);
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {bannerVisible ? (
        <div className="mb-6 flex flex-col gap-3 rounded border border-amber-400/40 bg-amber-500/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-100">
            This evaluation has not been shared yet.
          </p>
          <Link
            href={shareHref}
            className="inline-flex shrink-0 justify-center rounded border border-amber-400/60 px-4 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-500/20"
          >
            Share with parent
          </Link>
        </div>
      ) : null}

      {children}
    </div>
  );
}
