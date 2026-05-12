"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PwaInstallButton({ className }: { className?: string }) {
  const [prompt, setPrompt] = useState<Event | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => { e.preventDefault(); setPrompt(e); };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prompt as any).prompt();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { outcome } = await (prompt as any).userChoice;
    if (outcome === "accepted") setInstalled(true);
    setPrompt(null);
  };

  if (installed) return null;

  // If the browser supports the install prompt use it; otherwise fall back to the library
  if (prompt) {
    return (
      <button onClick={handleInstall} className={className}>
        Install the App
      </button>
    );
  }

  return (
    <Link href="/library" className={className}>
      Open the App
    </Link>
  );
}
