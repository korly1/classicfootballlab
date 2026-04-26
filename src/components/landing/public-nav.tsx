"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";

import { NAV_LOGO_DATA_URL } from "./landing-assets";
import { cn } from "@/lib/utils";

const navLinkClass =
  "font-[family-name:var(--font-bebas-neue)] text-base tracking-[0.15em] text-cfl-gray transition-colors hover:text-cfl-gold border-b-2 border-transparent hover:border-cfl-gold pb-0.5";

export function PublicNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  const isHome = pathname === "/";
  const isHow = pathname === "/how-it-works";
  const isMethod = pathname === "/method";
  const isFaq = pathname === "/faq";

  return (
    <header className="fixed top-0 z-[1000] flex h-[60px] w-full items-center justify-between border-b border-cfl-gold/10 bg-cfl-navy/92 px-8 backdrop-blur-md transition-all">
      <Link
        className="flex cursor-pointer items-center gap-2.5"
        href="/"
        onClick={close}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="h-10 w-auto"
          height={40}
          src={NAV_LOGO_DATA_URL}
          width={120}
        />
        <span className="font-[family-name:var(--font-bebas-neue)] text-[1.3rem] tracking-[3px] text-cfl-white">
          Classic Football <span className="text-cfl-gold">Lab</span>
        </span>
      </Link>

      <button
        aria-expanded={open}
        aria-label="Toggle menu"
        className="flex flex-col gap-1.5 p-1 md:hidden"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <span className="h-0.5 w-6 bg-cfl-white transition-all" />
        <span className="h-0.5 w-6 bg-cfl-white transition-all" />
        <span className="h-0.5 w-6 bg-cfl-white transition-all" />
      </button>

      <nav
        className={cn(
          "fixed inset-x-0 top-[60px] z-[999] flex flex-col gap-6 bg-cfl-navy/97 p-8 md:static md:z-auto md:flex md:flex-row md:items-center md:gap-8 md:bg-transparent md:p-0",
          open ? "max-md:flex" : "max-md:hidden",
        )}
        id="nav-links"
      >
        <Link
          className={cn(navLinkClass, isHome && "border-cfl-gold text-cfl-gold")}
          href="/"
          onClick={close}
        >
          Home
        </Link>
        <Link
          className={cn(
            navLinkClass,
            isHow && "border-cfl-gold text-cfl-gold",
          )}
          href="/how-it-works"
          onClick={close}
        >
          How It Works
        </Link>
        <Link
          className={cn(
            navLinkClass,
            isMethod && "border-cfl-gold text-cfl-gold",
          )}
          href="/method"
          onClick={close}
        >
          The Method
        </Link>
        <Link
          className={cn(navLinkClass, isFaq && "border-cfl-gold text-cfl-gold")}
          href="/faq"
          onClick={close}
        >
          FAQ
        </Link>
        <a
          className="font-[family-name:var(--font-bebas-neue)] bg-cfl-green px-6 py-2 text-sm tracking-[0.15em] text-cfl-white-pure transition-colors hover:bg-cfl-gold hover:text-cfl-navy"
          href={isHome ? "#contact" : "/#contact"}
          onClick={close}
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
