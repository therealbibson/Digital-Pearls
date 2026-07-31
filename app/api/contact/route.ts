import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  sendTransactional,
  ownerNotificationEmail,
  clientConfirmationEmail,
  type ContactPayload,
} from "@/lib/brevo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. If present, pretend success.
  if (str(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const payload: ContactPayload = {
    name: str(body.name, 200),
    email: str(body.email, 200),
    company: str(body.company, 200),
    engagement: str(body.engagement, 200),
    message: str(body.message, 5000),
  };

  // Server-side validation (mirrors the client rules).
  const errors: Record<string, string> = {};
  if (!payload.name) errors.name = "Name is required.";
  if (!payload.email) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(payload.email)) errors.email = "Enter a valid email address.";
  if (!payload.message) errors.message = "Message is required.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Persist the submission (best-effort — never block on it).
  try {
    const db = await getDb();
    await db.collection("submissions").insertOne({
      ...payload,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("[contact] failed to persist submission:", err);
  }

  // Fire both transactional emails.
  const ownerEmail = process.env.OWNER_NOTIFY_EMAIL;
  const results = await Promise.allSettled([
    ownerEmail
      ? sendTransactional({
          to: [{ email: ownerEmail, name: "Digital Pearls" }],
          replyTo: { email: payload.email, name: payload.name },
          ...ownerNotificationEmail(payload),
        })
      : Promise.reject(new Error("OWNER_NOTIFY_EMAIL not set")),
    sendTransactional({
      to: [{ email: payload.email, name: payload.name }],
      ...clientConfirmationEmail(payload),
    }),
  ]);

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length) {
    failed.forEach((f) =>
      console.error("[contact] email send error:", (f as PromiseRejectedResult).reason)
    );
    // The enquiry is stored; tell the client it's received but note the email hiccup.
    return NextResponse.json(
      { ok: true, warning: "Request received; confirmation email may be delayed." },
      { status: 202 }
    );
  }

  return NextResponse.json({ ok: true });
}
