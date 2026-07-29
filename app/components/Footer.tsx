import Link from "next/link";
import Image from "next/image";
import { Container } from "./ui";

const nav = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/philosophy", label: "Philosophy" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-midnight text-silver">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Image
              src="/logo-light.svg"
              alt="Digital Pearls"
              width={200}
              height={40}
              className="h-9 w-auto"
            />
            <p className="mt-5 text-sm leading-relaxed text-silver/70">
              Precision architecture for high-stakes technology. We help
              organizations eliminate architectural sprawl and transform
              fragmented technology into a controlled, high-performance engine.
            </p>
          </div>

          <div>
            <h3 className="eyebrow text-gold">Navigate</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-silver/75 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-gold">Get in touch</h3>
            <ul className="mt-5 space-y-3 text-sm text-silver/75">
              <li>
                <a
                  href="mailto:advisory@digitalpearls.com"
                  className="transition-colors hover:text-white"
                >
                  advisory@digitalpearls.com
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-gold transition-colors hover:text-white"
                >
                  Schedule an Audit
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-silver/60 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Digital Pearls. All rights reserved.</p>
          <p>Precision Architecture for High-Stakes Technology</p>
        </div>
      </Container>
    </footer>
  );
}
