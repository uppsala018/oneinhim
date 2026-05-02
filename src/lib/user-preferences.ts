export type ThemeMode = "dark" | "light" | "system";

export type UserPreferences = {
  theme: ThemeMode;
  showStrongs: boolean;
  compactReader: boolean;
};

const storageKey = "one-in-him-user-preferences";

export const defaultPreferences: UserPreferences = {
  theme: "dark",
  showStrongs: true,
  compactReader: false,
};

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "dark" || value === "light" || value === "system";
}

export function readPreferences(): UserPreferences {
  if (typeof window === "undefined") {
    return defaultPreferences;
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return defaultPreferences;
    }

    const parsed = JSON.parse(stored) as Partial<UserPreferences>;
    return {
      theme: isThemeMode(parsed.theme) ? parsed.theme : defaultPreferences.theme,
      showStrongs:
        typeof parsed.showStrongs === "boolean"
          ? parsed.showStrongs
          : defaultPreferences.showStrongs,
      compactReader:
        typeof parsed.compactReader === "boolean"
          ? parsed.compactReader
          : defaultPreferences.compactReader,
    };
  } catch {
    return defaultPreferences;
  }
}

export function savePreferences(preferences: UserPreferences) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(preferences));
  } catch {
    // Ignore persistence errors in restricted browser contexts.
  }
}

function resolveTheme(theme: ThemeMode) {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  return theme;
}

export function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const resolvedTheme = resolveTheme(theme);
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.style.colorScheme = resolvedTheme;
}
