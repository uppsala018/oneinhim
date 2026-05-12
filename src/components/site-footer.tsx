import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="web-footer">
      <div className="web-footer__inner">
        <div className="web-footer__top">
          <div className="web-footer__brand-block">
            <span className="web-footer__brand">One In Him</span>
            <span className="web-footer__domain">oneinhimbiblestudy.com</span>
            <p className="web-footer__tagline">
              Bible Study &amp; Church History &mdash; free, for everyone.
            </p>
          </div>

          <a
            href="https://www.oneinhimbiblestudy.com"
            className="web-footer__app-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="web-footer__app-btn-icon">✝</span>
            <span className="web-footer__app-btn-text">
              <strong>Install our Bible App</strong>
              <span>Free &mdash; works on Android &amp; iPhone</span>
            </span>
            <span className="web-footer__app-btn-arrow">&#x2197;</span>
          </a>
        </div>

        <div className="web-footer__divider" />

        <div className="web-footer__bottom">
          <nav className="web-footer__links" aria-label="Footer navigation">
            <Link href="/library">Library</Link>
            <Link href="/library/kjv">KJV Bible</Link>
            <Link href="/library/fathers">Church Fathers</Link>
            <Link href="/library/councils">Councils</Link>
            <Link href="/library/history">History</Link>
            <Link href="/library/prayer-forum">Prayer Forum</Link>
            <Link href="/donate">Donate</Link>
            <Link href="/privacy">Privacy</Link>
          </nav>
          <p className="web-footer__copy">
            &copy; {new Date().getFullYear()} One In Him. All content from public domain and freely redistributable sources.
          </p>
        </div>
      </div>
    </footer>
  );
}
