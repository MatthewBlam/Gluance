import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Login } from "../renderer/Login";
import { Settings } from "../components/Settings";
import { GlucoseIndicator } from "../components/GlucoseIndicator";
import { Slider } from "../components/Slider";
import { Toggle } from "../components/Toggle";
import { ErrorToast } from "../components/ErrorToast";
import { SettingsContext } from "../contexts/SettingsContext";
import { DEFAULT_SETTINGS, type Trend } from "../shared/types";
import { DISCLAIMER } from "../shared/branding";
import { getSparklineMarginClass } from "../widget/Widget";

vi.mock("motion/react", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop) => {
        return ({ children, ...props }: any) => {
          const Tag = String(prop);
          return <div data-motion-tag={Tag} {...props}>{children}</div>;
        };
      },
    }
  ),
  HTMLMotionProps: {},
  useAnimate: () => [vi.fn(), vi.fn()],
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock("lucide-react", () => ({
  Settings: () => <span>SettingsIcon</span>,
  Expand: () => <span>ExpandIcon</span>,
  Shrink: () => <span>ShrinkIcon</span>,
  RotateCcw: () => <span>RotateCcwIcon</span>,
  ChevronLeft: () => <span>ChevronLeftIcon</span>,
  ChevronRight: () => <span>ChevronRightIcon</span>,
  Info: () => <span>InfoIcon</span>,
  TriangleAlert: ({ className }: { className?: string }) => (
    <span data-testid="error-alert-icon" className={className} />
  ),
  X: ({ className }: { className?: string }) => (
    <span data-testid="error-close-icon" className={className} />
  ),
}));

