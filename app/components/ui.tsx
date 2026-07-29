import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* Constrained content width */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}

/* Small uppercase label with a gold tick */
export function Eyebrow({
  children,
  tone = "navy",
}: {
  children: ReactNode;
  tone?: "navy" | "light";
}) {
  return (
    <span
      className={`eyebrow inline-flex items-center gap-2.5 ${
        tone === "light" ? "text-silver" : "text-royal"
      }`}
    >
      <span className="h-px w-6 bg-gold" aria-hidden />
      {children}
    </span>
  );
}

/* Section heading block */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "navy",
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "navy" | "light";
  align?: "left" | "center";
}) {
  const alignCls = align === "center" ? "text-center items-center" : "";
  return (
    <div className={`flex max-w-2xl flex-col gap-5 ${alignCls}`}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <h2
        className={`font-display text-3xl leading-tight sm:text-4xl lg:text-[2.75rem] ${
          tone === "light" ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={`text-lg leading-relaxed ${
            tone === "light" ? "text-silver" : "text-navy/70"
          }`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}

type ButtonVariant = "gold" | "navy" | "outline" | "ghost";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2";

const buttonVariants: Record<ButtonVariant, string> = {
  gold: "bg-gold text-midnight shadow-sm hover:bg-[#e2c274] hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-offset-white",
  navy: "bg-navy text-white hover:bg-royal hover:-translate-y-0.5 focus-visible:ring-offset-white",
  outline:
    "border border-silver/70 text-navy hover:border-gold hover:text-navy hover:-translate-y-0.5 focus-visible:ring-offset-white",
  ghost:
    "border border-white/25 text-white hover:border-gold hover:text-gold focus-visible:ring-offset-midnight",
};

export function Button({
  href,
  variant = "gold",
  className = "",
  children,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link
      href={href}
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
      {...rest}
    >
      {children}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="transition-transform duration-300 group-hover:translate-x-0.5"
      >
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

/* Generic content card */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative rounded-2xl border border-silver/60 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_24px_60px_-30px_rgba(13,35,74,0.4)] ${className}`}
    >
      {children}
    </div>
  );
}
