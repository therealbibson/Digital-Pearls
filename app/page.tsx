import Link from "next/link";
import { Container, SectionHeading } from "./components/ui";
import { Hero, FeatureGrid, CTA } from "./components/sections";
import { Icons } from "./components/icons";
import { services, whyEngage, values, process } from "./content";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Intro — the problem we solve */}
      <section className="bg-white">
        <Container className="py-[var(--spacing-section)]">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <SectionHeading
              eyebrow="The problem we solve"
              title={
                <>
                  Fragmented technology is a{" "}
                  <span className="text-royal">silent tax</span> on ambition
                </>
              }
              intro="Years of point solutions, acquisitions, and expedient decisions leave most organizations with a sprawling, opaque technology estate — expensive to run, slow to change, and fragile under pressure."
            />
            <div className="space-y-6 text-lg leading-relaxed text-navy/70">
              <p>
                Digital Pearls exists to reverse that entropy. We bring the
                discipline of true architecture to environments where the cost
                of error is high and the demands on technology are relentless.
              </p>
              <p>
                The result is not merely a tidier diagram. It is a controlled,
                high-performance engine — one that lowers cost, accelerates
                delivery, and gives leadership genuine command of their
                technology.
              </p>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 font-semibold text-navy transition-colors hover:text-royal"
              >
                Why organizations engage us
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="transition-transform group-hover:translate-x-1">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* What we do */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div className="blueprint-grid absolute inset-0 -z-10 opacity-40" />
        <Container className="py-[var(--spacing-section)]">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionHeading
              tone="light"
              eyebrow="What We Do"
              title="Comprehensive Technology Advisory"
              intro="We partner with leadership across the full arc of an architecture — from the first honest audit to the disciplined delivery of a modern, consolidated estate."
            />
            <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
              {[
                { icon: "search", t: "Audit & Diagnose", d: "Expose sprawl, risk, and cost with evidence." },
                { icon: "blueprint", t: "Design", d: "Define a precise target architecture." },
                { icon: "route", t: "Modernize", d: "Consolidate and migrate without disruption." },
                { icon: "shield", t: "Govern", d: "Keep architecture coherent as you scale." },
              ].map((c) => (
                <div key={c.t} className="bg-navy/80 p-8 transition-colors hover:bg-navy">
                  <div className="text-gold">{Icons[c.icon as keyof typeof Icons]}</div>
                  <h3 className="mt-4 font-display text-lg text-white">{c.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-silver/80">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Our Services */}
      <FeatureGrid
        tone="pearl"
        eyebrow="Our Services"
        title="Precision at every stage of the journey"
        intro="Engage us for a single, focused mandate or as an enduring architectural partner. Every service is built on the same commitment to evidence and control."
        items={services}
      />

      {/* Engagement process */}
      <section className="bg-white">
        <Container className="py-[var(--spacing-section)]">
          <SectionHeading
            eyebrow="How We Engage"
            title="A deliberate path from sprawl to control"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div key={p.step} className="relative rounded-2xl border border-silver/60 bg-white p-8">
                <span className="font-display text-4xl text-gold/70">{p.step}</span>
                <h3 className="mt-4 font-display text-xl text-navy">{p.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-navy/70">{p.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why engage Digital Pearls */}
      <FeatureGrid
        tone="pearl"
        columns={2}
        eyebrow="Why Digital Pearls"
        title="Why clients engage Digital Pearls"
        intro="Leaders in high-stakes environments turn to us when the stakes are too high for guesswork and the estate too complex to leave to chance."
        items={whyEngage}
      />

      {/* Our Value */}
      <section className="bg-white">
        <Container className="py-[var(--spacing-section)]">
          <div className="mb-14">
            <SectionHeading
              eyebrow="Our Value"
              title="The outcomes our clients realize"
              intro="We measure our work by the difference it makes to your cost base, your delivery speed, and your resilience."
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="group rounded-2xl bg-pearl p-8 transition-colors hover:bg-navy">
                <div className="text-royal transition-colors group-hover:text-gold">{Icons[v.icon]}</div>
                <h3 className="mt-5 font-display text-lg text-navy transition-colors group-hover:text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/70 transition-colors group-hover:text-silver/85">{v.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
