"use client";

import { useState } from "react";
import { CONTACT_EMAIL, LOCATIONS } from "@/lib/content";

const field =
  "w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-[0.95rem] text-ink placeholder:text-ink-mute/70 outline-none transition-colors focus:border-ink/50";
const label = "mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink-mute";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="card-soft border border-ink/8 bg-sage p-8 text-center">
        <p className="font-display text-2xl font-semibold">Thanks, we got it.</p>
        <p className="mt-2 text-ink-soft">
          We&apos;ll get back to you soon. For anything urgent, call your salon directly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-pill-outline mt-6 px-7 py-3 text-sm"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-soft flex h-full flex-col border border-ink/8 bg-cream p-6 sm:p-8">
      <div className="grid flex-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className={label}>Name</label>
          <input id="c-name" name="name" required maxLength={120} autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="c-email" className={label}>Email</label>
          <input id="c-email" name="email" type="email" required maxLength={200} autoComplete="email" className={field} />
        </div>
        <div>
          <label htmlFor="c-phone" className={label}>Phone (optional)</label>
          <input id="c-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={field} />
        </div>
        <div>
          <label htmlFor="c-salon" className={label}>Salon</label>
          <select id="c-salon" name="salon" defaultValue="" className={field}>
            <option value="">Not sure / general</option>
            {LOCATIONS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.street} · {l.neighborhood}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col sm:col-span-2">
          <label htmlFor="c-message" className={label}>Message</label>
          <textarea id="c-message" name="message" required rows={6} maxLength={4000} className={`${field} min-h-[10rem] flex-1`} />
        </div>
        {/* honeypot, hidden from people */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="c-company">Company</label>
          <input id="c-company" name="company" tabIndex={-1} autoComplete="off" />
        </div>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-4 text-sm font-semibold text-coral">
          {error}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "sending"} className="btn-flow px-9 py-3.5 text-[0.95rem] disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <span className="text-sm text-ink-mute">
          or email <a href={`mailto:${CONTACT_EMAIL}`} className="link-underline text-ink">{CONTACT_EMAIL}</a>
        </span>
      </div>
    </form>
  );
}
