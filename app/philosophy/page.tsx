import { Container, SectionHeading } from "../components/ui";
import { PageHeader, CTA } from "../components/sections";
import { principles } from "../content";

export const metadata = {
  title: "Philosophy",
  description:
    "Our philosophy: architecture is a decision, not an accident. Precision over proliferation, evidence before opinion, control as advantage.",
};

export default function PhilosophyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Philosophy"
        title="Precision over proliferation"
        intro="How we think about technology shapes everything we do. Our philosophy is deliberately austere — because in high-stakes environments, discipline is what separates control from chaos."
      />

      {/* Manifesto statement */}
      <section className="bg-white">
        <Container className="py-[var(--spacing-section)]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="gold-rule mx-auto mb-8" />
            <blockquote className="font-display text-2xl leading-snug text-navy sm:text-3xl lg:text-4xl">
              &ldquo;Sprawl is not a technology problem. It is the absence of a
              decision — repeated a thousand times. Our work is to make the
              decision, and to hold it.&rdquo;
            </blockquote>
          </div>
        </Container>
      </section>

      {/* Principles */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div className="blueprint-grid absolute inset-0 -z-10 opacity-40" />
        <Container className="py-[var(--spacing-section)]">
          <div className="mb-16">
            <SectionHeading
              tone="light"
              eyebrow="What We Believe"
              title="Four principles that guide every engagement"
            />
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
            {principles.map((p, i) => (
              <div key={p.title} className="bg-navy p-10 transition-colors hover:bg-navy/70">
                <span className="font-display text-3xl text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-xl leading-snug text-white">
                  {p.title}
                </h3>
                <p className="mt-4 leading-relaxed text-silver/85">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Method / approach */}
      <section className="bg-pearl">
        <Container className="py-[var(--spacing-section)]">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <SectionHeading
              eyebrow="Our Approach"
              title="Deliberate where it counts, fast where it can be"
              intro="Discipline at the core is precisely what lets the edges move quickly. We hold the line on architectural intent so your teams can build with speed and confidence."
            />
            <ul className="space-y-6">
              {[
                {
                  t: "Evidence before opinion",
                  d: "We measure the estate as it truly is before we recommend anything. Data settles debates that opinion cannot.",
                },
                {
                  t: "Design for operability",
                  d: "An architecture your teams cannot run is not an asset. We design for the people who will live with it.",
                },
                {
                  t: "Consolidate relentlessly",
                  d: "Every redundant system is cost, risk, and confusion. We remove what does not earn its place.",
                },
                {
                  t: "Govern to enable",
                  d: "Governance should accelerate good decisions, not obstruct them. Our guardrails are light and load-bearing.",
                },
              ].map((m) => (
                <li key={m.t} className="flex gap-4">
                  <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="m5 12 5 5L20 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-navy">{m.t}</h3>
                    <p className="mt-1 leading-relaxed text-navy/70">{m.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <CTA
        title="Put the philosophy to work"
        intro="Principles matter most when they meet a real estate. Schedule an audit and see what precision architecture looks like applied to yours."
      />
    </>
  );
}
