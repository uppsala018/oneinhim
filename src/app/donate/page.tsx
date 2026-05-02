import Link from "next/link";
import MobileBottomNav from "@/components/mobile-bottom-nav";

export default function DonatePage() {
  return (
    <main className="mobile-app-shell donate-page">
      <header className="mobile-section-header">
        <Link href="/" className="mobile-section-header__back" aria-label="Back">‹</Link>
        <div>
          <h1>Support</h1>
          <span>One In Him</span>
        </div>
        <span />
      </header>

      <div className="donate-body">

        <div className="donate-verse-card">
          <p className="donate-verse-ref">John 17:21</p>
          <blockquote className="donate-verse-text">
            &ldquo;That they all may be one, as thou, Father, art in me,
            and I in thee — that they also may be one in us.&rdquo;
          </blockquote>
        </div>

        <div className="donate-mission">
          <h2 className="donate-mission__heading">Why this app exists</h2>
          <p className="donate-mission__body">
            Jesus did not pray that we would all agree on theology.
            He prayed that we would be <em>one</em> — the same unity
            that exists between the Father and the Son.
          </p>
          <p className="donate-mission__body">
            One In Him was built to place the ancient sources side by side:
            Scripture in every tradition, the Church Fathers, the Councils,
            the great confessions. Not to settle who is right, but to help
            Christians from every tradition sit at the same table,
            learn from one another, and recognise what we share.
          </p>
          <p className="donate-mission__body">
            If this has been useful to your walk, please consider
            supporting it so it can keep growing.
          </p>
        </div>

        <a
          href="https://www.paypal.com/ncp/payment/CCWF6ADJJK5CL"
          className="donate-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          ☩ &nbsp;Donate via PayPal
        </a>

        <p className="donate-footer">
          Every contribution, however small, helps keep the app
          free and ad-free for everyone.
        </p>

      </div>

      <MobileBottomNav />
    </main>
  );
}
