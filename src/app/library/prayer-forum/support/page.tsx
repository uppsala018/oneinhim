import Link from "next/link";
import MobileBottomNav from "@/components/mobile-bottom-nav";

export default function SupportPage() {
  return (
    <main className="mobile-app-shell donate-page">
      <header className="mobile-section-header">
        <Link href="/library/prayer-forum" className="mobile-section-header__back" aria-label="Back">‹</Link>
        <div>
          <h1>Support</h1>
          <span>Contact &amp; Help</span>
        </div>
        <span />
      </header>

      <div className="donate-body">

        <div className="donate-verse-card">
          <p className="donate-verse-ref">Admin</p>
          <p className="donate-verse-text" style={{ fontSize: "clamp(1.1rem, 4.5vw, 1.4rem)" }}>
            René M — Sweden
          </p>
        </div>

        <div className="donate-mission">
          <h2 className="donate-mission__heading">Get in touch</h2>
          <p className="donate-mission__body">
            Found a bug, have a question, or want to suggest something?
            You are welcome to reach out directly. I read every message.
          </p>
          <p className="donate-mission__body">
            This is a one-person project built out of a desire to see
            Christians from every tradition come together. Feedback
            helps make it better for everyone.
          </p>
        </div>

        <a
          href="mailto:hyu.ai.app@gmail.com"
          className="donate-button"
        >
          ✉ &nbsp;hyu.ai.app@gmail.com
        </a>

        <div className="support-topics">
          <p className="support-topics__heading">You can write about</p>
          <ul className="support-topics__list">
            <li>Bug reports or something not working</li>
            <li>Missing content or a tradition you'd like to see</li>
            <li>Questions about the app or its purpose</li>
            <li>Anything related to the prayer forum</li>
          </ul>
        </div>

        <p className="donate-footer">
          Response time may vary — this is a volunteer project.
          Thank you for your patience and for using One In Him.
        </p>

      </div>

      <MobileBottomNav />
    </main>
  );
}
