import Link from "next/link";

export function HomeHero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 pb-8 pt-24 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vh] max-h-[600px] w-[80vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 border border-white/[0.03]"
      >
        <div className="absolute left-0 right-0 top-1/2 h-px bg-white/[0.03]" />
        <div className="absolute left-1/2 top-1/2 size-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03]" />
      </div>
      <div
        aria-hidden
        className="animate-cfl-hero-glow pointer-events-none absolute -left-1/2 -top-1/2 h-[200%] w-[200%] bg-[radial-gradient(ellipse_at_30%_20%,rgba(26,107,60,0.15)_0%,transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(26,58,107,0.15)_0%,transparent_50%),radial-gradient(ellipse_at_50%_50%,rgba(212,168,67,0.05)_0%,transparent_60%)]"
      />
      <div className="relative z-[2] flex flex-col items-center">
        <p className="animate-cfl-fade-up mb-5 inline-block border border-cfl-gold px-6 py-1.5 font-[family-name:var(--font-bebas-neue)] text-base uppercase tracking-[3px] text-cfl-gold opacity-0 [animation-delay:0.3s]">
          Santa Clarita, California
        </p>
        <h1 className="animate-cfl-fade-up mb-6 font-[family-name:var(--font-bebas-neue)] text-[clamp(3.5rem,10vw,8rem)] leading-[0.9] tracking-[2px] text-cfl-white opacity-0 [animation-delay:0.5s]">
          <span className="block text-[0.5em] tracking-[6px] text-cfl-gold">
            Classic
          </span>
          Football Lab
        </h1>
        <p className="animate-cfl-fade-up mx-auto mt-6 max-w-2xl font-[family-name:var(--font-barlow)] text-[clamp(1.1rem,2.5vw,1.4rem)] uppercase tracking-[3px] text-cfl-gray opacity-0 [animation-delay:0.7s]">
          Not a team. Not a league. A Brazilian-method training lab that develops
          the skills your kid isn&apos;t getting at team practice.
        </p>
        <Link
          className="animate-cfl-fade-up group relative mt-8 inline-block overflow-hidden bg-gradient-to-br from-cfl-green to-cfl-green-light px-12 py-4 font-[family-name:var(--font-bebas-neue)] text-xl uppercase tracking-[3px] text-cfl-white-pure opacity-0 transition-all [animation-delay:1.1s] before:absolute before:left-[-100%] before:top-0 before:h-full before:w-full before:bg-gradient-to-br before:from-cfl-gold before:to-cfl-gold-bright before:transition-[left] before:duration-300 group-hover:before:left-0"
          href="#contact"
        >
          <span className="relative z-[1]">Start Training</span>
        </Link>
        <p className="animate-cfl-fade-up mx-auto mt-6 max-w-[650px] px-6 font-[family-name:var(--font-barlow)] text-[clamp(1.3rem,2.5vw,1.7rem)] font-light italic leading-relaxed text-cfl-gold opacity-0 [animation-delay:1.3s]">
          &quot;We don&apos;t shoot with our feet. We shoot with our entire
          body.&quot;
        </p>
      </div>
      <div className="animate-cfl-fade-up absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0 [animation-delay:1.5s]">
        <span className="font-[family-name:var(--font-bebas-neue)] text-xs uppercase tracking-[3px] text-cfl-gray">
          Scroll
        </span>
        <div className="animate-cfl-scroll-pulse h-10 w-px bg-gradient-to-b from-cfl-gold to-transparent" />
      </div>
    </section>
  );
}
