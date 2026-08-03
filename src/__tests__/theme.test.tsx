import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useApplyTheme } from "../hooks/useApplyTheme";
import {
  DEFAULT_SETTINGS,
  type ResolvedThemeMode,
  type ThemeMode,
} from "../shared/types";
import { isValidSettings } from "../main/ipc-handlers";
import { applyNativeTheme, getSystemTheme } from "../main/theme";
import { nativeTheme } from "electron";
import { _mockState } from "./mocks/electron";

/**
 * Stub the preload bridge. `osTheme` is what the main process reports as the
 * real OS appearance; returns a trigger for the system-theme push channel.
 */
function stubApi(osTheme: ResolvedThemeMode) {
  let pushListener: ((theme: ResolvedThemeMode) => void) | undefined;
  vi.stubGlobal("api", {
    getSystemTheme: vi.fn().mockResolvedValue(osTheme),
    onSystemThemeChanged: vi.fn((cb: (theme: ResolvedThemeMode) => void) => {
      pushListener = cb;
      return () => {
        pushListener = undefined;
      };
    }),
  });
  return (theme: ResolvedThemeMode) => pushListener?.(theme);
}

describe("useApplyTheme", () => {
  afterEach(() => {
    document.documentElement.dataset.theme = "light";
    vi.unstubAllGlobals();
  });

  it("applies manual theme changes to the document root", () => {
    const { rerender } = renderHook(
      ({ theme }: { theme: ThemeMode }) => useApplyTheme(theme),
      { initialProps: { theme: "light" } as { theme: ThemeMode } },
    );

    expect(document.documentElement.dataset.theme).toBe("light");

    rerender({ theme: "dark" });
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("follows system theme changes while the preference is system", async () => {
    const pushSystemTheme = stubApi("dark");

    const { result } = renderHook(() => useApplyTheme("system"));

    await waitFor(() => expect(result.current).toBe("dark"));
    expect(document.documentElement.dataset.theme).toBe("dark");

    act(() => {
      pushSystemTheme("light");
    });

    expect(result.current).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("keeps a manual preference when the system theme changes", async () => {
    const pushSystemTheme = stubApi("light");

    renderHook(() => useApplyTheme("dark"));
    act(() => {
      pushSystemTheme("light");
    });

    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  // Regression: nativeTheme.themeSource overrides prefers-color-scheme in the
  // renderer, so while a manual theme is forced matchMedia reports that forced
  // theme instead of the OS appearance. Resetting settings to the "system"
  // default must resolve against the real OS appearance from the main process.
  it("resolves system against the OS appearance, not the forced theme", async () => {
    // Forced light: the media query lies and says the system is light.
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
    // Main knows the OS is actually dark.
    stubApi("dark");

    const { result, rerender } = renderHook(
      ({ theme }: { theme: ThemeMode }) => useApplyTheme(theme),
      { initialProps: { theme: "light" } as { theme: ThemeMode } },
    );

    expect(result.current).toBe("light");

    // Reset to defaults puts the draft back to "system".
    rerender({ theme: "system" });

    await waitFor(() => expect(result.current).toBe("dark"));
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});

describe("theme settings validation", () => {
  it("accepts system, light, and dark settings", () => {
    expect(isValidSettings(DEFAULT_SETTINGS)).toBe(true);
    expect(
      isValidSettings({ ...DEFAULT_SETTINGS, theme: "light" }),
    ).toBe(true);
    expect(
      isValidSettings({ ...DEFAULT_SETTINGS, theme: "dark" }),
    ).toBe(true);
  });

  it("rejects missing and unsupported themes", () => {
    const { theme: _theme, ...withoutTheme } = DEFAULT_SETTINGS;

    expect(isValidSettings(withoutTheme)).toBe(false);
    expect(
      isValidSettings({ ...DEFAULT_SETTINGS, theme: "contrast" }),
    ).toBe(false);
  });
});

describe("getSystemTheme", () => {
  afterEach(() => {
    _mockState.appleInterfaceStyle = undefined;
  });

  it("reports the OS appearance even while a theme is forced", () => {
    _mockState.appleInterfaceStyle = "Dark";

    for (const forced of ["system", "light", "dark"] as const) {
      applyNativeTheme(forced);
      expect(getSystemTheme()).toBe("dark");
    }
  });

  it("reports light when the OS has no dark appearance set", () => {
    _mockState.appleInterfaceStyle = undefined;
    applyNativeTheme("dark");

    expect(getSystemTheme()).toBe("light");
  });
});

describe("applyNativeTheme", () => {
  it.each(["system", "light", "dark"] as const)(
    "applies the %s source to Electron",
    (theme) => {
      applyNativeTheme(theme);
      expect(nativeTheme.themeSource).toBe(theme);
    },
  );
});
