import Reveal from "./Reveal";
import { FAQS } from "@/lib/content";

export default function Faq() {
  return (
    <section id="faq" className="relative bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-[900px] px-5 sm:px-8">
        <div className="text-center">
          <Reveal>
            <p className="eyebrow text-coral">FAQ</p>
            <h2 className="heading-fluid mt-5 font-display font-medium">
              Frequently asked questions
            </h2>
          </Reveal>
        </div>

        <div className="mt-12 space-y-3">
          {FAQS.map((faq, i) => (
            <Reveal key={faq.question} delay={0.04 * i} y={24}>
              <details className="faq-item card-soft border border-ink/10 bg-cream open:bg-paper">
                <summary className="flex items-center justify-between gap-4 p-6">
                  <h3 className="font-display text-lg font-semibold sm:text-xl">
                    {faq.question}
                  </h3>
                  <span
                    className="faq-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-lg"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p className="px-6 pb-6 leading-relaxed text-ink-soft">
                  {faq.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
