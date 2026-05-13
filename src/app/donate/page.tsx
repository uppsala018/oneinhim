import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import Breadcrumb from "@/components/breadcrumb";
import SiteFooter from "@/components/site-footer";
import SiteHeroPanel from "@/components/site-hero-panel";

export const metadata: Metadata = buildMeta({
  title: "Donate",
  description:
    "Support One In Him Bible Study, a free and ad-free Christian library for Scripture, Church Fathers, councils, and church history.",
  keywords:
    "donate, support bible study, one in him, free bible study, christian mission, ad-free",
  path: "/donate",
});

const PAYPAL_HREF = "https://www.paypal.com/ncp/payment/CCWF6ADJJK5CL";

const supportItems = [
  {
    icon: "⚙",
    title: "Hosting & infrastructure",
    detail: "Servers, CDN, and database costs that keep the site fast and available to everyone.",
  },
  {
    icon: "✦",
    title: "Development & maintenance",
    detail: "Ongoing work to fix bugs, improve the tools, and keep the library up to date.",
  },
  {
    icon: "✒",
    title: "Content expansion",
    detail: "More Church Fathers, council pages, history topics, and tradition study paths.",
  },
  {
    icon: "◉",
    title: "Future study tools",
    detail: "Cross-referencing, commentary access, and richer reading and annotation experiences.",
  },
];

export default function DonatePage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-24 sm:px-8 lg:px-12">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Donate" }]} />

        {/* Hero panel */}
        <SiteHeroPanel
          eyebrow="Support the Mission"
          title="Keep the Library Free"
          lead="One In Him Bible Study is free to use, free of advertising, and open to every Christian tradition. If it has served your study, please consider giving — every gift, however small, helps keep the tools running and growing."
        >
          <div className="mt-8">
            <a
              href={PAYPAL_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-[rgba(230,190,120,0.55)] bg-[rgba(230,190,120,0.12)] px-8 py-3.5 text-sm font-semibold text-[var(--color-highlight)] transition hover:bg-[rgba(230,190,120,0.22)]"
            >
              ☩&nbsp; Donate via PayPal
            </a>
            <p className="mt-3 text-xs text-[var(--color-soft)]">
              Secure payment through PayPal. No account required.
            </p>
          </div>
        </SiteHeroPanel>

        {/* Scripture anchor */}
        <blockquote className="mt-8 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-8">
          <p className="font-[family-name:var(--font-display)] text-xl italic leading-8 text-[var(--color-ink)] md:text-2xl">
            &ldquo;That they all may be one; as thou, Father, art in me, and I in thee,
            that they also may be one in us.&rdquo;
          </p>
          <footer className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-highlight)]">
            John 17:21 &mdash; KJV
          </footer>
        </blockquote>

        {/* Mission */}
        <section
          className="mt-8 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-8"
          aria-labelledby="mission-heading"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
            The Mission
          </p>
          <h2
            id="mission-heading"
            className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]"
          >
            Why this project exists
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--color-muted)]">
            <p>
              Jesus prayed not that Christians would agree on every point of doctrine, but that
              they would be{" "}
              <span className="font-medium text-[var(--color-ink)]">one</span> — the same unity
              that exists between the Father and the Son.
            </p>
            <p>
              One In Him was built to place the ancient sources side by side: Scripture in every
              tradition&apos;s translation, the Church Fathers in full text, all seven Ecumenical
              Councils, the Roman Catechism of Trent, and 2000 years of church history. Not to
              settle every argument, but to help Catholics, Orthodox, Oriental Orthodox, and
              Protestant Christians study together at the same table.
            </p>
            <p>
              There are no ads, no paywalls, and no subscription fees. The goal is simply to
              keep the best free Bible study tools available to anyone, from anywhere, in any
              tradition.
            </p>
          </div>
        </section>

        {/* What support covers */}
        <section className="mt-8" aria-labelledby="support-heading">
          <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
              Your Gift
            </p>
            <h2
              id="support-heading"
              className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]"
            >
              What your support helps with
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {supportItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.52)] p-4"
                >
                  <p className="text-base text-[var(--color-highlight)]">{item.icon}</p>
                  <p className="mt-2 font-semibold text-[var(--color-ink)]">{item.title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA card */}
        <section className="mt-8 overflow-hidden rounded-[2.4rem] border border-[rgba(230,190,120,0.3)] bg-[linear-gradient(145deg,rgba(230,190,120,0.09),rgba(10,10,10,0.85)_48%,rgba(10,10,10,0.96))] p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-highlight)]">
            Give Today
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
            Every gift matters
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-[var(--color-muted)]">
            Even a small contribution covers real costs — hosting, development, and the ongoing
            work of expanding the library. There is no minimum amount. Everything helps.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href={PAYPAL_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-[rgba(230,190,120,0.55)] bg-[rgba(230,190,120,0.14)] px-8 py-3.5 text-sm font-semibold text-[var(--color-highlight)] transition hover:bg-[rgba(230,190,120,0.26)]"
            >
              ☩&nbsp; Donate via PayPal
            </a>
            <p className="text-xs text-[var(--color-soft)]">
              Secure payment. No PayPal account required.
            </p>
          </div>
        </section>

        {/* Reassurance */}
        <section className="mt-8 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              [
                "✦",
                "Free to use",
                "No account, no payment, no wall. Every page of the library is open to anyone.",
              ],
              [
                "◎",
                "Ad-free",
                "No banner ads, trackers, or sponsored content. Just the texts, the fathers, and the history.",
              ],
              [
                "✝",
                "Every tradition welcome",
                "Built for Catholic, Orthodox, Oriental Orthodox, and Protestant Christians studying side by side.",
              ],
            ].map(([icon, heading, text]) => (
              <div key={heading as string}>
                <p className="text-base text-[var(--color-highlight)]">{icon}</p>
                <p className="mt-2 font-semibold text-[var(--color-ink)]">{heading}</p>
                <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 text-center">
          <Link
            href="/library"
            className="text-sm text-[var(--color-highlight)] hover:underline"
          >
            ← Return to the Library
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
