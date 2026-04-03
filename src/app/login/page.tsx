import { Suspense } from "react";
import { redirect } from "next/navigation";

import { sanitizeAdminRedirect } from "@/lib/auth/sanitize-redirect";
import { createClient } from "@/lib/supabase/server";

import { LoginForm } from "./login-form";

type SearchParams = {
  redirectTo?: string | string[];
  reason?: string | string[];
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  if (sp.reason === "not_a_coach") {
    redirect("/login/not-a-coach");
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: coach } = await supabase
      .from("coaches")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (coach) {
      const raw =
        typeof sp.redirectTo === "string" ? sp.redirectTo : undefined;
      redirect(sanitizeAdminRedirect(raw));
    }
    redirect("/login/not-a-coach");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-[0.2em] text-cfl-white">
        Coach login
      </h1>
      <p className="max-w-md text-center text-sm text-cfl-gray">
        Sign in with your CFL coach account. The admin area is only available
        to registered coaches.
      </p>
      <Suspense
        fallback={
          <div className="h-40 w-full max-w-sm animate-pulse rounded bg-cfl-navy-light/50" />
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
