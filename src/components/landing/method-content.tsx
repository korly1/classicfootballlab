import Link from "next/link";

import { SectionDivider } from "./section-divider";

const secTitle =
  "font-[family-name:var(--font-bebas-neue)] text-[clamp(2.5rem,5vw,4rem)] leading-none text-cfl-white";
const secLabel =
  "mb-6 text-base uppercase tracking-[4px] text-cfl-gold";
const body =
  "font-[family-name:var(--font-barlow)] text-[1.15rem] font-light leading-[1.9] text-cfl-text-body [&_p]:mb-6";

const principles = [
  {
    n: "01",
    t: "The Midfield Is Everything",
    d: "The midfield is where you win or lose the game. Every team needs at least one player controlling the entire game from the center of the field.",
  },
  {
    n: "02",
    t: "Peripheral Vision",
    d: "You have to know what's happening on the entire field. On attack, it helps you find players in better positions. On defense, it tells you which spaces to fill.",
  },
  {
    n: "03",
    t: "Protect the Ball",
    d: "The ball is the most important thing on the field. Protect it. And if you lose it, go get it back immediately.",
  },
  {
    n: "04",
    t: "Learn Rotations",
    d: "Rotation of 3, rotation of 4. On offense to open space, on defense to fill gaps and close passing lanes. Movement is structure.",
  },
  {
    n: "05",
    t: "Defense Is a Team Effort",
    d: "Think in terms of a defensive system where the entire team defends — not just the back line. Everyone has a role when possession is lost.",
  },
  {
    n: "06",
    t: "Don't Miss Goals",
    d: "Learn to feel comfortable in front of the goal. Finishing is a skill that requires practice, calmness, and confidence under pressure.",
  },
  {
    n: "07",
    t: "System + Improvisation",
    d: "Play according to the system. But learn how and when to get out of it and improvise. Formation is overrated. Learn to adapt, fill spaces.",
  },
  {
    n: "08",
    t: "Effort Over Result",
    d: "In a game, we don't control the result. What we control is our effort. Play like you're starving for the ball. Give absolutely everything you've got.",
  },
];

