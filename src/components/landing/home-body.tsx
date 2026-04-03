import Link from "next/link";

import { SectionDivider } from "./section-divider";

const body = "font-[family-name:var(--font-barlow)] text-[1.15rem] font-light leading-[1.9] text-cfl-text-body [&_p]:mb-6";
const hl = "font-medium text-cfl-gold";
const secTitle =
  "font-[family-name:var(--font-bebas-neue)] text-[clamp(2.5rem,5vw,4rem)] leading-none text-cfl-white";
const secLabel =
  "mb-6 text-base uppercase tracking-[4px] text-cfl-gold";
const cardBase =
  "relative border border-cfl-gold/10 bg-gradient-to-br from-cfl-navy-light/80 to-cfl-navy/80 p-10 transition-all hover:-translate-y-1 hover:border-cfl-gold/30";
const cardTitle =
  "mb-4 font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide text-cfl-white";
const cardBody =
  "font-[family-name:var(--font-barlow)] text-[0.95rem] font-light leading-relaxed text-cfl-text-body";

export function HomeBody() {
  return (
    <>
      <SectionDivider />

      <section className="px-8 py-24 max-[480px]:py-16">
        <div className="mx-auto max-w-[1100px]">
          <p className={secLabel}>What&apos;s Possible</p>
          <h2 className={`${secTitle} mb-8`}>Imagine What Your Kid Could Do</h2>
          <div className={body}>
            <p>
              Imagine your kid bending a shot around a wall like{" "}
              <span className={hl}>Beckham</span>. Powering one into the top
              corner like{" "}
              <span className={hl}>Roberto Carlos</span>. Dropping a 40-yard
              lob pass right onto a teammate&apos;s foot like{" "}
              <span className={hl}>Pirlo</span>, the Italian maestro famous for
              making impossible passes look effortless.
            </p>
            <p>
              A few rare players are born with a natural feel for these skills.
              Most aren&apos;t. But it doesn&apos;t matter where your kid falls
              on that spectrum. Natural talent without the right feedback
              develops bad habits. Raw potential without the right guidance
              stays locked. In both cases, what makes the difference is the
              same: someone who understands the mechanics well enough to break
              them into pieces your kid can actually develop. The way you
              position your hips. The angle of your standing leg. How your
              upper body moves during the strike. Every detail matters, and
              every detail can be trained.
            </p>
            <p>
              That&apos;s what we do here. We break down exactly how elite
              players execute these skills, and we teach your kid to do the
              same. One mechanic at a time, with real-time feedback, until it
              clicks.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-8 py-24 max-[480px]:py-16">
        <div className="mx-auto max-w-[1100px]">
          <p className={secLabel}>The Gap</p>
          <h2 className={`${secTitle} mb-8`}>
            What Team Practice Doesn&apos;t Cover
          </h2>
          <div className={body}>
            <p>
              Your kid goes to practice two or three times a week. They run
              drills, they scrimmage, they play games on weekends. But
              you&apos;ve noticed something:{" "}
              <span className={hl}>
                their shot hasn&apos;t gotten stronger. Their first touch is
                still heavy. They seem stuck.
              </span>
            </p>
            <p>
              That&apos;s not your kid&apos;s fault. Team practice is built
              around preparing the team for the next game: formations, set
              pieces, conditioning. Individual skill development requires a
              different kind of attention, a different methodology, and a
              level of biomechanical knowledge that most coaching certifications
              simply don&apos;t cover.
            </p>
            <p>
              And here&apos;s the thing most parents don&apos;t realize:
              practicing the wrong technique over and over doesn&apos;t make you
              better. It makes you perfect at doing it wrong. Without someone
              who knows what correct mechanics look like, who can observe,
              correct, and show the right form, bad habits get locked in.
            </p>
            <p>
              <span className={hl}>That&apos;s the gap we fill.</span>{" "}
              We&apos;re not replacing your kid&apos;s team. We&apos;re giving
              them the individual development that team practice was never
              designed to provide.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="relative px-8 py-24 max-[480px]:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(26,107,60,0.08)_0%,transparent_60%)]"
        />
        <div className="relative mx-auto max-w-[1100px]">
          <p className={secLabel}>What Makes Us Different</p>
          <h2 className={`${secTitle} mb-12`}>Something New in Santa Clarita</h2>
          <div className="grid gap-12 md:grid-cols-2">
            <div
              className={`${cardBase} before:absolute before:left-0 before:top-0 before:h-10 before:w-0.5 before:bg-cfl-gold`}
            >
              <h3 className={cardTitle}>The Whole Body, Not Just the Feet</h3>
              <p className={cardBody}>
                A powerful shot doesn&apos;t come from kicking harder. It comes
                from synchronizing your entire body: approach angle, hip
                rotation, standing leg position, strike angle, contact point. We
                teach the complete mechanics behind every skill, the way
                Brazilian academies do.
              </p>
            </div>
            <div
              className={`${cardBase} before:absolute before:left-0 before:top-0 before:h-10 before:w-0.5 before:bg-cfl-gold`}
            >
              <h3 className={cardTitle}>Real Feedback, Every Rep</h3>
              <p className={cardBody}>
                I don&apos;t ask players to repeat a technique and say
                nothing. That&apos;s how you get perfect at doing something
                wrong. I watch every rep, give instant feedback, show the correct
                form, and we keep at it until the mechanic is right.
              </p>
            </div>
            <div
              className={`${cardBase} before:absolute before:left-0 before:top-0 before:h-10 before:w-0.5 before:bg-cfl-gold`}
            >
              <h3 className={cardTitle}>Game Intelligence</h3>
              <p className={cardBody}>
                Skills without understanding are incomplete. We develop players
                who read the game: when to accelerate, when to hold the ball,
                when to pass, when to improvise. The kind of football IQ that
                makes your kid stand out on the field.
              </p>
            </div>
            <div
              className={`${cardBase} before:absolute before:left-0 before:top-0 before:h-10 before:w-0.5 before:bg-cfl-gold`}
            >
              <h3 className={cardTitle}>Development, Not Just Games</h3>
              <p className={cardBody}>
                Team coaches focus on winning Saturday&apos;s game. I focus on
                building your kid into a better player, week after week, skill
                by skill. We track progress together so you can see the
                improvement, not just hope for it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-8 py-24 max-[480px]:py-16">
        <div className="mx-auto max-w-[1100px]">
          <p className={secLabel}>Background</p>
          <h2 className={`${secTitle} mb-8`}>Forged in Brazilian Football</h2>
          <div className={body}>
            <p>
              Soccer has been part of my life since before I was even born. My
              mom almost had me at the sideline of a game my dad was playing in.
              I started playing competitive futsal at age 7 and never stopped. By
              14, I was competing against adults, not because of my size, but
              because of my skill. I played through Brazil&apos;s top youth
              systems, including{" "}
              <span className={hl}>Clube Athletico Paranaense</span>, one of
              Brazil&apos;s premier professional clubs.
            </p>
            <p>
              Along the way, I played with and against players who went on to
              compete for <span className={hl}>Barcelona</span>,{" "}
              <span className={hl}>Chelsea</span>, and top Brazilian clubs like
              Palmeiras, Corinthians, Santos, Flamengo, and Botafogo, as well as
              the national teams of Brazil, Italy, and Paraguay. Several of them
              mentored me personally. That&apos;s how I learned what separates
              good players from truly elite ones.
            </p>
            <p>
              When I moved to the U.S. in 2022 and started watching youth soccer
              across Southern California, I saw talented kids who weren&apos;t
              getting the development they deserved. I knew I could help.{" "}
              <span className={hl}>
                That&apos;s exactly what I want to teach your kids.
              </span>
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-8 py-24 max-[480px]:py-16">
        <div className="mx-auto max-w-[1100px]">
          <p className={secLabel}>The Process</p>
          <h2 className={`${secTitle} mb-12`}>How We Develop Players</h2>
          <div className="grid grid-cols-1 gap-px bg-cfl-gold/15 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "01",
                t: "Conversation",
                d: "I talk with the player and parents to understand goals, challenges, and ambitions before we ever touch a ball.",
              },
              {
                n: "02",
                t: "Evaluate",
                d: "The first session is an assessment. I observe mechanics, technique, and game understanding to find exactly where to start.",
              },
              {
                n: "03",
                t: "Build",
                d: "A customized training plan focused on the specific skills your kid needs, aligned with their goals and your expectations.",
              },
              {
                n: "04",
                t: "Develop",
                d: "Consistent sessions with real-time feedback. We correct, refine, and repeat until each technique is mastered. You will see the progress.",
              },
            ].map((step) => (
              <div
                className="bg-cfl-navy px-6 py-10 text-center transition-colors hover:bg-cfl-green/[0.08]"
                key={step.n}
              >
                <div className="font-[family-name:var(--font-bebas-neue)] text-5xl leading-none text-cfl-green">
                  {step.n}
                </div>
                <h4 className="mt-2 font-[family-name:var(--font-bebas-neue)] text-sm uppercase tracking-[2px] text-cfl-white">
                  {step.t}
                </h4>
                <p className="mt-3 font-[family-name:var(--font-barlow)] text-sm font-light leading-relaxed text-cfl-gray">
                  {step.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-8 py-24 max-[480px]:py-16">
        <div className="mx-auto grid max-w-[1100px] gap-16 md:grid-cols-2 md:items-start">
          <div>
            <p className={secLabel}>A Note From Eduardo</p>
            <h2 className={`${secTitle} mb-8`}>A Few Things To Know</h2>
            <div className={body}>
              <p>
                As a good South American, I like to have fun, to laugh, and
                tell jokes. I don&apos;t take myself seriously. I am, though,
                serious about the methodical work needed to develop each skill
                with the specialization it requires, and tracking progress with
                both the kids and the parents.
              </p>
              <p>
                The saddest thing in life is wasted talent. And although some
                kids have more potential than others,{" "}
                <span className={hl}>
                  all of them need the right guidance to unlock it.
                </span>
              </p>
              <p>
                My goal is to help your kid develop their potential, especially
                when it comes to body mechanics, technique, and comprehension
                of the game. We start with the basics and take it from there.
                I&apos;ll be there to guide them on doing the right things and
                doing things right.
              </p>
            </div>
          </div>
          <aside className="border border-cfl-green/20 bg-gradient-to-br from-cfl-green/10 to-cfl-navy-light/50 p-10">
            <h3 className="mb-6 font-[family-name:var(--font-bebas-neue)] text-3xl text-cfl-white">
              Quick Facts
            </h3>
            {[
              ["Age Group", "11–16 (Middle School & High School)"],
              ["Location", "Santa Clarita, California"],
              ["Session Types", "Individual & Group Training"],
              ["Background", "Brazilian Youth Systems (Age 7–18)"],
              ["Focus", "Body Mechanics, Technique, Game IQ"],
            ].map(([label, value]) => (
              <div
                className="border-b border-white/5 pb-5 last:border-b-0 last:pb-0"
                key={label}
              >
                <div className="mb-1 text-xs uppercase tracking-[2px] text-cfl-gold">
                  {label}
                </div>
                <div className="font-[family-name:var(--font-barlow)] text-[0.95rem] text-cfl-white">
                  {value}
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <SectionDivider />

      <section
        className="relative px-8 py-32 text-center"
        id="contact"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(26,107,60,0.12)_0%,transparent_60%),radial-gradient(ellipse_at_50%_80%,rgba(212,168,67,0.06)_0%,transparent_50%)]"
        />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-[family-name:var(--font-bebas-neue)] text-[clamp(2.5rem,6vw,5rem)] leading-none text-cfl-white">
            Ready To
            <br />
            Get Started?
          </h2>
          <p className="mx-auto mt-6 max-w-lg font-[family-name:var(--font-barlow)] text-lg font-light leading-relaxed text-cfl-text-body">
            My door is always open. If you want to learn more or have any
            questions, reach out.
          </p>
          <Link
            className="mt-10 inline-block bg-gradient-to-br from-cfl-gold to-cfl-gold-bright px-16 py-5 font-[family-name:var(--font-bebas-neue)] text-xl uppercase tracking-[3px] text-cfl-navy transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,168,67,0.3)]"
            href="mailto:eduardo@lab.football"
          >
            Get In Touch
          </Link>
          <p className="mt-8 font-[family-name:var(--font-barlow)] text-sm italic text-cfl-gray">
            Individual and group sessions available
          </p>
        </div>
      </section>
    </>
  );
}
