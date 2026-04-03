export default async function ImportEvaluationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-gold">
        Import evaluation
      </h1>
      <p className="mt-2 text-cfl-gray">Player ID: {id}</p>
    </div>
  );
}
