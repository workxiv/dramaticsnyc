import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { CONTACT_EMAIL, LOCATIONS, SOCIAL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Dramatics NYC. Email us, send a message, or call any of our five Manhattan hair salons directly.",
  alternates: {
    canonical: "https://www.dramaticsnyc.com/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper pt-28 sm:pt-36">
        <div className="mx-auto max-w-[1200px] px-5 pb-20 sm:px-8 sm:pb-28">
          <p className="eyebrow text-center text-coral">Contact Us</p>
          <h1 className="heading-fluid mt-5 text-center font-display font-medium text-balance">
            We&apos;d love to hear from you.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-center text-ink-soft sm:text-lg">
            Questions about a service, a product order, or which salon is right
            for you? Send us a note and we&apos;ll get back to you. To book, call
            your salon or use online booking.
          </p>

          <div className="mt-10 grid items-stretch gap-4 sm:mt-12 sm:gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            <aside className="flex flex-col gap-4 sm:gap-6 lg:col-span-5">
              <div className="card-soft flex flex-1 flex-col border border-ink/8 bg-cream p-5 sm:p-8">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink-mute">
                  Call a salon
                </p>
                <ul className="mt-3 flex flex-1 flex-col justify-around divide-y divide-ink/10 sm:mt-4">
                  {LOCATIONS.map((l) => (
                    <li key={l.id} className="flex items-center justify-between gap-4 py-2.5 sm:py-3">
                      <div>
                        <Link
                          href={`/locations/${l.slug}`}
                          className="font-semibold hover:text-coral"
                        >
                          {l.street}
                        </Link>
                        <p className="text-xs text-ink-mute">{l.neighborhood}</p>
                      </div>
                      <a
                        href={`tel:${l.tel}`}
                        className="shrink-0 text-sm font-semibold text-ink-soft hover:text-ink"
                      >
                        {l.phone}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-ink-mute sm:mt-4">
                  Open Mon to Sat 9am to 7pm, Sun 9am to 6pm.
                </p>
              </div>

              <div className="card-soft border border-ink/8 bg-pink p-5 sm:p-8">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink-mute">
                  Email
                </p>
                <p className="mt-2 font-display text-xl font-semibold sm:text-2xl">
                  Reach out
                </p>
                <p className="mt-2 text-sm text-ink-soft sm:mt-3">
                  For general questions, product orders and anything not tied to
                  a specific appointment.
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="btn-pill mt-4 inline-flex items-center gap-2 px-6 py-3 text-sm"
                >
                  Email us
                  <span aria-hidden>→</span>
                </a>
                <div className="mt-4 flex flex-wrap gap-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink-mute sm:mt-5">
                  {SOCIAL.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-block py-1 hover:text-ink"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
