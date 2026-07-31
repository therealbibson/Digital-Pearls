"use client";

import Script from "next/script";

/**
 * Inline Calendly embed. Booking confirmations and reminder emails are
 * handled by Calendly itself (configured in the Calendly dashboard).
 * Set NEXT_PUBLIC_CALENDLY_URL to your scheduling link.
 */
export default function Calendly() {
  const url = process.env.NEXT_PUBLIC_CALENDLY_URL;

  if (!url) {
    return (
      <div className="rounded-2xl border border-dashed border-silver bg-pearl p-6 text-sm text-navy/60">
        Scheduling isn&apos;t configured yet. Set{" "}
        <code className="rounded bg-white px-1.5 py-0.5 text-royal">NEXT_PUBLIC_CALENDLY_URL</code>{" "}
        to enable direct booking.
      </div>
    );
  }

  return (
    <>
      <div
        className="calendly-inline-widget w-full overflow-hidden rounded-2xl border border-silver/60"
        data-url={url}
        style={{ minWidth: "320px", height: "660px" }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </>
  );
}
