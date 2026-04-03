import { redirect } from "next/navigation";

import { AdminNav } from "@/components/layout/admin-nav";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: coach, error } = await supabase
    .from("coaches")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !coach) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-52 shrink-0">
        <AdminNav coachFullName={coach.full_name} />
      </aside>
      <div className="min-w-0 flex-1 p-6 text-cfl-white">{children}</div>
    </div>
  );
}
