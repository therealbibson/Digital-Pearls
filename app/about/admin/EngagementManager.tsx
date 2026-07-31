"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { FormEvent, DragEvent } from "react";

type Engagement = {
  id: string;
  label: string;
  order: number;
  active: boolean;
};

type SortMode = "custom" | "az" | "za" | "active" | "hidden";

const SORTS: { value: SortMode; label: string }[] = [
  { value: "custom", label: "Custom order" },
  { value: "az", label: "Label A–Z" },
  { value: "za", label: "Label Z–A" },
  { value: "active", label: "Active first" },
  { value: "hidden", label: "Hidden first" },
];

/** Produce a new array sorted by the chosen mode (does not mutate input). */
function sortItems(items: Engagement[], mode: SortMode): Engagement[] {
  const copy = [...items];
  switch (mode) {
    case "az":
      return copy.sort((a, b) => a.label.localeCompare(b.label));
    case "za":
      return copy.sort((a, b) => b.label.localeCompare(a.label));
    case "active":
      return copy.sort(
        (a, b) => Number(b.active) - Number(a.active) || a.label.localeCompare(b.label)
      );
    case "hidden":
      return copy.sort(
        (a, b) => Number(a.active) - Number(b.active) || a.label.localeCompare(b.label)
      );
    default:
      return copy;
  }
}

