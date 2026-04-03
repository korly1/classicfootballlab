import Link from "next/link";

import { NewPlayerForm } from "@/features/players/components/new-player-form";

export default function NewPlayerPage() {
  return (
    <div>
      <Link
        href="/admin"
        className="text-sm text-cfl-gray transition hover:text-cfl-gold"
      >
        ← Back to players
      </Link>
      <h1 className="mt-4 font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-gold">
        New player
      </h1>
      <p className="mt-2 text-sm text-cfl-gray">
        Add a player profile. A share link for parents is created automatically.
      </p>
      <NewPlayerForm />
    </div>
  );
}
