import { Container, SectionHeading } from "../components/ui";
import { PageHeader, CTA } from "../components/sections";
import { Icons } from "../components/icons";
import { services, process } from "../content";

export const metadata = {
  title: "Services",
  description:
    "From architecture audits to modernization and governance — comprehensive technology advisory built on evidence and control.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Services"
        title="Comprehensive Technology Advisory"
        intro="Whether you need a single, decisive audit or an enduring architectural partner, every engagement is grounded in the same discipline: evidence first, precision always, control by design."
      />

      {/* Detailed service list */}
      <section className="bg-white">
        <Container className="py-[var(--spacing-section)]">
          <div className="grid gap-8 lg:grid-cols-2">
            {services.map((s, i) => (
              <div
                key={s.title}
                className="group flex gap-6 rounded-2xl border border-silver/60 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_24px_60px_-30px_rgba(13,35,74,0.4)]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-navy text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-midnight">
                  {Icons[s.icon]}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-sm text-gold/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-xl text-navy">{s.title}</h2>
                  </div>
                  <p className="mt-3 leading-relaxed text-navy/70">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How we engage */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div className="blueprint-grid absolute inset-0 -z-10 opacity-40" />
        <Container className="py-[var(--spacing-section)]">
          <SectionHeading
            tone="light"
            eyebrow="How We Engage"
            title="From the first audit to lasting control"
            intro="A structured path that turns a sprawling estate into a deliberate architecture — with your teams carried along at every step."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-4">
            {process.map((p, i) => (
              <div key={p.step} className="relative">
                <div className="flex items-center gap-4">
                  <span className="font-display text-4xl text-gold">{p.step}</span>
                  {i < process.length - 1 ? (
                    <span className="hidden h-px flex-1 bg-white/15 md:block" aria-hidden />
                  ) : null}
                </div>
                <h3 className="mt-5 font-display text-xl text-white">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-silver/85">{p.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Engagement models */}
      <section className="bg-pearl">
        <Container className="py-[var(--spacing-section)]">
          <div className="mb-14">
            <SectionHeading
              eyebrow="Engagement Models"
              title="Ways to work with us"
            />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Architecture Audit",
                d: "A fixed-scope, time-boxed diagnostic of your estate — the decisive first step for most clients.",
                cta: "The usual starting point",
              },
              {
                title: "Project Mandate",
                d: "A defined engagement to design and deliver a specific transformation, consolidation, or migration.",
                cta: "For a focused outcome",
              },
              {
                title: "Ongoing Advisory",
                d: "Fractional architectural leadership and standing counsel through sustained change.",
                cta: "For enduring partnership",
              },
            ].map((m) => (
              <div key={m.title} className="flex flex-col rounded-2xl border border-silver/60 bg-white p-8">
                <span className="eyebrow text-royal">{m.cta}</span>
                <h3 className="mt-4 font-display text-xl text-navy">{m.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-navy/70">{m.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTA
        title="Start where it matters most — with an audit"
        intro="Every strong architecture begins with an honest picture of the present. Schedule an audit and we will show you exactly where you stand."
      />
    </>
  );
}
