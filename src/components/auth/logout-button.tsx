"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => void signOut()}
      className={cn(
        "mt-4 w-full rounded border border-cfl-gold/40 px-3 py-2 text-left text-sm text-cfl-gray transition hover:border-cfl-gold hover:text-cfl-white disabled:opacity-50",
        className,
      )}
    >
      {pending ? "Signing out…" : "Log out"}
    </button>
  );
}
