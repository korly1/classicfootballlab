export default async function ReportPinPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-gold">
        Enter PIN
      </h1>
      <p className="text-cfl-gray">Token: {token}</p>
      <p className="max-w-md text-center text-cfl-text-body">
        PIN gate and session cookie — to be implemented per auth-and-roles.md.
      </p>
    </main>
  );
}
