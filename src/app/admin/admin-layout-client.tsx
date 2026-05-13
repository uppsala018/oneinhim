"use client";

import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { useAuth } from "@/lib/use-auth";
import { ADMIN_EMAIL } from "@/lib/constants";

const adminNavLinks = [
  { href: "/admin/beta", label: "Admin Dashboard" },
  { href: "/admin/forum-seed", label: "Forum Seed" },
  { href: "/user-panel", label: "User Panel" },
];

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  return (
    <>
      <AppHeader />
      <div className="pt-[var(--header-height,96px)]">
        {loading ? (
          <p className="px-6 py-10 text-sm text-[var(--color-muted)]">Checking admin access...</p>
        ) : !user ? (
          <main className="mx-auto max-w-4xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
            <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-highlight)]">
                Admin
              </p>
              <h1 className="site-page-title mt-3">Sign in required</h1>
              <p className="site-heading-lead mt-4">
                This area is restricted to administrators. Please sign in to continue.
              </p>
              <Link
                href="/login?next=/admin/beta"
                className="mt-6 inline-flex rounded-full bg-[var(--color-highlight)] px-6 py-2.5 text-sm font-semibold text-[#080808]"
              >
                Sign in
              </Link>
            </section>
          </main>
        ) : user.email !== ADMIN_EMAIL ? (
          <main className="mx-auto max-w-4xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
            <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-highlight)]">
                Admin
              </p>
              <h1 className="site-page-title mt-3">Access denied</h1>
              <p className="site-heading-lead mt-4">
                You do not have permission to view this area.
              </p>
              <Link
                href="/user-panel"
                className="mt-6 inline-flex rounded-full border border-[var(--color-border)] px-6 py-2.5 text-sm text-[var(--color-ink)] hover:border-[var(--color-highlight)]"
              >
                Return to User Panel
              </Link>
            </section>
          </main>
        ) : (
          <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-14">
            <nav className="flex flex-wrap gap-2" aria-label="Admin navigation">
              {adminNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm text-[var(--color-ink)] transition hover:border-[var(--color-highlight)] hover:text-[var(--color-highlight)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {children}
          </main>
        )}
      </div>
      <MobileBottomNav />
    </>
  );
}
