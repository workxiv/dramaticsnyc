import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminConfig, checkPassword, newSessionValue } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 8 attempts per IP per 15 minutes; enough for typos, useless for guessing.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_TRIES = 8;
const tries = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (tries.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  tries.set(ip, recent);
  if (tries.size > 2000) tries.clear();
  return recent.length > MAX_TRIES;
}

export async function POST(req: Request) {
  const back = (reason: string) =>
    NextResponse.redirect(new URL(`/admin?error=${reason}`, req.url), { status: 303 });

  if (!adminConfig()) return back("unconfigured");
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return back("slow");

  const form = await req.formData().catch(() => null);
  const password = String(form?.get("password") ?? "");
  if (!password || !checkPassword(password)) return back("wrong");

  const next = String(form?.get("next") ?? "");
  const dest = next.startsWith("/admin") && !next.includes("//") ? next : "/admin/orders";
  const res = NextResponse.redirect(new URL(dest, req.url), { status: 303 });
  const s = newSessionValue();
  res.cookies.set(ADMIN_COOKIE, s.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    path: "/",
    maxAge: s.maxAge,
  });
  return res;
}
