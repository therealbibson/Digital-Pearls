"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/philosophy", label: "Philosophy" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Solid white bar when scrolled or when the mobile menu is open;
  // transparent (over the dark hero) at the very top.
  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-silver/50 bg-white/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center" aria-label="Digital Pearls — home">
          {/* Dark logo on the solid white bar; white logo over the dark hero */}
          <Image
            src={solid ? "/logo.svg" : "/logo-light.svg"}
            alt="Digital Pearls"
            width={300}
            height={54}
            priority
            className="h-10 w-auto md:h-11"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-9 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`group relative text-sm font-medium transition-colors ${
                  solid
                    ? active
                      ? "text-navy"
                      : "text-navy/70 hover:text-navy"
                    : active
                      ? "text-white"
                      : "text-white/80 hover:text-white"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
          <Link
            href="/contact"
            className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
              solid
                ? "bg-navy text-white hover:bg-royal"
                : "bg-white/10 text-white ring-1 ring-white/50 backdrop-blur hover:bg-white hover:text-navy hover:ring-white"
            }`}
          >
            Request Consultation
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors lg:hidden ${
            solid ? "border-silver/60 text-navy" : "border-white/40 text-white"
          }`}
        >
          <span className="sr-only">Menu</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-silver/50 bg-white lg:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                  pathname === l.href
                    ? "bg-pearl text-navy"
                    : "text-navy/75 hover:bg-pearl"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-midnight"
            >
              Request Consultation
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
