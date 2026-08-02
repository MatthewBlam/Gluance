import { nativeTheme } from "electron";
import type { ThemeMode } from "../shared/types";

export function applyNativeTheme(theme: ThemeMode): void {
  nativeTheme.themeSource = theme;
}
