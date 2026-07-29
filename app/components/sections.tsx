import Image from "next/image";
import { Button, Card, Container, Eyebrow, SectionHeading } from "./ui";
import { Icons } from "./icons";
import type { Item } from "../content";

/* Homepage hero with the brand image */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-midnight text-white">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero.svg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Legibility gradient over the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/85 to-midnight/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent" />
      </div>

      <Container className="relative flex min-h-[92vh] flex-col justify-center py-32">
        <div className="max-w-3xl animate-fade-up">
          <Eyebrow tone="light">Comprehensive Technology Advisory</Eyebrow>
          <h1 className="mt-6 font-display text-4xl leading-[1.08] sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
            Precision Architecture for{" "}
            <span className="text-gold">High-Stakes Technology</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-silver sm:text-xl">
            We help organizations eliminate architectural sprawl and transform
            fragmented technology into a controlled, high-performance engine —
            deliberately designed, rigorously governed, and built to endure.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="/contact" variant="gold" className="group">
              Schedule an Audit
            </Button>
            <Button href="/services" variant="ghost" className="group">
              Explore Our Services
            </Button>
          </div>
        </div>
      </Container>

      {/* Bottom hairline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </section>
  );
}

/* Inner-page header */
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy pt-36 pb-20 text-white">
      <div className="blueprint-grid absolute inset-0 -z-10 opacity-60" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-midnight/70 via-navy to-navy" />
      <Container>
        <div className="max-w-3xl animate-fade-up">
          <Eyebrow tone="light">{eyebrow}</Eyebrow>
          <h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl lg:text-[3.5rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-silver">
            {intro}
          </p>
        </div>
      </Container>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </section>
  );
}

/* Grid of icon feature cards from content items */
export function FeatureGrid({
  eyebrow,
  title,
  intro,
  items,
  columns = 3,
  tone = "light",
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  items: Item[];
  columns?: 2 | 3;
  tone?: "light" | "pearl";
}) {
  const cols = columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <section className={tone === "pearl" ? "bg-pearl" : "bg-white"}>
      <Container className="py-[var(--spacing-section)]">
        {title ? (
          <div className="mb-14">
            <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
          </div>
        ) : null}
        <div className={`grid gap-6 ${cols}`}>
          {items.map((item) => (
            <Card key={item.title}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-midnight">
                {Icons[item.icon]}
              </div>
              <h3 className="mt-6 font-display text-xl text-navy">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.975rem] leading-relaxed text-navy/70">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* Closing call-to-action band */
export function CTA({
  title = "Ready to see your architecture clearly?",
  intro = "Start with an audit. In weeks, not months, you will have an evidence-based picture of your estate and a precise plan to bring it under control.",
}: {
  title?: string;
  intro?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-midnight text-white">
      <div className="blueprint-grid absolute inset-0 -z-10 opacity-50" />
      <div className="absolute -right-24 top-1/2 -z-10 h-96 w-96 -translate-y-1/2 rounded-full bg-royal/25 blur-3xl" />
      <Container className="py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Eyebrow tone="light">Schedule an Audit</Eyebrow>
          <h2 className="mt-6 font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-silver">
            {intro}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="/contact" variant="gold" className="group">
              Schedule an Audit
            </Button>
            <Button href="/philosophy" variant="ghost" className="group">
              Our Philosophy
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
