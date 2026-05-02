"use client";

import { useEffect } from "react";

export default function PwaBoot() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").then((registration) => {
        void registration.update();
      });
    }
  }, []);

  return null;
}
