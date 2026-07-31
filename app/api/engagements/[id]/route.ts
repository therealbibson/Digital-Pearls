import { NextResponse } from "next/server";
import { updateEngagement, deleteEngagement } from "@/lib/engagements";
import { isAuthenticated } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Admin only: update label / active / order. */
export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const patch: { label?: string; active?: boolean; order?: number } = {};
  if (typeof body.label === "string") patch.label = body.label.trim().slice(0, 120);
  if (typeof body.active === "boolean") patch.active = body.active;
  if (typeof body.order === "number" && Number.isFinite(body.order)) patch.order = body.order;

  if (patch.label === "") {
    return NextResponse.json({ ok: false, error: "Label cannot be empty." }, { status: 422 });
  }

  try {
    const updated = await updateEngagement(id, patch);
    if (!updated) {
      return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, engagement: updated });
  } catch (err) {
    console.error("[engagements PATCH]", err);
    return NextResponse.json({ ok: false, error: "Failed to update." }, { status: 500 });
  }
}

/** Admin only: delete an option. */
export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  try {
    const ok = await deleteEngagement(id);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[engagements DELETE]", err);
    return NextResponse.json({ ok: false, error: "Failed to delete." }, { status: 500 });
  }
}
