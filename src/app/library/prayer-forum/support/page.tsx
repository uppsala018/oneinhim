import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import SiteHeroPanel from "@/components/site-hero-panel";
import Breadcrumb from "@/components/breadcrumb";

export const metadata: Metadata = buildMeta({
  title: "Contact & Support",
  description:
    "Contact One In Him Bible Study — email us with questions, bug reports, feedback, or help with your account.",
  path: "/library/prayer-forum/support",
});

const topics = [
  {
    icon: "✦",
    heading: "Questions about the site",
    body: "General questions about the app, the library, or how things work.",
  },
  {
    icon: "⚙",
    heading: "Bug reports & technical issues",
    body: "Something broken, pages not loading, or features not working as expected.",
  },
  {
    icon: "✒",
    heading: "Content feedback",
    body: "Broken links, missing content, or a tradition or resource you would like to see added.",
  },
  {
    icon: "◎",
    heading: "Account & login help",
    body: "Problems signing in, managing your profile, or accessing your account.",
  },
];

export default function ContactPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-24 sm:px-8 lg:pb-14 lg:px-12">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Contact" },
          ]}
        />

        <SiteHeroPanel
          eyebrow="Contact"
          title="Get in Touch"
          lead="Have a question, found a bug, or want to share feedback? Send an email — every message is read."
        />

        {/* Email CTA */}
        <section className="mt-8 overflow-hidden rounded-[2.4rem] border border-[rgba(230,190,120,0.3)] bg-[linear-gradient(145deg,rgba(230,190,120,0.09),rgba(10,10,10,0.85)_48%,rgba(10,10,10,0.96))] p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-highlight)]">
            Email
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
            Write to us
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-[var(--color-muted)]">
            This is a small project run by a single developer. Response time may
            vary, but every message is read and appreciated.
          </p>
          <a
            href="mailto:info@oneinhimbiblestudy.com"
            aria-label="Email One In Him Bible Study support at info@oneinhimbiblestudy.com"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(230,190,120,0.55)] bg-[rgba(230,190,120,0.12)] px-8 py-3 text-sm font-semibold text-[var(--color-highlight)] transition hover:bg-[rgba(230,190,120,0.22)]"
          >
            ✉&nbsp; info@oneinhimbiblestudy.com
          </a>
        </section>

        {/* Topic cards */}
        <section className="mt-8 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-highlight)]">
            You can write about
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
            What to include
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {topics.map((t) => (
              <div
                key={t.heading}
                className="rounded-[1.4rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.52)] p-4"
              >
                <p className="text-base text-[var(--color-highlight)]" aria-hidden="true">{t.icon}</p>
                <h3 className="mt-2 font-semibold text-[var(--color-ink)]">{t.heading}</h3>
                <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">{t.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Note */}
        <p className="mt-6 text-center text-sm text-[var(--color-soft)]">
          Response time may vary — this is a volunteer project. Thank you for your patience.
        </p>
      </main>
      <MobileBottomNav />
    </>
  );
}
