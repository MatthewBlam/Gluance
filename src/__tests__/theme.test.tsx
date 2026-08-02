import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useApplyTheme } from "../hooks/useApplyTheme";
import { DEFAULT_SETTINGS, type ThemeMode } from "../shared/types";
import { isValidSettings } from "../main/ipc-handlers";
import { applyNativeTheme } from "../main/theme";
import { nativeTheme } from "electron";

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

  it("follows system theme changes while the preference is system", () => {
    let changeListener:
      | ((event: MediaQueryListEvent) => void)
      | undefined;
    const systemDarkMode = {
      matches: true,
      addEventListener: vi.fn(
        (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          changeListener = listener;
        },
      ),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList;
    vi.stubGlobal("matchMedia", vi.fn(() => systemDarkMode));

    const { result } = renderHook(() => useApplyTheme("system"));

    expect(result.current).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");

    act(() => {
      changeListener?.({ matches: false } as MediaQueryListEvent);
    });

    expect(result.current).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("keeps a manual preference when the system theme changes", () => {
    let changeListener:
      | ((event: MediaQueryListEvent) => void)
      | undefined;
    const systemDarkMode = {
      matches: false,
      addEventListener: vi.fn(
        (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          changeListener = listener;
        },
      ),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList;
    vi.stubGlobal("matchMedia", vi.fn(() => systemDarkMode));

    renderHook(() => useApplyTheme("dark"));
    act(() => {
      changeListener?.({ matches: false } as MediaQueryListEvent);
    });

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

describe("applyNativeTheme", () => {
  it.each(["system", "light", "dark"] as const)(
    "applies the %s source to Electron",
    (theme) => {
      applyNativeTheme(theme);
      expect(nativeTheme.themeSource).toBe(theme);
    },
  );
});
