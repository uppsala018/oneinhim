import type { Metadata } from "next";
import { buildMeta } from "@/lib/seo";
import AppHeader from "@/components/app-header";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = buildMeta({
  title: "Donate — Support One In Him Bible Study",
  description: "Support One In Him — a free Bible study and church history app built for everyone. Your contribution helps keep all resources free and accessible.",
  path: "/donate",
});

export default function DonatePage() {
  return (
    <>
      <AppHeader />

      <main className="donate-web-page">
        <div className="donate-web-inner">

          {/* Hero */}
          <div className="donate-web-hero">
            <span className="donate-web-cross" aria-hidden="true">✝</span>
            <p className="donate-web-ref">John 17:21</p>
            <h1 className="donate-web-title">Support One In Him</h1>
            <p className="donate-web-sub">
              Keep the library free for everyone.
            </p>
          </div>

          {/* Verse */}
          <blockquote className="donate-web-verse">
            &ldquo;That they all may be one, as thou, Father, art in me,
            and I in thee — that they also may be one in us.&rdquo;
          </blockquote>

          {/* Mission */}
          <section className="donate-web-mission" aria-labelledby="mission-heading">
            <h2 className="donate-web-mission__heading" id="mission-heading">
              Why this app exists
            </h2>
            <p className="donate-web-mission__body">
              Jesus did not pray that we would all agree on theology.
              He prayed that we would be <em>one</em> — the same unity
              that exists between the Father and the Son.
            </p>
            <p className="donate-web-mission__body">
              One In Him was built to place the ancient sources side by side:
              Scripture in every tradition, the Church Fathers, the Councils,
              the great confessions. Not to settle who is right, but to help
              Christians from every tradition sit at the same table,
              learn from one another, and recognise what we share.
            </p>
            <p className="donate-web-mission__body">
              If this has been useful to your walk, please consider
              supporting it so it can keep growing.
            </p>
          </section>

          {/* CTA */}
          <div className="donate-web-cta">
            <a
              href="https://www.paypal.com/ncp/payment/CCWF6ADJJK5CL"
              className="donate-web-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              ☩ &nbsp; Donate via PayPal
            </a>
            <p className="donate-web-note">
              Every contribution, however small, helps keep the app
              free and ad-free for everyone.
            </p>
          </div>

        </div>
      </main>

      <SiteFooter />
    </>
  );
}

