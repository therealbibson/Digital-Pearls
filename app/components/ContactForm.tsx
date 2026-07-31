"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

// Fallback list — used only if the API can't be reached, so the form never breaks.
const fallbackEngagements = [
  "Enterprise Architecture",
  "Data Management",
  "Cloud Computing",
  "Staff Augmentation",
  "Architecture Audit",
  "Project Mandate",
  "Ongoing Advisory",
  "General Inquiry",
  "Not sure yet",
];

const fieldBase =
  "w-full rounded-xl border border-silver bg-white px-4 py-3 text-navy placeholder:text-navy/40 transition-colors focus:border-royal focus:outline-none focus:ring-2 focus:ring-gold/40";

const labelBase = "text-sm font-medium text-navy";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [engagements, setEngagements] = useState<string[]>(fallbackEngagements);

  // Load the engagement options managed by the owner in the admin panel.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/engagements")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.ok && Array.isArray(data.engagements) && data.engagements.length) {
          setEngagements(data.engagements.map((e: { label: string }) => e.label));
        }
      })
      .catch(() => {
        /* keep the fallback list */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function validate(data: FormData) {
    const next: Record<string, string> = {};
    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const message = (data.get("message") as string)?.trim();

    if (!name) next.name = "Please enter your name.";
    if (!email) {
      next.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!message) next.message = "Tell us a little about your estate.";
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const next = validate(data);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("submitting");
    const payload = {
      name: (data.get("name") as string) || "",
      email: (data.get("email") as string) || "",
      company: (data.get("company") as string) || "",
      engagement: (data.get("engagement") as string) || "",
      message: (data.get("message") as string) || "",
      website: (data.get("website") as string) || "", // honeypot
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (result?.errors) setErrors(result.errors);
        else setSubmitError(result?.error || "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setSubmitError(
        "We couldn't submit your request. Please try again, or email us directly."
      );
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-silver/60 bg-pearl p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m5 12 5 5L20 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-6 font-display text-2xl text-navy">Thank you — request received</h3>
        <p className="mt-3 max-w-md leading-relaxed text-navy/70">
          We&apos;ve noted your request for an audit. A member of our advisory
          team will be in touch within one business day to arrange the next
          steps.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 text-sm font-semibold text-royal transition-colors hover:text-navy"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className={labelBase}>
            Full name <span className="text-gold">*</span>
          </label>
          <input id="name" name="name" type="text" placeholder="Jane Doe" className={fieldBase} />
          {errors.name ? <p className="text-sm text-red-600">{errors.name}</p> : null}
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className={labelBase}>
            Work email <span className="text-gold">*</span>
          </label>
          <input id="email" name="email" type="email" placeholder="jane@company.com" className={fieldBase} />
          {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="company" className={labelBase}>
            Organization
          </label>
          <input id="company" name="company" type="text" placeholder="Company name" className={fieldBase} />
        </div>
        <div className="space-y-2">
          <label htmlFor="engagement" className={labelBase}>
            Engagement of interest
          </label>
          <select id="engagement" name="engagement" className={fieldBase} defaultValue="">
            <option value="" disabled>
              Select an option…
            </option>
            {engagements.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className={labelBase}>
          What would you like to solve? <span className="text-gold">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Briefly describe your technology estate and the challenge you're facing…"
          className={`${fieldBase} resize-y`}
        />
        {errors.message ? <p className="text-sm text-red-600">{errors.message}</p> : null}
      </div>

      {/* Honeypot — hidden from users, catches bots. */}
      <div className="hidden" aria-hidden>
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {submitError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold tracking-wide text-midnight transition-all duration-300 hover:bg-[#e2c274] hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Schedule an Audit"}
      </button>

      <p className="text-xs leading-relaxed text-navy/50">
        By submitting, you agree to be contacted by Digital Pearls regarding your
        enquiry. We treat every conversation in strict confidence.
      </p>
    </form>
  );
}
