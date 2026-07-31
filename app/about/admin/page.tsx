import Link from "next/link";
import { getDb } from "@/lib/mongodb";
import EngagementManager from "./EngagementManager";
import LogoutButton from "./LogoutButton";
import AdminShell from "./AdminShell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

type SubmissionView = {
  name: string;
  email: string;
  company?: string;
  engagement?: string;
  message: string;
  createdAt: Date;
};

async function recentSubmissions(): Promise<SubmissionView[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection("submissions")
      .find()
      .sort({ createdAt: -1 })
      .limit(15)
      .toArray();
    return docs.map((d) => ({
      name: d.name,
      email: d.email,
      company: d.company,
      engagement: d.engagement,
      message: d.message,
      createdAt: d.createdAt,
    }));
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  const submissions = await recentSubmissions();

  // Toggle the engagement-options section without a code change.
  // Set ADMIN_ENGAGEMENTS_ENABLED=false in the deployment env to hide it.
  const showEngagements = process.env.ADMIN_ENGAGEMENTS_ENABLED !== "false";

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-pearl">
      {/* Top bar — fixed at the top; never scrolls */}
      <header className="shrink-0 border-b border-silver/60 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div>
            <span className="font-display text-lg text-navy">Digital Pearls</span>
            <span className="ml-2 text-[10px] font-semibold tracking-[0.3em] text-gold">
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-navy/60 hover:text-navy">
              View site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <AdminShell
        showEngagements={showEngagements}
        engagements={
          <section>
            <h1 className="font-display text-2xl text-navy sm:text-3xl">
              Engagement options
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy/60">
              These appear in the &ldquo;Engagement of interest&rdquo; dropdown on the
              contact form. Add, rename, reorder, hide, or delete them. Hidden options
              stay saved but won&apos;t show on the public form.
            </p>
            <div className="mt-8">
              <EngagementManager />
            </div>
          </section>
        }
        enquiries={
          <section>
            <h2 className="font-display text-2xl text-navy">Recent enquiries</h2>
            <p className="mt-2 text-sm text-navy/60">
              The latest {submissions.length ? submissions.length : ""} audit requests.
            </p>
            <div className="mt-6 space-y-4">
              {submissions.length === 0 ? (
                <p className="rounded-2xl border border-silver/60 bg-white p-6 text-sm text-navy/50">
                  No enquiries yet.
                </p>
              ) : (
                submissions.map((s, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-silver/60 bg-white p-5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <span className="font-display text-navy">{s.name}</span>
                        <a
                          href={`mailto:${s.email}`}
                          className="ml-2 text-sm text-royal hover:underline"
                        >
                          {s.email}
                        </a>
                      </div>
                      <span className="text-xs text-navy/40">
                        {new Date(s.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-navy/50">
                      {[s.company, s.engagement].filter(Boolean).join(" · ") || "—"}
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-navy/75">
                      {s.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        }
      />
    </main>
  );
}
