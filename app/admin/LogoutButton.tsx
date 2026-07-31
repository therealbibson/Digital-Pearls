"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="rounded-full border border-silver px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-pearl"
    >
      Sign out
    </button>
  );
}
