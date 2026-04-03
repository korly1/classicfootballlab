import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRoundX } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { createClient } from "@/lib/supabase/server";

export default async function NotACoachPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: coach } = await supabase
    .from("coaches")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (coach) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-lg border border-cfl-gold/20 bg-cfl-navy-light/40 px-8 py-12 text-center">
        <div
          className="flex size-16 items-center justify-center rounded-full border border-cfl-gold/30 bg-cfl-navy text-cfl-gold"
          aria-hidden
        >
          <UserRoundX className="size-8" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-[0.15em] text-cfl-white">
            No coach access
          </h1>
          <p className="text-sm leading-relaxed text-cfl-gray">
            This account is not registered as a CFL coach. Contact the site
            owner.
          </p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <LogoutButton className="mt-0 text-center" />
          <Link
            href="/"
            className="text-center text-sm text-cfl-gold underline-offset-4 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
