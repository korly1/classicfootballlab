import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="font-[family-name:var(--font-bebas-neue)] text-4xl text-cfl-gold">
        404
      </h1>
      <p className="text-cfl-gray">This page does not exist.</p>
      <Link
        className="font-[family-name:var(--font-bebas-neue)] text-cfl-green underline decoration-cfl-gold/50"
        href="/"
      >
        Back home
      </Link>
    </main>
  );
}
