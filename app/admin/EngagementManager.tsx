"use client";

import { useEffect, useState, useCallback } from "react";
import type { FormEvent } from "react";

type Engagement = {
  id: string;
  label: string;
  order: number;
  active: boolean;
};

export default function EngagementManager() {
  const [items, setItems] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/engagements?all=1", { cache: "no-store" });
      const data = await res.json();
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
      const data = await res.json();
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
      const data = await res.json();
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
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to delete.");
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete.");
    } finally {
      setBusyId(null);
    }
  }

  // Reorder by swapping `order` with the neighbour, then persisting both.
  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const a = items[index];
    const b = items[target];
    // Optimistic swap in the UI.
    const reordered = [...items];
    reordered[index] = b;
    reordered[target] = a;
    setItems(reordered);
    await Promise.all([
      patch(a.id, { order: b.order }),
      patch(b.id, { order: a.order }),
    ]);
    load();
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

      {/* List */}
      <div className="mt-8 divide-y divide-silver/60 rounded-2xl border border-silver/60 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-navy/50">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-navy/50">No options yet. Add one above.</p>
        ) : (
          items.map((it, i) => (
            <div key={it.id} className="flex items-center gap-3 p-4">
              {/* Reorder */}
              <div className="flex flex-col">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || busyId !== null}
                  aria-label="Move up"
                  className="text-navy/40 hover:text-navy disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1 || busyId !== null}
                  aria-label="Move down"
                  className="text-navy/40 hover:text-navy disabled:opacity-30"
                >
                  ▼
                </button>
              </div>

              {/* Label / edit */}
              <div className="flex-1">
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
                  <span className={`text-navy ${it.active ? "" : "line-through opacity-50"}`}>
                    {it.label}
                  </span>
                )}
              </div>

              {/* Active badge */}
              {!it.active && editingId !== it.id ? (
                <span className="rounded-full bg-silver/40 px-2 py-0.5 text-xs text-navy/60">
                  Hidden
                </span>
              ) : null}

              {/* Actions */}
              <div className="flex items-center gap-2">
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
