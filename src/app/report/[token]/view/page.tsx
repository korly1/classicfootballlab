export default async function ReportViewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <main className="min-h-screen p-8 text-cfl-text-body">
      <h1 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-gold">
        Evaluation report
      </h1>
      <p className="mt-2 text-cfl-gray">Token: {token}</p>
    </main>
  );
}
