import { Container } from "../components/ui";
import { PageHeader } from "../components/sections";
import ContactForm from "../components/ContactForm";
import Calendly from "../components/Calendly";
import { Icons, SocialIcons } from "../components/icons";
import { site } from "../components/site";

export const metadata = {
  title: "Contact",
  description:
    "Schedule an architecture audit or request a consultation with Digital Pearls.",
};

const steps = [
  {
    icon: "search",
    title: "Schedule an audit",
    d: "We agree a focused, time-boxed scope to assess your estate.",
  },
  {
    icon: "chart",
    title: "Receive the evidence",
    d: "You get a clear, quantified picture of sprawl, risk, and cost.",
  },
  {
    icon: "route",
    title: "Chart the path",
    d: "We define the precise next steps to bring your architecture under control.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Request a Consultation"
        title="Schedule an audit"
        intro="Tell us about your technology estate. We'll arrange a confidential conversation and, where it fits, a structured architecture audit to show you exactly where you stand."
      />

      <section className="bg-white">
        <Container className="py-[var(--spacing-section)]">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            {/* Left — context */}
            <div>
              <h2 className="font-display text-2xl text-navy sm:text-3xl">
                What happens next
              </h2>
              <ol className="mt-8 space-y-8">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
                      {Icons[s.icon as keyof typeof Icons]}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm text-gold/80">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-display text-lg text-navy">{s.title}</h3>
                      </div>
                      <p className="mt-1 leading-relaxed text-navy/70">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-12 rounded-2xl border border-silver/60 bg-pearl p-8">
                <h3 className="eyebrow text-royal">Prefer email?</h3>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-3 block font-display text-xl text-navy transition-colors hover:text-royal"
                >
                  {site.email}
                </a>

                <h3 className="eyebrow mt-6 text-royal">Or call us</h3>
                <a
                  href={`tel:${site.phone.tel}`}
                  className="mt-3 block font-display text-xl text-navy transition-colors hover:text-royal"
                >
                  {site.phone.display}
                </a>

                <p className="mt-4 text-sm leading-relaxed text-navy/60">
                  Every enquiry is handled directly by our advisory team, in
                  strict confidence.
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-silver/60 pt-6">
                  {site.socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-silver/60 text-navy/70 transition-colors hover:border-royal hover:text-royal"
                    >
                      {SocialIcons[s.icon]}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="rounded-3xl border border-silver/60 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(13,35,74,0.35)] sm:p-10">
              <h2 className="font-display text-2xl text-navy">Request your audit</h2>
              <p className="mt-2 text-sm text-navy/60">
                Fields marked <span className="text-gold">*</span> are required.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Direct scheduling via Calendly */}
      <section className="bg-pearl">
        <Container className="py-[var(--spacing-section)]">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="eyebrow text-royal">Prefer to book directly?</h2>
            <p className="mt-4 font-display text-2xl text-navy sm:text-3xl">
              Pick a time that works for you
            </p>
            <p className="mt-3 leading-relaxed text-navy/70">
              Choose a slot below and we&apos;ll send a calendar invite with a
              reminder. No back-and-forth required.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <Calendly />
          </div>
        </Container>
      </section>
    </>
  );
}
