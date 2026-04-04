import { ReportPinForm } from "@/features/report/components/report-pin-form";
import { createAdminClient } from "@/lib/supabase/admin";

const REPORT_UNAVAILABLE =
  "This report is not currently available." as const;

export default async function ReportPinPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const admin = createAdminClient();
  const { data: access } = await admin
    .from("players")
    .select("id, share_enabled")
    .eq("share_token", token)
    .maybeSingle();

  const pinAllowed = access != null && access.share_enabled === true;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cfl-navy px-6 py-12">
      <h1 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-gold">
        Player report
      </h1>
      {pinAllowed ? (
        <>
          <p className="max-w-md text-center text-sm text-cfl-gray">
            Enter the PIN your coach shared with you to view the latest
            published evaluation.
          </p>
          <ReportPinForm token={token} />
        </>
      ) : (
        <p
          className="max-w-md text-center text-sm text-cfl-gray"
          role="status"
        >
          {REPORT_UNAVAILABLE}
        </p>
      )}
    </main>
  );
}
