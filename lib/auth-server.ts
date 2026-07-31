import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

/**
 * Server-only auth helpers that read the request cookies via `next/headers`.
 * Do NOT import this from `middleware.ts` (Edge runtime) — use the pure
 * `verifySessionToken` from `./auth` there instead.
 */

/** Read the current request's cookie and check it (server components / route handlers). */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
