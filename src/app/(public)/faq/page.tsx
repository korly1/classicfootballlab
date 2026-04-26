import Link from "next/link";

import { SectionDivider } from "@/components/landing/section-divider";

type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

const FAQ: FaqItem[] = [
  {
    question: "How do we get started?",
    answer: (
      <>
        We start with a quick call to understand the athlete’s current level,
        goals, training location, and availability (time slots). We prefer{" "}
        <b>WhatsApp</b>, but we can also do text messages, email, or a phone
        call. From there, we schedule the first session.
      </>
    ),
  },
  {
    question: "Is the first session really free?",
    answer: (
      <>
        Yes. The first session has no cost. We use it to evaluate the athlete
        and start the first exercises right away.
      </>
    ),
  },
  {
    question: "What happens after the first session?",
    answer: (
      <>
        After the first session, we develop an initial evaluation and share it
        with the parent. The parent receives a link to our website with
        credentials to access the secure area.
      </>
    ),
  },
  {
    question: "How long is a typical session?",
    answer: (
      <>
        Typically <b>60 minutes</b>. If you prefer, we can extend to{" "}
        <b>90 minutes</b>.
      </>
    ),
  },
  {
    question: "What does a session look like?",
    answer: (
      <>
        While we set up the goal, we ask the athlete to work on juggling
        (usually under 5 minutes). Then we go straight into training. Sessions
        are
        typically structured around <b>four exercises</b> of about{" "}
        <b>15 minutes</b> each, with quick water breaks in between. Staying
        hydrated is important.
      </>
    ),
  },
  {
    question: "What skills do you focus on?",
    answer: (
      <>
        The skills we evaluate and train are listed on{" "}
        <Link className="text-cfl-gold hover:underline" href="/method">
          The Method
        </Link>
        . A key point is that many mechanics are correlated. For example,
        sometimes a shooting mechanic that needs fixing is related to a passing
        mechanic. When we work on one, we may need to work on both. This is part
        of the initial evaluation and training plan.
      </>
    ),
  },
  {
    question: "Do you work with all outfield positions?",
    answer: (
      <>
        Yes. Different positions demand certain skills and mechanics more than
        others. We discuss this during the phone call and throughout training.
      </>
    ),
  },
  {
    question: "Do you work with goalkeepers?",
    answer: <>Not at this time.</>,
  },
  {
    question: "How much do sessions cost?",
    answer: (
      <>
        For <b>individual sessions</b>, from the second session onward, the cost
        is <b>$70 USD per hour</b> per athlete.
      </>
    ),
  },
  {
    question: "Do you offer group sessions?",
    answer: (
      <>
        Yes. Group sessions have different rates depending on group size and
        logistics. Please get in touch and we’ll discuss the specifics.
      </>
    ),
  },
  {
    question: "Where do you train?",
    answer: (
      <>
        Our preferred training location is <b>Duane R. Harte Park</b>, but it’s
        not mandatory. We’re based in <b>Santa Clarita</b>, and we do our best
        to accommodate a location that works well for the athlete too (with
        flexibility to move around the LA area depending on schedule and
        location).
      </>
    ),
  },
  {
    question: "Should we send video footage?",
    answer: (
      <>
        If you have footage/recordings of the athlete, it helps. Even short
        clips can help us understand current mechanics before the first session.
      </>
    ),
  },
  {
    question: "What should the athlete bring to training?",
    answer: (
      <>
        Water, weather-appropriate training clothes, and the cleats the athlete
        already has (turf or regular grass). We provide the balls, goals, cones,
        ropes, and other training materials. We’ll confirm the exact field setup
        on the phone call.
      </>
    ),
  },
  {
    question: "How often should we train to see results?",
    answer: (
      <>
        Consistency is important because we’re training body mechanics and
        muscle memory. Our recommendation is <b>twice a week</b>. <b>Once a
        week</b> is the minimum we recommend.
      </>
    ),
  },
  {
    question: "What days/times are available?",
    answer: (
      <>
        Typically Monday to Friday after <b>4pm</b> (depending on available
        slots). Saturday morning can also be made available. We’ll do our best
        to accommodate the athlete’s schedule.
      </>
    ),
  },
  {
    question: "Do parents watch? How do you communicate feedback?",
    answer: (
      <>
        Parents are welcome to watch. We do our best to accommodate your
        preferred communication style. We like to provide verbal feedback at the
        end of every session, and we also provide written evaluations through
        our secure website. Communication is a two-way street—understanding the
        method, progress, and next steps helps build trust and momentum.
      </>
    ),
  },
  {
    question: "How do you measure progress?",
    answer: (
      <>
        We track progress through evaluations and session notes. Skills are
        typically scored on a <b>1–10</b> scale (10 = elite execution). We also
        document mechanics notes and what to focus on next session.
        <div className="mt-3 rounded-md border border-white/10 bg-cfl-navy-light/40 p-4">
          <p className="font-[family-name:var(--font-barlow)] text-sm text-cfl-white">
            Example (anonymized)
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>
              Passing → Short passes: <b>6/10</b> — mechanics note: hips opening
              early; focus: keep standing foot stable.
            </li>
            <li>
              Shooting → Power shots: <b>5/10</b> — mechanics note: upper body
              leaning back; focus: chest over the ball.
            </li>
            <li>
              Ball Control → Soft touches: <b>7/10</b> — mechanics note: good
              first touch in space; focus: under pressure.
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    question: "What ages do you work with?",
    answer: (
      <>
        Most of our athletes are <b>11–16</b> (middle school and high school),
        but if your athlete is slightly outside that range, reach out and we’ll
        confirm fit.
      </>
    ),
  },
  {
    question: "What is your cancellation or rescheduling policy?",
    answer: (
      <>
        We’re flexible as long as we communicate. If you need to reschedule,
        please give as much notice as possible so we can offer that time to
        another athlete.
      </>
    ),
  },
  {
    question: "How do we pay?",
    answer: (
      <>
        We’ll confirm the easiest payment method during the initial phone call.
        If you have a preference, let us know and we’ll do our best to
        accommodate.
      </>
    ),
  },
  {
    question: "Do you offer packages or monthly plans?",
    answer: (
      <>
        We usually start session by session. If you prefer a different
        arrangement, we can discuss and negotiate what makes sense.
      </>
    ),
  },
  {
    question: "Do you require a contract or long-term commitment?",
    answer: (
      <>
        We don’t require contracts. Our goal is to give the athlete what they
        need as efficiently as possible. If your situation requires something
        more formal, we can discuss it.
      </>
    ),
  },
  {
    question: "Do you offer team training or clinics?",
    answer: (
      <>
        Yes. Depending on the needs, we can work with teams or run clinics.
        Please reach out with details and we’ll propose an approach.
      </>
    ),
  },
  {
    question: "What languages do you speak?",
    answer: <>English, Portuguese, and Spanish.</>,
  },
  {
    question: "What if it rains or the field is unavailable?",
    answer: (
      <>
        If weather or field availability changes the plan, we’ll coordinate with
        you to adjust the time and/or location. Our goal is to keep training
        consistent without making it stressful.
      </>
    ),
  },
];

export const metadata = {
  title: "FAQ | Classic Football Lab",
  description:
    "Answers to common questions about Classic Football Lab training, pricing, and how to get started.",
};

export default function FaqPage() {
  return (
    <div className="flex flex-col">
      <section className="relative px-8 pb-16 pt-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(26,107,60,0.10)_0%,transparent_60%)]" />
        <div className="relative mx-auto w-full max-w-[900px]">
          <p className="text-sm tracking-[0.35em] text-cfl-gold">FAQ</p>
          <h1 className="mt-4 font-[family-name:var(--font-bebas-neue)] text-5xl tracking-[0.08em] text-cfl-white sm:text-6xl">
            Questions, answered
          </h1>
          <p className="mx-auto mt-5 max-w-[720px] text-base leading-7 text-cfl-gray sm:text-lg">
            Here’s how we start, what sessions cost, how evaluations work, and
            what to expect from Classic Football Lab.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="mx-auto w-full max-w-[900px] px-8 py-16">
        <div className="space-y-4">
          {FAQ.map((item, idx) => (
            <details
              key={item.question}
              className="group rounded-lg border border-cfl-gold/15 bg-cfl-navy/40 p-5 transition-colors open:border-cfl-gold/35"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-[0.08em] text-cfl-white">
                  {idx + 1}. {item.question}
                </span>
                <span className="shrink-0 text-cfl-gold transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="pt-3 text-sm leading-7 text-cfl-gray sm:text-base">
                {item.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-cfl-green/30 bg-cfl-green/10 p-6">
          <p className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-[0.08em] text-cfl-white">
            Still have a question?
          </p>
          <p className="mt-2 text-sm leading-7 text-cfl-gray sm:text-base">
            Reach out and we’ll help you figure out the best next step for your
            athlete.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              className="inline-flex items-center justify-center bg-cfl-gold px-6 py-3 font-[family-name:var(--font-bebas-neue)] text-base tracking-[0.15em] text-cfl-navy transition-colors hover:bg-cfl-gold/90"
              href="mailto:eduardo@lab.football"
            >
              Email us
            </a>
            <Link
              className="inline-flex items-center justify-center border border-cfl-gold/30 bg-transparent px-6 py-3 font-[family-name:var(--font-bebas-neue)] text-base tracking-[0.15em] text-cfl-gold transition-colors hover:border-cfl-gold hover:bg-cfl-gold/10"
              href="/#contact"
            >
              Contact section
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

