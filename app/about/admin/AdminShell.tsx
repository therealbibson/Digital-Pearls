"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type Section = {
  id: string;
  label: string;
  hint: string;
  icon: ReactNode;
};

const sections: Section[] = [
  {
    id: "engagements",
    label: "Engagement options",
    hint: "Manage the contact-form list",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16M4 12h16M4 18h10" />
      </svg>
    ),
  },
  {
    id: "enquiries",
    label: "Recent enquiries",
    hint: "Latest audit requests",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h16v12H7l-3 3V5Z" />
      </svg>
    ),
  },
];

/**
 * Admin layout with a persistent side nav. Each section's content is passed in
 * as a named slot; only the active one is shown. When `showEngagements` is
 * false the engagement-options section is hidden entirely (nav item + panel).
 */
export default function AdminShell({
  engagements,
  enquiries,
  showEngagements = true,
}: {
  engagements: ReactNode;
  enquiries: ReactNode;
  showEngagements?: boolean;
}) {
  const visible = showEngagements
    ? sections
    : sections.filter((s) => s.id !== "engagements");
  const [active, setActive] = useState(visible[0]?.id ?? "enquiries");

  return (
    <div className="mx-auto flex w-full min-h-0 flex-1 max-w-7xl gap-8 px-6 lg:gap-12 lg:px-10">
      {/* Side nav — static; does not scroll with the content */}
      <aside className="hidden w-64 shrink-0 py-8 md:block">
        <div>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-navy/40">
            Manage
          </p>
          <nav className="mt-3 space-y-1.5">
            {visible.map((s) => {
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3 text-left transition-all duration-200 ${
                    isActive
                      ? "bg-navy text-white shadow-[0_10px_30px_-15px_rgba(13,35,74,0.6)]"
                      : "text-navy/70 hover:bg-white hover:text-navy hover:shadow-sm"
                  }`}
                >
                  {/* Active accent bar */}
                  <span
                    aria-hidden
                    className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gold transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? "bg-white/10 text-gold"
                        : "bg-pearl text-navy/50 group-hover:text-royal"
                    }`}
                  >
                    {s.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium leading-tight">{s.label}</span>
                    <span
                      className={`block truncate text-xs leading-tight ${
                        isActive ? "text-white/55" : "text-navy/40"
                      }`}
                    >
                      {s.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Divider */}
      <div className="hidden w-px shrink-0 self-stretch bg-silver/60 md:block" />

      {/* Content pane — the only part that scrolls */}
      <div className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto py-8">
        {visible.length > 1 ? (
          <div className="mb-6 flex gap-2 md:hidden">
            {visible.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  active === s.id ? "bg-navy text-white" : "bg-white text-navy/70"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        ) : null}

        {showEngagements ? (
          <div className={active === "engagements" ? "" : "hidden"}>{engagements}</div>
        ) : null}
        <div className={active === "enquiries" ? "" : "hidden"}>{enquiries}</div>
      </div>
    </div>
  );
}
