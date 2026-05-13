"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase-client";
import { signOut, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

const navLinks = [
  { label: "Bibles", href: "/library/bibles" },
  { label: "Fathers", href: "/library/fathers" },
  { label: "Councils", href: "/library/councils" },
  { label: "Traditions", href: "/library/traditions" },
  { label: "History", href: "/library/history" },
  { label: "Prayer Forum", href: "/library/prayer-forum" },
  { label: "Donate", href: "/donate" },
];

type HeaderProfile = {
  avatarStatus?: string;
  avatarApprovedURL?: string;
};

export default function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<HeaderProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      setProfile(null);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser || !db) {
        setProfile(null);
        return;
      }

      void getDoc(doc(db, "users", currentUser.uid))
        .then((snapshot) => {
          const data = snapshot.data() as HeaderProfile | undefined;
          setProfile(data ?? null);
        })
        .catch((err) => {
          console.error("Failed to load header profile:", err);
          setProfile(null);
        });
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
          {!user && (
            <Link href="/beta-tester" className="hidden xl:block text-sm text-red-500 hover:text-red-600 ml-4">
              Join Beta
            </Link>
          )}
          {user ? (
            <Link
              href="/user-panel"
              className="hidden md:inline-flex items-center gap-2 ml-4 text-sm text-[var(--color-ink)] hover:text-[var(--color-highlight)] transition-colors"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[rgba(10,10,10,0.48)] text-xs text-[var(--color-highlight)]">
                {profile?.avatarStatus === "approved" && profile.avatarApprovedURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarApprovedURL} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span aria-hidden="true">◎</span>
                )}
              </span>
              User Panel
            </Link>
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
        {!user && (
          <Link href="/beta-tester" onClick={() => setMobileOpen(false)}>
            Join Beta
          </Link>
        )}
        {user ? (
          <>
            <Link href="/user-panel" onClick={() => setMobileOpen(false)}>
              User Panel
            </Link>
            <button
              onClick={() => {
                handleSignOut();
                setMobileOpen(false);
              }}
              className="px-4 py-2 text-sm text-red-500 hover:text-red-600 text-left w-full"
            >
              Sign out
            </button>
          </>
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
