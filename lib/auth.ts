import { SignJWT, jwtVerify } from "jose";

/**
 * Self-contained single-admin auth: a signed JWT stored in an httpOnly cookie.
 * This module is Edge-safe (only WebCrypto via `jose`, no `next/headers`) so it
 * can be imported from `middleware.ts`. Cookie-reading helpers that depend on
 * `next/headers` live in `auth-server.ts`.
 */

export const SESSION_COOKIE = "dp_admin";
const ISSUER = "digital-pearls";
const AUDIENCE = "admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET is not set (min 16 chars). Add it to .env.local.");
  }
  return new TextEncoder().encode(secret);
}

/** Create a signed session token (call after verifying the password). */
export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

/** Verify a token string. Returns true when valid. Never throws. */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, secretKey(), { issuer: ISSUER, audience: AUDIENCE });
    return true;
  } catch {
    return false;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};
