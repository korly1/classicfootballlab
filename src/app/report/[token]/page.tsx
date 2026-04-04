import { ReportPinForm } from "@/features/report/components/report-pin-form";

export default async function ReportPinPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cfl-navy px-6 py-12">
      <h1 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-gold">
        Player report
      </h1>
      <p className="max-w-md text-center text-sm text-cfl-gray">
        Enter the PIN your coach shared with you to view the latest published
        evaluation.
      </p>
      <ReportPinForm token={token} />
    </main>
  );
}
