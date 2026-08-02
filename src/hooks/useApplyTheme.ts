import { useEffect, useLayoutEffect, useState } from "react";
import type { ResolvedThemeMode, ThemeMode } from "../shared/types";

const SYSTEM_DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

function getSystemTheme(): ResolvedThemeMode {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return "light";
  }
  return window.matchMedia(SYSTEM_DARK_MODE_QUERY).matches ? "dark" : "light";
}

export function useApplyTheme(theme: ThemeMode): ResolvedThemeMode {
  const [systemTheme, setSystemTheme] =
    useState<ResolvedThemeMode>(getSystemTheme);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const systemDarkMode = window.matchMedia(SYSTEM_DARK_MODE_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    setSystemTheme(systemDarkMode.matches ? "dark" : "light");
    systemDarkMode.addEventListener("change", handleChange);
    return () => {
      systemDarkMode.removeEventListener("change", handleChange);
    };
  }, []);

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  return resolvedTheme;
}
