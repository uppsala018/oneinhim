"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, isFirebaseConfigured } from "@/lib/firebase-client";
import { signOut, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Bibles", href: "/library/bibles" },
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
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    if (!isFirebaseConfigured || !auth) return;
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  return (
    <header className={`web-header${scrolled ? " web-header--scrolled" : ""}`}>
      <div className="web-header__inner">
        <Link href="/" className="web-header__brand" onClick={() => setMobileOpen(false)}>
          <span className="web-header__brand-name">One In Him</span>
          <span className="web-header__brand-sub">Bible Study &amp; Church History</span>
        </Link>

        <nav className="web-header__nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="web-header__actions">
          <Link href="/library" className="web-header__cta">
            Explore Library
          </Link>
          <Link href="/beta-tester" className="text-sm text-red-500 hover:text-red-600 ml-4">
            Beta testers wanted
          </Link>
          {user ? (
            <div className="hidden md:flex items-center ml-4">
              <button
                onClick={handleSignOut}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:block text-sm text-[var(--color-ink)] hover:text-[var(--color-gold)] ml-4"
            >
              Sign in
            </Link>
          )}
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
        {user ? (
          <button
            onClick={() => {
              handleSignOut();
              setMobileOpen(false);
            }}
            className="px-4 py-2 text-sm text-red-500 hover:text-red-600 text-left w-full"
          >
            Sign out
          </button>
        ) : (
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="px-4 py-2 text-sm text-[var(--color-ink)] hover:text-[var(--color-gold)]"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
