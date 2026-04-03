"use client";

import { useState } from "react";

import { SectionDivider } from "./section-divider";
import { cn } from "@/lib/utils";

const secTitle =
  "font-[family-name:var(--font-bebas-neue)] text-[clamp(2.5rem,5vw,4rem)] leading-none text-cfl-white";
const secLabel =
  "mb-6 text-base uppercase tracking-[4px] text-cfl-gold";
const body =
  "font-[family-name:var(--font-barlow)] text-[1.15rem] font-light leading-[1.9] text-cfl-text-body [&_p]:mb-6";

export function HowItWorksContent() {
  const [path, setPath] = useState<"individual" | "group">("individual");

  return (
    <>
      <header className="relative px-8 pb-16 pt-28 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(26,107,60,0.1)_0%,transparent_60%)]"
        />
        <div className="relative">
          <h1 className="font-[family-name:var(--font-bebas-neue)] text-[clamp(3rem,7vw,5rem)] tracking-[3px] text-cfl-white">
            How It Works
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-[family-name:var(--font-barlow)] text-lg font-light leading-relaxed text-cfl-gray">
            Whether you come with a specific goal or want us to find where to
            improve, the process is built around you. Choose your path and we
            take it from there.
          </p>
        </div>
      </header>

      <section className="px-8 py-16">
        <div className="mx-auto max-w-[1100px]">
          <p className={secLabel}>Step 1</p>
          <h2 className={`${secTitle} mb-10`}>Choose Your Format</h2>
          <div className="mb-10 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
            <button
              className={cn(
                "font-[family-name:var(--font-bebas-neue)] border px-10 py-4 text-xl tracking-[2px] transition-colors",
                path === "individual"
                  ? "border-cfl-gold bg-cfl-gold/10 text-cfl-gold"
                  : "border-cfl-gold/20 text-cfl-gray hover:border-cfl-gold hover:text-cfl-gold",
              )}
              onClick={() => setPath("individual")}
              type="button"
            >
              Individual Training
            </button>
            <button
              className={cn(
                "font-[family-name:var(--font-bebas-neue)] border px-10 py-4 text-xl tracking-[2px] transition-colors",
                path === "group"
                  ? "border-cfl-gold bg-cfl-gold/10 text-cfl-gold"
                  : "border-cfl-gold/20 text-cfl-gray hover:border-cfl-gold hover:text-cfl-gold",
              )}
              onClick={() => setPath("group")}
              type="button"
            >
              Group Training
            </button>
          </div>

          {path === "individual" ? (
            <div className="mx-auto max-w-[700px]">
              <p className={`${body} mb-8 text-center`}>
                For individual training, there are two paths depending on
                where you&apos;re starting from:
              </p>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="border border-cfl-gold/10 bg-gradient-to-br from-cfl-navy-light/80 to-cfl-navy/80 p-8">
                  <h3 className="mb-3 font-[family-name:var(--font-bebas-neue)] text-xl text-cfl-white">
                    You Know What to Work On
                  </h3>
                  <p className="font-[family-name:var(--font-barlow)] text-sm font-light leading-relaxed text-cfl-gray">
                    You come with one or more specific skills or areas you want
                    to develop. We start there and build a plan around your
                    goals.
                  </p>
                </div>
                <div className="border border-cfl-gold/10 bg-gradient-to-br from-cfl-navy-light/80 to-cfl-navy/80 p-8">
                  <h3 className="mb-3 font-[family-name:var(--font-bebas-neue)] text-xl text-cfl-white">
                    You Want Us to Assess
                  </h3>
                  <p className="font-[family-name:var(--font-barlow)] text-sm font-light leading-relaxed text-cfl-gray">
                    Not sure where to start? We run a full evaluation, identify
                    strengths and gaps, and propose a development plan tailored
                    to you.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-[700px] text-center">
              <p className={body}>
                For group training, the core process is the same as individual,
                but with additional drills and dimensions that come from working
                together. Group dynamics add game-realistic pressure,
                communication, and competitive edge to every session.
              </p>
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      <section className="px-8 py-16">
        <div className="mx-auto max-w-[1100px]">
          <p className={secLabel}>Step 2</p>
          <h2 className={`${secTitle} mb-8`}>The Development Process</h2>
          <p className={`${body} mb-12`}>
            In both cases, whether individual or group, the process follows
            the same structure:
          </p>
          <div className="relative mx-auto max-w-[700px] border-l-2 border-cfl-gold/30 pl-10">
            {[
              {
                t: "01. Evaluation",
                d: "We run a full assessment of your current mechanics, technique, and game understanding. This is the foundation everything else is built on.",
              },
              {
                t: "02. Development Plan",
                d: "Based on the evaluation, we define a clear development plan with specific goals and milestones. We review this together so everyone is aligned: player, parents, and coach.",
              },
              {
                t: "03. Train & Iterate",
                d: "We conduct sessions, share progress, and continuously iterate on the plan. Development is not linear. We adapt as you grow and as new areas emerge.",
              },
              {
                t: "04. Reach the Goal",
                d: "We work until we hit the targets defined in your plan. Real, measurable improvement, not just hours logged.",
              },
            ].map((item) => (
              <div className="relative mb-12 last:mb-0" key={item.t}>
                <div className="absolute -left-[41px] top-1.5 size-3 rounded-full border-2 border-cfl-gold bg-cfl-navy" />
                <h3 className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-[2px] text-cfl-white">
                  {item.t}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-barlow)] text-base font-light leading-relaxed text-cfl-gray">
                  {item.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-8 py-16">
        <div className="mx-auto max-w-[1100px]">
          <p className={secLabel}>What Happens Next</p>
          <h2 className={`${secTitle} mb-10`}>After We Reach Your Goal</h2>
          <div className="mx-auto grid max-w-[700px] gap-8 md:grid-cols-2">
            <div className="border border-cfl-gold/10 bg-gradient-to-br from-cfl-navy-light/80 to-cfl-navy/80 p-8">
              <h3 className="mb-3 font-[family-name:var(--font-bebas-neue)] text-xl text-cfl-white">
                Continue: Maintenance Mode
              </h3>
              <p className="font-[family-name:var(--font-barlow)] text-sm font-light leading-relaxed text-cfl-gray">
                You&apos;ve hit your goal and want to keep the skills sharp. We
                shift to maintenance sessions focused on consistency and
                refinement.
              </p>
            </div>
            <div className="border border-cfl-gold/10 bg-gradient-to-br from-cfl-navy-light/80 to-cfl-navy/80 p-8">
              <h3 className="mb-3 font-[family-name:var(--font-bebas-neue)] text-xl text-cfl-white">
                Discharge: You&apos;re Ready
              </h3>
              <p className="font-[family-name:var(--font-barlow)] text-sm font-light leading-relaxed text-cfl-gray">
                You&apos;ve reached where you wanted to be. We wrap up, and you
                take what you&apos;ve learned forward. The door is always open
                to come back.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-[700px] border border-cfl-green/30 bg-cfl-green/5 p-8">
            <h4 className="mb-3 font-[family-name:var(--font-bebas-neue)] text-xl tracking-[2px] text-cfl-gold">
              Flexibility Built In
            </h4>
            <p className="font-[family-name:var(--font-barlow)] text-[0.95rem] font-light leading-relaxed text-cfl-gray">
              At any point in the process, we can change the plan based on new
              goals or discoveries. And you can always decide to pause or stop
              the development. No pressure, no contracts. This works because you
              want it to work.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="relative px-8 py-32 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(26,107,60,0.12)_0%,transparent_60%),radial-gradient(ellipse_at_50%_80%,rgba(212,168,67,0.06)_0%,transparent_50%)]"
        />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-[family-name:var(--font-bebas-neue)] text-[clamp(2.5rem,6vw,5rem)] leading-none text-cfl-white">
            Ready To Start?
          </h2>
          <p className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-barlow)] text-lg font-light leading-relaxed text-cfl-text-body">
            Let&apos;s talk about your goals. The first conversation is free.
          </p>
          <a
            className="mt-10 inline-block bg-gradient-to-br from-cfl-gold to-cfl-gold-bright px-16 py-5 font-[family-name:var(--font-bebas-neue)] text-xl uppercase tracking-[3px] text-cfl-navy transition-transform hover:-translate-y-0.5"
            href="mailto:eduardo@lab.football"
          >
            Get In Touch
          </a>
        </div>
      </section>
    </>
  );
}
