import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Staff-only area (/admin). One shared password, HttpOnly signed cookie.
 *
 * Env:
 *   ADMIN_PASSWORD  the staff password
 *   ARCHIVE_KEY     64 hex chars; decrypts the order archive and signs sessions
 */

export const ADMIN_COOKIE = "dnyc_admin";
const SESSION_HOURS = 12;

export function adminConfig() {
  const password = process.env.ADMIN_PASSWORD;
  const key = process.env.ARCHIVE_KEY;
  if (!password || !key || !/^[0-9a-f]{64}$/i.test(key)) return null;
  return { password, key };
}

function sign(payload: string, key: string) {
  return createHmac("sha256", Buffer.from(key, "hex"))
    .update(`session:${payload}`)
    .digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function checkPassword(given: string) {
  const cfg = adminConfig();
  if (!cfg) return false;
  return safeEqual(given, cfg.password);
}

/** Cookie value for a fresh session: `<expiresAtMs>.<hmac>`. */
export function newSessionValue() {
  const cfg = adminConfig();
  if (!cfg) throw new Error("Admin area is not configured");
  const exp = String(Date.now() + SESSION_HOURS * 3600 * 1000);
  return { value: `${exp}.${sign(exp, cfg.key)}`, maxAge: SESSION_HOURS * 3600 };
}

export function verifySessionValue(value: string | undefined) {
  const cfg = adminConfig();
  if (!cfg || !value) return false;
  const [exp, mac] = value.split(".");
  if (!exp || !mac || !/^\d+$/.test(exp)) return false;
  if (Number(exp) < Date.now()) return false;
  return safeEqual(mac, sign(exp, cfg.key));
}

export async function isAdmin() {
  const jar = await cookies();
  return verifySessionValue(jar.get(ADMIN_COOKIE)?.value);
}
