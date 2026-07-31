"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      const from = params.get("from");
      router.replace(from && from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-midnight px-6">
      <div className="w-full max-w-sm rounded-3xl border border-royal/30 bg-white p-8 shadow-2xl">
        <div className="mb-6">
          <span className="font-display text-xl text-navy">Digital Pearls</span>
          <span className="mt-1 block text-[10px] font-semibold tracking-[0.3em] text-gold">
            ADMIN
          </span>
        </div>
        <h1 className="font-display text-2xl text-navy">Sign in</h1>
        <p className="mt-1 text-sm text-navy/60">Enter the admin password to continue.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-navy">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full rounded-xl border border-silver bg-white px-4 py-3 text-navy transition-colors focus:border-royal focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-royal disabled:opacity-70"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
