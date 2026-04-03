export default async function EvaluationDetailPage({
  params,
}: {
  params: Promise<{ id: string; evalId: string }>;
}) {
  const { id, evalId } = await params;
  return (
    <div>
      <h1 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-cfl-gold">
        Evaluation
      </h1>
      <p className="mt-2 text-cfl-gray">
        Player: {id} — Evaluation: {evalId}
      </p>
    </div>
  );
}
