"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AuthControls from "@/components/auth-controls";

const navLinks = [
  { label: "Scripture", href: "/library/kjv" },
  { label: "Fathers", href: "/library/fathers" },
  { label: "Councils", href: "/library/councils" },
  { label: "Traditions", href: "/library" },
  { label: "History", href: "/library/history" },
  { label: "Prayer Forum", href: "/library/prayer-forum" },
  { label: "Donate", href: "/donate" },
];

export default function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`web-header${scrolled ? " web-header--scrolled" : ""}`}>
      <div className="web-header__inner">
        <Link href="/" className="web-header__brand" onClick={() => setMobileOpen(false)}>
          <span className="web-header__brand-name">One In Him</span>
          <span className="web-header__brand-sub">Bible Study &amp; Church History</span>
        </Link>

        <nav className="web-header__nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="web-header__actions">
          <Link href="/library" className="web-header__cta">
            Explore Library
          </Link>
          <div className="hidden md:block">
            <AuthControls />
          </div>
          <button
            className={`web-header__mobile-toggle${mobileOpen ? " web-header__mobile-toggle--open" : ""}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav
        className={`web-header__mobile-nav${mobileOpen ? " web-header__mobile-nav--open" : ""}`}
        aria-label="Mobile navigation"
      >
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link href="/library" onClick={() => setMobileOpen(false)}>
          Explore Library
        </Link>
      </nav>
    </header>
  );
}

