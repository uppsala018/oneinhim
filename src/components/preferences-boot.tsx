"use client";

import { useEffect } from "react";
import { applyTheme, readPreferences } from "@/lib/user-preferences";

export default function PreferencesBoot() {
  useEffect(() => {
    const preferences = readPreferences();
    applyTheme(preferences.theme);
  }, []);

  return null;
}
