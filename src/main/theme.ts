import { nativeTheme, systemPreferences } from "electron";
import type { ResolvedThemeMode, ThemeMode } from "../shared/types";

// Captured before any themeSource override is applied, so it still reflects the
// real OS appearance on platforms without a queryable system preference.
const osThemeAtStartup: ResolvedThemeMode = nativeTheme.shouldUseDarkColors
  ? "dark"
  : "light";

export function applyNativeTheme(theme: ThemeMode): void {
  nativeTheme.themeSource = theme;
}

/**
 * The OS appearance, independent of any theme we force.
 *
 * Setting `nativeTheme.themeSource` overrides `prefers-color-scheme` in every
 * renderer, so the renderer's own `matchMedia` reports whatever theme the user
 * picked rather than the system one. Reading the OS preference here keeps
 * "system" resolvable even while a manual theme is applied.
 */
export function getSystemTheme(): ResolvedThemeMode {
  if (process.platform === "darwin") {
    // Unlike nativeTheme, this user default is unaffected by themeSource.
    return systemPreferences.getUserDefault("AppleInterfaceStyle", "string") ===
      "Dark"
      ? "dark"
      : "light";
  }
  return nativeTheme.themeSource === "system"
    ? nativeTheme.shouldUseDarkColors
      ? "dark"
      : "light"
    : osThemeAtStartup;
}
