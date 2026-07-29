import { Container, SectionHeading } from "../components/ui";
import { PageHeader, FeatureGrid, CTA } from "../components/sections";
import { Icons } from "../components/icons";
import { whyEngage, values, expertise } from "../content";

export const metadata = {
  title: "About",
  description:
    "Digital Pearls is an independent technology advisory that brings precision architecture to high-stakes environments.",
};

const stats = [
  { value: "1", label: "Discipline: architecture done right" },
  { value: "0", label: "Products to sell — fully vendor-neutral" },
  { value: "100%", label: "Evidence-led recommendations" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Digital Pearls"
        title="An independent advisory for technology that cannot fail"
        intro="We are architects for organizations whose systems carry real weight. Where others add tools, we bring order — turning fragmented estates into controlled, high-performance engines."
      />

      {/* Who we are */}
      <section className="bg-white">
        <Container className="py-[var(--spacing-section)]">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <SectionHeading
              eyebrow="Who We Are"
              title="Precision is our first principle"
              intro="Digital Pearls was founded on a simple conviction: most technology problems are architecture problems in disguise. Solve the architecture, and cost, speed, and resilience follow."
            />
            <div className="space-y-6 text-lg leading-relaxed text-navy/70">
              <p>
                We work shoulder-to-shoulder with boards, CIOs, and engineering
                leaders — bringing the rigor of true architecture to the estates
                they depend on. We are deliberately independent, holding no
                product to sell and no platform to push.
              </p>
              <p>
                That independence is what lets us tell the truth about your
                estate, and design the architecture that genuinely serves your
                business — not a vendor&apos;s roadmap.
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-silver/60 bg-pearl p-8">
                <div className="font-display text-5xl text-navy">{s.value}</div>
                <p className="mt-3 text-sm leading-relaxed text-navy/70">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Expertise */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div className="blueprint-grid absolute inset-0 -z-10 opacity-40" />
        <Container className="py-[var(--spacing-section)]">
          <SectionHeading
            tone="light"
            eyebrow="Our Expertise"
            title="Deep command across the modern estate"
            intro="Architectural sprawl rarely respects boundaries — and neither does our expertise. We work fluently across the domains where complexity and risk concentrate."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {expertise.map((e) => (
              <div
                key={e}
                className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-gold/40 hover:bg-white/[0.06]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                <span className="text-sm font-medium leading-snug text-silver">{e}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why engage */}
      <FeatureGrid
        tone="pearl"
        columns={2}
        eyebrow="Why Digital Pearls"
        title="Why clients engage Digital Pearls"
        intro="When the estate is complex and the stakes are high, leaders want an advisor who is precise, independent, and accountable to outcomes."
        items={whyEngage}
      />

      {/* Our Value */}
      <section className="bg-white">
        <Container className="py-[var(--spacing-section)]">
          <div className="mb-14">
            <SectionHeading
              eyebrow="Our Value"
              title="Measured in outcomes, not deliverables"
              intro="A finished report is not the point. The value we create shows up in your cost base, your delivery speed, and your ability to sleep at night."
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-silver/60 bg-pearl p-8">
                <div className="text-royal">{Icons[v.icon]}</div>
                <h3 className="mt-5 font-display text-lg text-navy">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/70">{v.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
