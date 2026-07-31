import { NextResponse } from "next/server";
import { listEngagements, createEngagement } from "@/lib/engagements";
import { isAuthenticated } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public: list active engagement options for the contact form. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  // Admin (?all=1) sees inactive too; the form gets active only.
  const wantAll = url.searchParams.get("all") === "1";
  const onlyActive = !(wantAll && (await isAuthenticated()));
  try {
    const items = await listEngagements(onlyActive);
    return NextResponse.json({ ok: true, engagements: items });
  } catch (err) {
    console.error("[engagements GET]", err);
    return NextResponse.json({ ok: false, error: "Failed to load options." }, { status: 500 });
  }
}

/** Admin only: create a new engagement option. */
export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const label = typeof body.label === "string" ? body.label.trim().slice(0, 120) : "";
  if (!label) {
    return NextResponse.json({ ok: false, error: "Label is required." }, { status: 422 });
  }
  try {
    const created = await createEngagement(label);
    return NextResponse.json({ ok: true, engagement: created }, { status: 201 });
  } catch (err) {
    console.error("[engagements POST]", err);
    return NextResponse.json({ ok: false, error: "Failed to create." }, { status: 500 });
  }
}
