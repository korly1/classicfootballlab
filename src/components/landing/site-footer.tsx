import { FOOTER_LOGO_DATA_URL } from "./landing-assets";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 px-8 py-12 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Classic Football Lab"
        className="mx-auto mb-4 h-[60px] w-auto"
        height={60}
        src={FOOTER_LOGO_DATA_URL}
        width={60}
      />
      <p className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-[3px] text-cfl-gold">
        Classic Football Lab
      </p>
      <p className="text-sm tracking-wide text-cfl-gray">
        Brazilian Lab of Football — Santa Clarita, CA
      </p>
      <p className="mt-4">
        <a
          aria-label="Instagram"
          className="inline-flex text-cfl-gray transition-colors hover:text-cfl-gold"
          href="https://www.instagram.com/classicfootballlab"
          rel="noopener noreferrer"
          target="_blank"
        >
          <svg
            className="h-[22px] w-[22px]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
        </a>
      </p>
    </footer>
  );
}
