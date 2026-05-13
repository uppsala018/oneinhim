import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import SiteHeroPanel from "@/components/site-hero-panel";
import Breadcrumb from "@/components/breadcrumb";

export const metadata: Metadata = buildMeta({
  title: "Privacy Policy",
  description:
    "Privacy policy for One In Him Bible Study — how we handle your data, what we collect, and your rights as a user of our free Bible study platform.",
  path: "/privacy",
});

const sections = [
  {
    heading: "Who we are",
    content: (
      <p>
        One In Him Bible Study is a free, independent Bible study and church history platform
        built and maintained by a single developer. The site is available at{" "}
        <strong className="text-[var(--color-ink)]">oneinhimbiblestudy.com</strong>. It is
        ad-free and non-commercial.
      </p>
    ),
  },
  {
    heading: "What data we collect",
    content: (
      <>
        <p className="mb-3">We collect only what is necessary for the platform to function:</p>
        <ul className="space-y-2 text-sm leading-7 text-[var(--color-muted)]">
          <li>
            <strong className="text-[var(--color-ink)]">Email address & account info</strong> —
            collected when you sign in via email/password or Google. Used solely for
            authentication. We do not send marketing emails.
          </li>
          <li>
            <strong className="text-[var(--color-ink)]">User profile data</strong> — display
            name, Christian tradition, bio, and social links you optionally save in your profile.
          </li>
          <li>
            <strong className="text-[var(--color-ink)]">Profile avatar</strong> — if you
            upload a profile image, it is reviewed before becoming publicly visible. Uploaded
            images are processed by automated moderation and stored in Firebase Storage.
          </li>
          <li>
            <strong className="text-[var(--color-ink)]">Prayer Forum posts</strong> — the
            display name and text of threads and replies you post to the forum. Forum content
            is public and visible to all visitors.
          </li>
          <li>
            <strong className="text-[var(--color-ink)]">Beta tester data</strong> — if you
            register as a beta tester, we store your name, email, and country to manage the
            program and notify you of updates.
          </li>
          <li>
            <strong className="text-[var(--color-ink)]">Beta feedback</strong> — bug reports
            and feedback you submit through the beta dashboard, including device type,
            browser information, and the page URL at the time of submission.
          </li>
          <li>
            <strong className="text-[var(--color-ink)]">Study bookmarks and notes</strong> —
            saved locally in your browser. Signed-in users may have some preferences synced
            to their account for cross-device access.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: "Authentication",
    content: (
      <p>
        Sign-in is handled by{" "}
        <strong className="text-[var(--color-ink)]">Firebase Authentication</strong> (Google
        Cloud). You can sign in with an email and password or with your Google account.
        Firebase Auth securely manages session tokens. We do not store your password.
      </p>
    ),
  },
  {
    heading: "Prayer Forum",
    content: (
      <p>
        The Prayer Forum is public. Any thread or reply you post is visible to all visitors,
        including those who are not signed in. Do not post sensitive personal information in
        the forum. The administrator may remove content that violates forum guidelines or
        restrict accounts that misuse the forum.
      </p>
    ),
  },
  {
    heading: "How data is stored",
    content: (
      <p>
        User accounts, profiles, forum data, and beta tester records are stored in{" "}
        <strong className="text-[var(--color-ink)]">Firebase Firestore</strong> (Google
        Cloud). Profile images are stored in{" "}
        <strong className="text-[var(--color-ink)]">Firebase Storage</strong>. The platform
        is hosted on <strong className="text-[var(--color-ink)]">Vercel</strong>. Local
        bookmarks and notes are stored only in your device&apos;s browser storage and are
        not transmitted unless you are signed in.
      </p>
    ),
  },
  {
    heading: "What we do not do",
    content: (
      <ul className="space-y-2 text-sm leading-7 text-[var(--color-muted)]">
        <li>We do not collect your name, address, or phone number.</li>
        <li>We do not track your location.</li>
        <li>We do not show advertising of any kind.</li>
        <li>We do not sell, rent, or share your data with any third party for marketing.</li>
        <li>We do not use third-party analytics trackers beyond standard Vercel hosting logs.</li>
      </ul>
    ),
  },
  {
    heading: "Your rights",
    content: (
      <p>
        You can request deletion of your account and all associated data at any time by
        contacting us at the email below. Local data (bookmarks, notes) can be cleared at
        any time through your browser or device settings. Profile information can be updated
        or removed from your User Panel.
      </p>
    ),
  },
  {
    heading: "Children",
    content: (
      <p>
        This site is not directed at children under 13. We do not knowingly collect personal
        information from children. If you believe a child has submitted data, please contact
        us and we will delete it.
      </p>
    ),
  },
  {
    heading: "Changes to this policy",
    content: (
      <p>
        If this policy changes materially, we will update the date below. Continued use of
        the site after changes constitutes acceptance of the updated policy.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 pt-[96px] pb-24 sm:px-8 lg:pb-14 lg:px-12">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Privacy Policy" },
          ]}
        />

        <SiteHeroPanel
          eyebrow="Privacy"
          title="Privacy Policy"
          lead="How One In Him Bible Study handles your information. We collect only what is needed and never sell your data."
        />

        <p className="mt-6 text-xs text-[var(--color-soft)]">Last updated: May 2026</p>

        <div className="mt-4 flex flex-col gap-5">
          {sections.map((s) => (
            <section
              key={s.heading}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
            >
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-ink)]">
                {s.heading}
              </h2>
              <div className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {s.content}
              </div>
            </section>
          ))}

          {/* Contact section */}
          <section className="overflow-hidden rounded-[2.4rem] border border-[rgba(230,190,120,0.3)] bg-[linear-gradient(145deg,rgba(230,190,120,0.09),rgba(10,10,10,0.85)_48%,rgba(10,10,10,0.96))] p-6 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-highlight)]">
              Contact
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
              Privacy questions
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-[var(--color-muted)]">
              Questions about this privacy policy, data deletion requests, or any other
              privacy-related concerns can be sent to:
            </p>
            <a
              href="mailto:info@oneinhimbiblestudy.com"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(230,190,120,0.55)] bg-[rgba(230,190,120,0.12)] px-8 py-3 text-sm font-semibold text-[var(--color-highlight)] transition hover:bg-[rgba(230,190,120,0.22)]"
            >
              ✉&nbsp; info@oneinhimbiblestudy.com
            </a>
          </section>
        </div>
      </main>
      <MobileBottomNav />
    </>
  );
}