/**
 * Read a fetch Response as JSON, but tolerate non-JSON bodies. When the server
 * returns an HTML page (a login redirect or an error page after deploy), calling
 * res.json() throws "Unexpected token '<'". We detect that and surface a clear
 * message instead — usually the admin session has expired.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function readJson(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    if (res.status === 401 || res.status === 403) {
      throw new Error("Your admin session has expired. Please log in again.");
    }
    throw new Error(`Unexpected server response (${res.status}). Please refresh and try again.`);
  }
}

export default function EngagementManager() {
  const [items, setItems] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [sort, setSort] = useState<SortMode>("custom");
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const reordering = useRef(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/engagements?all=1", { cache: "no-store" });
      const data = await readJson(res);
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to load.");
      setItems(data.engagements);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const label = newLabel.trim();
    if (!label) return;
    setBusyId("new");
    try {
      const res = await fetch("/api/engagements", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ label }),
      });
      const data = await readJson(res);
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to add.");
      setItems((prev) => [...prev, data.engagement]);
      setNewLabel("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add.");
    } finally {
      setBusyId(null);
    }
  }

  async function patch(id: string, body: Partial<Engagement>) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/engagements/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await readJson(res);
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to update.");
      setItems((prev) => prev.map((it) => (it.id === id ? data.engagement : it)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this engagement option? This cannot be undone.")) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/engagements/${id}`, { method: "DELETE" });
      const data = await readJson(res);
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to delete.");
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete.");
    } finally {
      setBusyId(null);
    }
  }

  /** Persist the given order (full list) via PUT and sync from the server. */
  async function persistOrder(ordered: Engagement[]) {
    if (reordering.current) return;
    reordering.current = true;
    setError("");
    try {
      const res = await fetch("/api/engagements", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ids: ordered.map((it) => it.id) }),
      });
      const data = await readJson(res);
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to reorder.");
      setItems(data.engagements);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reorder.");
      load(); // fall back to the persisted truth
    } finally {
      reordering.current = false;
    }
  }

  /** Apply a sort from the dropdown, persist it as the new custom order. */
  function applySort(mode: SortMode) {
    setSort(mode);
    if (mode === "custom") return;
    const ordered = sortItems(items, mode);
    setItems(ordered); // optimistic
    persistOrder(ordered);
    setSort("custom"); // once saved, it's just the new manual order
  }

  /* ---------- Drag and drop ---------- */

  function onDragStart(id: string) {
    setDragId(id);
  }

  function onDragOver(e: DragEvent, id: string) {
    e.preventDefault(); // allow drop
    if (id !== overId) setOverId(id);
  }

  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      setOverId(null);
      return;
    }
    const from = items.findIndex((it) => it.id === dragId);
    const to = items.findIndex((it) => it.id === targetId);
    if (from === -1 || to === -1) return;
    const reordered = [...items];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setItems(reordered); // optimistic
    setDragId(null);
    setOverId(null);
    persistOrder(reordered);
  }

  function startEdit(it: Engagement) {
    setEditingId(it.id);
    setEditValue(it.label);
  }

  async function saveEdit(id: string) {
    const label = editValue.trim();
    if (!label) return;
    await patch(id, { label });
    setEditingId(null);
  }

  return (
    <div>
      {/* Add new */}
      <form onSubmit={addItem} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="New engagement option…"
          maxLength={120}
          className="flex-1 rounded-xl border border-silver bg-white px-4 py-3 text-navy transition-colors focus:border-royal focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
        <button
          type="submit"
          disabled={busyId === "new" || !newLabel.trim()}
          className="inline-flex items-center justify-center rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-royal disabled:opacity-60"
        >
          {busyId === "new" ? "Adding…" : "Add option"}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {/* Toolbar: sort */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-navy/50">Drag rows to reorder, or sort them below.</p>
        <label className="flex items-center gap-2 text-sm text-navy/70">
          <span>Sort</span>
          <select
            value={sort}
            onChange={(e) => applySort(e.target.value as SortMode)}
            disabled={loading || items.length === 0 || reordering.current}
            className="rounded-lg border border-silver bg-white px-3 py-2 text-sm text-navy focus:border-royal focus:outline-none focus:ring-2 focus:ring-gold/40"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* List */}
      <div className="mt-4 divide-y divide-silver/60 rounded-2xl border border-silver/60 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-navy/50">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-navy/50">No options yet. Add one above.</p>
        ) : (
          items.map((it) => (
            <div
              key={it.id}
              draggable={editingId === null}
              onDragStart={() => onDragStart(it.id)}
              onDragOver={(e) => onDragOver(e, it.id)}
              onDrop={() => onDrop(it.id)}
              onDragEnd={() => {
                setDragId(null);
                setOverId(null);
              }}
              className={`flex flex-wrap items-center gap-x-3 gap-y-2 p-4 transition-colors ${
                dragId === it.id ? "opacity-40" : ""
              } ${overId === it.id && dragId !== it.id ? "bg-gold/10" : ""}`}
            >
              {/* Drag handle */}
              <span
                aria-hidden
                title="Drag to reorder"
                className="shrink-0 cursor-grab select-none text-navy/30 active:cursor-grabbing"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="9" cy="6" r="1.6" />
                  <circle cx="15" cy="6" r="1.6" />
                  <circle cx="9" cy="12" r="1.6" />
                  <circle cx="15" cy="12" r="1.6" />
                  <circle cx="9" cy="18" r="1.6" />
                  <circle cx="15" cy="18" r="1.6" />
                </svg>
              </span>

              {/* Label / edit */}
              <div className="min-w-0 flex-1">
                {editingId === it.id ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(it.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    autoFocus
                    maxLength={120}
                    className="w-full rounded-lg border border-royal bg-white px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
                  />
                ) : (
                  <>
                    <span className={`block break-words text-navy ${it.active ? "" : "line-through opacity-50"}`}>
                      {it.label}
                    </span>
                    {!it.active ? (
                      <span className="mt-1 inline-block rounded-full bg-silver/40 px-2 py-0.5 text-xs text-navy/60">
                        Hidden
                      </span>
                    ) : null}
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {editingId === it.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(it.id)}
                      disabled={busyId === it.id}
                      className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-royal"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-navy/60 hover:text-navy"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => patch(it.id, { active: !it.active })}
                      disabled={busyId === it.id}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-royal hover:text-navy"
                    >
                      {it.active ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => startEdit(it)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-royal hover:text-navy"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(it.id)}
                      disabled={busyId === it.id}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
