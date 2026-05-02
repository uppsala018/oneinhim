import Link from "next/link";
import MobileBottomNav from "@/components/mobile-bottom-nav";

export default function PrivacyPage() {
  return (
    <main className="mobile-app-shell donate-page">
      <header className="mobile-section-header">
        <Link href="/" className="mobile-section-header__back" aria-label="Back">‹</Link>
        <div>
          <h1>Privacy Policy</h1>
          <span>One In Him</span>
        </div>
        <span />
      </header>

      <div className="privacy-body">

        <p className="privacy-meta">Last updated: May 2026</p>

        <section className="privacy-section">
          <h2>Who we are</h2>
          <p>
            One In Him Biblestudy &amp; Church History is a free, independent Bible study
            app built and maintained by a single developer. The app is available on the web
            at <strong>bible-study-virid.vercel.app</strong> and on Android via Google Play.
          </p>
        </section>

        <section className="privacy-section">
          <h2>What data we collect</h2>
          <p>We collect only what is necessary for the app to function:</p>
          <ul>
            <li>
              <strong>Email address</strong> — if you choose to sign in using a magic link.
              Your email is used solely to authenticate you. We do not send marketing emails.
            </li>
            <li>
              <strong>Prayer forum posts</strong> — the display name and text you submit
              to the Community forum. These are visible to all users of the app.
            </li>
            <li>
              <strong>Study bookmarks and notes</strong> — saved locally on your device.
              If you are signed in, they are also synced to your account so you can access
              them across devices.
            </li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>What we do not collect</h2>
          <ul>
            <li>We do not collect your name, address, or phone number.</li>
            <li>We do not track your location.</li>
            <li>We do not use advertising networks or sell your data to any third party.</li>
            <li>We do not use analytics beyond what Vercel provides for hosting.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>How your data is stored</h2>
          <p>
            Authentication and synced study data are stored using{" "}
            <strong>Supabase</strong>, a secure cloud database provider.
            Supabase stores data in EU-region servers and complies with
            GDPR. Local bookmarks and notes are stored only in your
            device&apos;s browser storage and are not transmitted unless
            you are signed in.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Community forum</h2>
          <p>
            Posts submitted to the Community forum are public and visible to all users.
            Do not include sensitive personal information in a forum post.
            The app administrator may remove posts that violate the forum guidelines
            or restrict accounts that misuse the forum.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Your rights</h2>
          <p>
            You can request deletion of your account and all associated data at any time
            by contacting us at the email below. Local data (bookmarks, notes) can be
            cleared at any time through your browser or device settings.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Children</h2>
          <p>
            This app is not directed at children under 13. We do not knowingly collect
            personal information from children.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Changes to this policy</h2>
          <p>
            If this policy changes materially, we will update the date at the top of this
            page. Continued use of the app after changes means you accept the updated policy.
          </p>
        </section>

        <section className="privacy-section privacy-section--contact">
          <h2>Contact</h2>
          <p>Questions about this privacy policy can be sent to:</p>
          <a href="mailto:hyu.ai.app@gmail.com" className="privacy-contact-link">
            hyu.ai.app@gmail.com
          </a>
        </section>

      </div>

      <MobileBottomNav />
    </main>
  );
}