export function MethodContent() {
  return (
    <>
      <header className="relative px-8 pb-16 pt-28 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(26,107,60,0.1)_0%,transparent_60%)]"
        />
        <div className="relative">
          <h1 className="font-[family-name:var(--font-bebas-neue)] text-[clamp(3rem,7vw,5rem)] tracking-[3px] text-cfl-white">
            The Method
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-[family-name:var(--font-barlow)] text-lg font-light leading-relaxed text-cfl-gray">
            The principles, tactics, and training structure behind Classic
            Football Lab. This is how we think about football — and how we
            develop players.
          </p>
        </div>
      </header>

      <section className="px-8 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[family-name:var(--font-bebas-neue)] text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight text-cfl-white">
            Don&apos;t be fast. Be{" "}
            <span className="text-cfl-gold">faster than the other team.</span>
          </p>
          <p className="mt-6 font-[family-name:var(--font-barlow)] text-base font-light leading-relaxed text-cfl-gray">
            Control the ball, raise your head, pass and move. When the space
            opens, then you accelerate to be faster than your opponent.
            Football isn&apos;t about raw speed. It&apos;s about timing,
            intelligence, and precision.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="px-8 py-16">
        <div className="mx-auto max-w-[1000px]">
          <p className={secLabel}>Core Principles</p>
          <h2 className={`${secTitle} mb-12`}>How We Think About Football</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {principles.map((p) => (
              <div
                className="border-l-4 border-cfl-green bg-cfl-navy-light/40 p-8"
                key={p.n}
              >
                <div className="font-[family-name:var(--font-bebas-neue)] text-3xl leading-none text-cfl-green">
                  {p.n}
                </div>
                <h3 className="mt-2 font-[family-name:var(--font-bebas-neue)] text-xl tracking-wide text-cfl-white">
                  {p.t}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-barlow)] text-sm font-light leading-relaxed text-cfl-gray">
                  {p.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-8 py-16">
        <div className="mx-auto max-w-[900px]">
          <p className={secLabel}>In Possession</p>
          <h2 className={`${secTitle} mb-10`}>When the Team Has the Ball</h2>
          <div className="mb-10">
            <span className="inline-block border border-cfl-gold/20 bg-cfl-gold/10 px-4 py-1 text-xs uppercase tracking-[2px] text-cfl-gold">
              Ball Exit / Build-Up
            </span>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                {
                  h: "Short Passes",
                  t: "Build from the back with precision. Keep possession and draw the opposition out of shape.",
                },
                {
                  h: "Rotations",
                  t: "Rotate in groups of 3 or 4 to create passing options and open space through movement.",
                },
                {
                  h: "Breaking Pressure",
                  t: "Move and open space to get out of the opponent's press. Composure under pressure is trained, not inherited.",
                },
              ].map((x) => (
                <div
                  className="border border-white/5 bg-cfl-navy-light/30 p-6 transition-colors hover:border-cfl-gold/20"
                  key={x.h}
                >
                  <h4 className="font-[family-name:var(--font-bebas-neue)] text-lg tracking-wide text-cfl-white">
                    {x.h}
                  </h4>
                  <p className="mt-2 font-[family-name:var(--font-barlow)] text-xs font-light leading-relaxed text-cfl-gray">
                    {x.t}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="inline-block border border-cfl-gold/20 bg-cfl-gold/10 px-4 py-1 text-xs uppercase tracking-[2px] text-cfl-gold">
              Attack Patterns
            </span>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                {
                  h: "Attack in 4-3-3",
                  t: "Width from wingers, midfield creativity, striker movement. The classic Brazilian attacking shape.",
                },
                {
                  h: "Attack in 4-4-2",
                  t: "Compact midfield, partnership up top, overlapping fullbacks providing width.",
                },
                {
                  h: "Pass and Move",
                  t: "The foundation: pass the ball and immediately move into space. Never stand still after releasing the ball.",
                },
              ].map((x) => (
                <div
                  className="border border-white/5 bg-cfl-navy-light/30 p-6 transition-colors hover:border-cfl-gold/20"
                  key={x.h}
                >
                  <h4 className="font-[family-name:var(--font-bebas-neue)] text-lg tracking-wide text-cfl-white">
                    {x.h}
                  </h4>
                  <p className="mt-2 font-[family-name:var(--font-barlow)] text-xs font-light leading-relaxed text-cfl-gray">
                    {x.t}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-8 py-16">
        <div className="mx-auto max-w-[900px]">
          <p className={secLabel}>Out of Possession</p>
          <h2 className={`${secTitle} mb-10`}>
            When the Team Doesn&apos;t Have the Ball
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                h: "Immediate Pressure",
                t: "Lose the ball, press immediately. Don't let the opponent settle. Win it back as high up the field as possible.",
              },
              {
                h: "Pressure Lines",
                t: "High press, mid-block, or low block depending on the game situation. Knowing when to use each is key.",
              },
              {
                h: "Compactness",
                t: "Stay compact as a unit. Reduce the space between lines. Leave no holes for the opponent to exploit.",
              },
              {
                h: "Defensive Rotations",
                t: "Cover spaces, shift as a unit, close passing lanes. When the opportunity comes, steal the ball.",
              },
              {
                h: "Defending in 4-4-2",
                t: "Two compact banks of four. Excellent for closing central spaces and forcing play wide.",
              },
              {
                h: "Defending in 4-3-3",
                t: "Higher pressing shape with winger engagement. More aggressive but requires discipline and fitness.",
              },
            ].map((x) => (
              <div
                className="border border-white/5 bg-cfl-navy-light/30 p-6 transition-colors hover:border-cfl-gold/20"
                key={x.h}
              >
                <h4 className="font-[family-name:var(--font-bebas-neue)] text-lg tracking-wide text-cfl-white">
                  {x.h}
                </h4>
                <p className="mt-2 font-[family-name:var(--font-barlow)] text-xs font-light leading-relaxed text-cfl-gray">
                  {x.t}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-8 py-16 text-center">
        <div className="mx-auto max-w-[1100px]">
          <p className={secLabel}>Positional Development</p>
          <h2 className={`${secTitle} mb-6`}>We Develop Every Position</h2>
          <p className={`${body} mx-auto mb-12 max-w-2xl`}>
            Each position has unique mechanics, responsibilities, and
            decision-making requirements. We train them all with the specificity
            they deserve.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              ["Striker (The 9)", "Finishing, movement, hold-up play"],
              ["Winger", "1v1, crossing, cutting inside"],
              ["Attacking Mid (The 10)", "Final pass, creativity, shooting"],
              ["Center Mid (The 8)", "Box-to-box, rotations, transitions"],
              ["Defensive Mid (The 6)", "Shielding, distribution, game control"],
              ["Full Back", "Overlapping, crossing, recovery"],
              ["Center Back", "Reading the game, build-up"],
            ].map(([title, desc]) => (
              <div
                className="min-w-[140px] border border-cfl-green/30 bg-cfl-green/5 px-6 py-4 text-center"
                key={title}
              >
                <h4 className="font-[family-name:var(--font-bebas-neue)] text-base text-cfl-gold">
                  {title}
                </h4>
                <p className="mt-1 font-[family-name:var(--font-barlow)] text-xs font-light text-cfl-gray">
                  {desc}
                </p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-2xl border-l-2 border-cfl-gold pl-6 text-left font-[family-name:var(--font-barlow)] text-base italic leading-relaxed text-cfl-gray">
            What you see above is just the starting point. Each position
            involves layers of coordination with teammates, tactical awareness,
            and situational decision-making that we develop through training.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="px-8 py-16">
        <div className="mx-auto max-w-[900px]">
          <p className={secLabel}>Training Structure</p>
          <h2 className={`${secTitle} mb-10`}>What Practice Looks Like</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                h: "Technique & Mechanics",
                t: "Passing, ball control, shooting mechanics. The fundamentals done right with instant feedback and correction.",
              },
              {
                h: "Game Situations",
                t: "Ball exit, midfield movement, final pass + finishing. Realistic scenarios that translate directly to match day.",
              },
              {
                h: "Tactics",
                t: "Formations, rotations, pressing triggers, and defensive shape. Understanding the why behind the what.",
              },
              {
                h: "Collective Play",
                t: "Full team exercises where everything comes together: technique, tactics, communication, and competitive intensity.",
              },
              {
                h: "Two-Touch Training",
                t: "Developing quick thinking and precise first touches under constraint. Forces better decisions faster.",
              },
              {
                h: "Free Training",
                t: "Unstructured time to experiment, play, and develop creativity. Sometimes the best learning happens without a drill.",
              },
            ].map((x) => (
              <div
                className="border border-white/5 bg-cfl-navy-light/30 p-6 transition-colors hover:border-cfl-gold/20"
                key={x.h}
              >
                <h4 className="font-[family-name:var(--font-bebas-neue)] text-lg tracking-wide text-cfl-white">
                  {x.h}
                </h4>
                <p className="mt-2 font-[family-name:var(--font-barlow)] text-xs font-light leading-relaxed text-cfl-gray">
                  {x.t}
                </p>
              </div>
            ))}
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
            This Is How We Play
          </h2>
          <p className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-barlow)] text-lg font-light leading-relaxed text-cfl-text-body">
            Want to see it in action? Let&apos;s get started.
          </p>
          <Link
            className="mt-10 inline-block bg-gradient-to-br from-cfl-gold to-cfl-gold-bright px-16 py-5 font-[family-name:var(--font-bebas-neue)] text-xl uppercase tracking-[3px] text-cfl-navy transition-transform hover:-translate-y-0.5"
            href="mailto:eduardo@lab.football"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </>
  );
}
