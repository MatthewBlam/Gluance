import { useEffect, useLayoutEffect, useState } from "react";
import type { ResolvedThemeMode, ThemeMode } from "../shared/types";

const SYSTEM_DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

/**
 * Best-effort seed for the first paint. Only trustworthy while no theme is
 * forced — `nativeTheme.themeSource` overrides `prefers-color-scheme` in the
 * renderer, so once the user picks light or dark this reports that choice back
 * rather than the OS appearance. The main process supplies the real value.
 */
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
    let cancelled = false;

    window.api
      ?.getSystemTheme?.()
      .then((osTheme) => {
        if (!cancelled) setSystemTheme(osTheme);
      })
      .catch(() => {});

    const unsubscribe = window.api?.onSystemThemeChanged?.(setSystemTheme);
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  return resolvedTheme;
}