describe("Login", () => {
  it("renders username and password inputs", () => {
    render(
      <Login
        userVal=""
        passwordVal=""
        regionVal="us"
        userChange={vi.fn()}
        passwordChange={vi.fn()}
        regionChange={vi.fn()}
        loginClick={vi.fn()}
        disabled={false}
        tabbable={true}
      />
    );
    expect(screen.getByPlaceholderText("User ID")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("renders the region checkboxes", () => {
    render(
      <Login
        userVal=""
        passwordVal=""
        regionVal="us"
        userChange={vi.fn()}
        passwordChange={vi.fn()}
        regionChange={vi.fn()}
        loginClick={vi.fn()}
        disabled={false}
        tabbable={true}
      />
    );
    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText("Japan")).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
  });

  it("renders the login button", () => {
    render(
      <Login
        userVal=""
        passwordVal=""
        regionVal="us"
        userChange={vi.fn()}
        passwordChange={vi.fn()}
        regionChange={vi.fn()}
        loginClick={vi.fn()}
        disabled={false}
        tabbable={true}
      />
    );
    expect(screen.getByRole("button", { name: "Log In" })).toHaveClass(
      "text-on-brand",
    );
  });

  it("uses the on-brand color for checkbox checkmarks", () => {
    render(
      <Login
        userVal=""
        passwordVal=""
        regionVal="us"
        userChange={vi.fn()}
        passwordChange={vi.fn()}
        regionChange={vi.fn()}
        loginClick={vi.fn()}
        disabled={false}
        tabbable={true}
      />,
    );

    expect(screen.getAllByTestId("checkbox-checkmark")).toHaveLength(3);
    screen.getAllByTestId("checkbox-checkmark").forEach((checkmark) => {
      expect(checkmark).toHaveClass("text-on-brand");
    });
  });

  it("displays the non-affiliation disclaimer", () => {
    render(
      <Login
        userVal=""
        passwordVal=""
        regionVal="us"
        userChange={vi.fn()}
        passwordChange={vi.fn()}
        regionChange={vi.fn()}
        loginClick={vi.fn()}
        disabled={false}
        tabbable={true}
      />
    );
    expect(screen.getByText(DISCLAIMER)).toBeInTheDocument();
  });

  it("displays user-provided values", () => {
    render(
      <Login
        userVal="testuser"
        passwordVal="secret"
        regionVal="ous"
        userChange={vi.fn()}
        passwordChange={vi.fn()}
        regionChange={vi.fn()}
        loginClick={vi.fn()}
        disabled={false}
        tabbable={true}
      />
    );
    expect(screen.getByDisplayValue("testuser")).toBeInTheDocument();
  });
});

describe("Settings", () => {
  const defaultProps = {
    active: true,
    settingsTabbable: true,
    draft: DEFAULT_SETTINGS,
    updateDraft: vi.fn(),
    onSave: vi.fn(),
    onClose: vi.fn(),
    onReset: vi.fn(),
    confirmActive: false,
    confirmTabbable: false,
    onOpenConfirm: vi.fn(),
    onCloseConfirm: vi.fn(),
    onLogout: vi.fn(),
    resolvedTheme: "light" as const,
  };

  it("renders the settings panel", () => {
    render(<Settings {...defaultProps} />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders threshold labels", () => {
    render(<Settings {...defaultProps} />);
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Low")).toBeInTheDocument();
  });

  it("updates the draft theme from the Light and Dark control", () => {
    const updateDraft = vi.fn();
    render(<Settings {...defaultProps} updateDraft={updateDraft} />);

    fireEvent.click(screen.getByRole("button", { name: "Dark" }));
    fireEvent.click(screen.getByRole("button", { name: "Light" }));

    expect(updateDraft).toHaveBeenNthCalledWith(1, { theme: "dark" });
    expect(updateDraft).toHaveBeenNthCalledWith(2, { theme: "light" });
  });

  it("shows the resolved system theme until a manual theme is selected", () => {
    const { rerender } = render(<Settings {...defaultProps} />);

    expect(screen.getByRole("button", { name: "Light" })).toHaveAttribute(
      "data-state",
      "active",
    );

    rerender(<Settings {...defaultProps} resolvedTheme="dark" />);
    expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute(
      "data-state",
      "active",
    );

    rerender(
      <Settings
        {...defaultProps}
        resolvedTheme="dark"
        draft={{ ...DEFAULT_SETTINGS, theme: "light" }}
      />,
    );
    expect(screen.getByRole("button", { name: "Light" })).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("keeps segmented controls at a fixed width", () => {
    render(<Settings {...defaultProps} />);

    const millimolesButton = screen.getByRole("button", { name: "mmol/l" });
    expect(millimolesButton.parentElement).toHaveClass("w-[200px]");
    expect(millimolesButton).toHaveClass("flex-1", "min-w-0");
    expect(millimolesButton.className).not.toContain("drop-shadow");
  });

  it("renders threshold value boxes without shadows", () => {
    const { rerender } = render(<Settings {...defaultProps} />);

    ["70", "200"].forEach((value) => {
      expect(screen.getByText(value).className).not.toContain("drop-shadow");
    });

    rerender(
      <Settings
        {...defaultProps}
        draft={{ ...DEFAULT_SETTINGS, unit: "mmol/l" }}
      />,
    );

    ["4.0", "11.0"].forEach((value) => {
      expect(screen.getByText(value).className).not.toContain("drop-shadow");
    });
  });

  it("renders log out button", () => {
    render(<Settings {...defaultProps} />);
    expect(screen.getByText("Log Out")).toBeInTheDocument();
  });
});

describe("GlucoseIndicator", () => {
  function renderIndicator(trend: Trend, mg_dl = "120") {
    return render(
      <SettingsContext.Provider
        value={{ settings: DEFAULT_SETTINGS, setSettings: vi.fn() }}>
        <GlucoseIndicator
          trend={trend}
          mg_dl={mg_dl}
          mmol_l="6.7"
        />
      </SettingsContext.Provider>,
    );
  }

  it.each(["DoubleUp", "DoubleDown"] as const)(
    "shows the second arrow for %s",
    (trend) => {
      renderIndicator(trend);

      expect(screen.getByTestId("main-arrow")).toHaveStyle({
        fill: "var(--color-indicator-text)",
        opacity: "1",
      });
      expect(screen.getByTestId("second-arrow")).toHaveStyle({
        fill: "var(--color-indicator-text)",
        opacity: "1",
      });
    },
  );

  it.each([
    "Unavailable",
    "SingleUp",
    "FortyFiveUp",
    "Flat",
    "FortyFiveDown",
    "SingleDown",
  ] as const)("hides the second arrow for %s", (trend) => {
    renderIndicator(trend);

    expect(screen.getByTestId("second-arrow")).toHaveStyle({
      opacity: "0",
    });
  });

  it("uses the revised stroked-circle SVG geometry", () => {
    renderIndicator("Flat");

    const circle = screen.getByTestId("indicator-circle");
    expect(circle.closest("svg")?.querySelectorAll("circle")).toHaveLength(1);
    expect(circle).toHaveAttribute("cx", "125");
    expect(circle).toHaveAttribute("cy", "125");
    expect(circle).toHaveAttribute("r", "109.5");
    expect(circle).toHaveAttribute("stroke-width", "10");
    expect(screen.getByTestId("main-arrow")).toHaveAttribute(
      "d",
      expect.stringContaining("M233.4,52.3"),
    );
    expect(screen.getByTestId("second-arrow")).toHaveAttribute(
      "d",
      expect.stringContaining("M247.1,26.5"),
    );
  });

  it("uses the default theme foreground for a normal reading", () => {
    renderIndicator("Flat", "120");

    expect(screen.getByTestId("indicator-circle")).toHaveStyle({
      fill: "var(--color-indicator-normal)",
      stroke: "var(--color-indicator-normal-shell)",
    });
    expect(screen.getByTestId("indicator-text")).toHaveStyle({
      color: "var(--color-indicator-text)",
    });
    expect(screen.getByTestId("indicator-unit")).toHaveStyle({
      color: "var(--color-app-text-muted)",
    });
    expect(screen.getByTestId("main-arrow")).toHaveStyle({
      fill: "var(--color-indicator-text)",
    });
  });

  it("uses a light foreground for a low red reading", () => {
    renderIndicator("DoubleDown", "55");

    expect(screen.getByTestId("indicator-circle")).toHaveStyle({
      fill: "var(--color-reading-low)",
      stroke: "var(--color-indicator-low-shell)",
    });
    expect(screen.getByTestId("indicator-text")).toHaveStyle({
      color: "var(--color-on-error)",
    });
    expect(screen.getByTestId("indicator-unit")).toHaveStyle({
      color: "var(--color-indicator-unit-on-low)",
    });
    expect(screen.getByTestId("main-arrow")).toHaveStyle({
      fill: "var(--color-on-error)",
    });
    expect(screen.getByTestId("second-arrow")).toHaveStyle({
      fill: "var(--color-on-error)",
    });
  });

  it("uses a dark text foreground and a separate arrow color for a high yellow reading", () => {
    renderIndicator("DoubleUp", "250");

    expect(screen.getByTestId("indicator-circle")).toHaveStyle({
      fill: "var(--color-reading-high)",
      stroke: "var(--color-indicator-high-shell)",
    });
    expect(screen.getByTestId("indicator-text")).toHaveStyle({
      color: "var(--color-indicator-text-on-high)",
    });
    expect(screen.getByTestId("indicator-unit")).toHaveStyle({
      color: "var(--color-indicator-unit-on-high)",
    });
    expect(screen.getByTestId("main-arrow")).toHaveStyle({
      fill: "var(--color-indicator-arrow-on-high)",
    });
    expect(screen.getByTestId("second-arrow")).toHaveStyle({
      fill: "var(--color-indicator-arrow-on-high)",
    });
  });
});

describe("Widget sparkline spacing", () => {
  it("adds more spacing for downward trends", () => {
    expect(getSparklineMarginClass("SingleDown")).toBe("mt-6");
    expect(getSparklineMarginClass("DoubleDown")).toBe("mt-8");
  });

  it.each([
    "Unavailable",
    "DoubleUp",
    "SingleUp",
    "FortyFiveUp",
    "Flat",
    "FortyFiveDown",
  ] as const)("uses the default spacing for %s", (trend) => {
    expect(getSparklineMarginClass(trend)).toBe("mt-2");
  });
});

describe("Slider", () => {
  it("uses the light control token for the thumb fill", () => {
    render(
      <Slider
        min={0}
        max={1}
        step={0.05}
        value={0.5}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("slider").className).toContain(
      "[&::-webkit-slider-thumb]:bg-control-thumb",
    );
    expect(screen.getByRole("slider").className).not.toContain("drop-shadow");
  });
});

describe("Toggle", () => {
  it("renders the thumb without a shadow", () => {
    render(<Toggle checked={true} onChange={vi.fn()} />);

    const thumb = screen.getByRole("switch").querySelector("span");
    expect(thumb?.className).not.toContain("drop-shadow");
  });
});

describe("ErrorToast", () => {
  it("uses light-on-error colors for its text and icons", () => {
    render(
      <ErrorToast
        active={true}
        text="Connection failed"
        close={vi.fn()}
      />,
    );

    expect(screen.getByText("Connection failed")).toHaveClass("text-on-error");
    expect(screen.getByTestId("error-alert-icon")).toHaveClass("text-on-error");
    expect(screen.getByTestId("error-close-icon")).toHaveClass(
      "text-on-error/70",
      "hover:text-on-error",
    );
  });
});
