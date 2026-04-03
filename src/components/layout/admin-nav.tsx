import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/players/new", label: "New player" },
];

type AdminNavProps = {
  coachFullName: string;
};

export function AdminNav({ coachFullName }: AdminNavProps) {
  return (
    <nav className="flex min-h-full flex-col border-r border-cfl-gold/20 bg-cfl-navy-light p-4 text-cfl-white">
      <p className="mb-1 font-[family-name:var(--font-bebas-neue)] text-lg tracking-[0.2em] text-cfl-gold">
        CFL Admin
      </p>
      <p className="mb-4 text-sm text-cfl-gray">{coachFullName}</p>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              className="font-[family-name:var(--font-bebas-neue)] text-sm tracking-wider text-cfl-gray hover:text-cfl-gold"
              href={l.href}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <LogoutButton />
      </div>
    </nav>
  );
}
