import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { useSettingsContext } from "../contexts/SettingsContext";
import { useAnimatedValue } from "../hooks/useAnimatedValue";
import { Trend } from "../shared/types";
import { getReadingRange, type ReadingRange } from "../shared/reading-utils";

export interface GlucoseIndicatorProps extends ComponentProps<"div"> {
  trend: Trend;
  mg_dl: string;
  mmol_l: string;
}

const trendVariants = (variant: Trend) => {
  const variants = {
    Unavailable: {
      rotate: "rotate-[0deg]",
      hidden: true,
      showSecondArrow: false,
    },
    DoubleUp: {
      rotate: "rotate-[-45deg]",
      hidden: false,
      showSecondArrow: true,
    },
    SingleUp: {
      rotate: "rotate-[-45deg]",
      hidden: false,
      showSecondArrow: false,
    },
    FortyFiveUp: {
      rotate: "rotate-[0deg]",
      hidden: false,
      showSecondArrow: false,
    },
    Flat: {
      rotate: "rotate-[45deg]",
      hidden: false,
      showSecondArrow: false,
    },
    FortyFiveDown: {
      rotate: "rotate-[90deg]",
      hidden: false,
      showSecondArrow: false,
    },
    SingleDown: {
      rotate: "rotate-[135deg]",
      hidden: false,
      showSecondArrow: false,
    },
    DoubleDown: {
      rotate: "rotate-[135deg]",
      hidden: false,
      showSecondArrow: true,
    },
  };
  return variants[variant];
};

const rangeColors: Record<ReadingRange, { circle: string; shell: string; foreground: string; mutedForeground: string; arrow: string }> = {
  normal: {
    circle: "var(--color-indicator-normal)",
    shell: "var(--color-indicator-normal-shell)",
    foreground: "var(--color-indicator-text)",
    mutedForeground: "var(--color-app-text-muted)",
    arrow: "var(--color-indicator-text)",
  },
  low: {
    circle: "var(--color-reading-low)",
    shell: "var(--color-indicator-low-shell)",
    foreground: "var(--color-on-error)",
    mutedForeground: "var(--color-indicator-unit-on-low)",
    arrow: "var(--color-on-error)",
  },
  high: {
    circle: "var(--color-reading-high)",
    shell: "var(--color-indicator-high-shell)",
    foreground: "var(--color-indicator-text-on-high)",
    mutedForeground: "var(--color-indicator-unit-on-high)",
    arrow: "var(--color-indicator-arrow-on-high)",
  },
};

export const GlucoseIndicator = forwardRef<HTMLDivElement, GlucoseIndicatorProps>(({ trend, mg_dl, mmol_l, children, className, ...props }, ref) => {
  const { settings } = useSettingsContext();

  const mgNum = mg_dl === "--" ? -1 : Number(mg_dl);
  const mmolNum = mmol_l === "--" ? -1 : Number(mmol_l);
  const animatedMg = useAnimatedValue(mgNum);
  const animatedMmol = useAnimatedValue(mmolNum);
  const displayMg = animatedMg === -1 ? "--" : String(Math.round(animatedMg));
  const displayMmol = animatedMmol === -1 ? "--" : animatedMmol.toFixed(1);

  const range = getReadingRange(mg_dl, mmol_l, settings.unit, {
    high: settings.high,
    low: settings.low,
    highMMOLL: settings.highMMOLL,
    lowMMOLL: settings.lowMMOLL,
  });
  const colors = rangeColors[range];

  const variant = trendVariants(trend);
  return (
    <div ref={ref} className={twMerge("flex w-full h-full bg-transparent", className)} {...props}>
      <div id="glucose-indicator" className="relative scale-indicator w-full h-full">
        <div id="indicator-body" className={twMerge(variant.rotate, "origin-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="250" height="250" viewBox="0 0 250 250">
            <circle
              data-testid="indicator-circle"
              cx="125"
              cy="125"
              r="109.5"
              strokeWidth="10"
              style={{
                fill: colors.circle,
                stroke: colors.shell,
              }}
            />
            <path
              data-testid="main-arrow"
              className="arrow"
              d="M233.4,52.3c0,0.6-0.8,0.8-1.2,0.3c-4.6-6.8-9.9-13.2-15.8-19.3c-6.1-6.1-12.5-11.3-19.3-15.8c-0.5-0.3-0.3-1.2,0.3-1.2H233c0.3,0,0.6,0.3,0.6,0.6v35.4H233.4z"
              style={{
                fill: colors.arrow,
                opacity: variant.hidden ? "0" : "1",
              }}
            />
            <path
              data-testid="second-arrow"
              className="arrow"
              d="M247.1,26.5c0,0.5-0.6,0.6-0.8,0.3c-3-4.6-6.5-8.7-10.5-12.6c-4-4-8.2-7.4-12.6-10.5c-0.3-0.3-0.2-0.8,0.3-0.8h23.1c0.3,0,0.5,0.2,0.5,0.5V26.5z"
              style={{
                fill: colors.arrow,
                opacity: variant.showSecondArrow ? "1" : "0",
              }}
            />
          </svg>
        </div>
        <div id="indicator-text" data-testid="indicator-text" className="text-center select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[50%]" style={{ color: colors.foreground }}>
          <div id="reading" className="text-[74px] font-medium mt-[-2px] text-nowrap">
            {settings.unit === "mg/dl" ? displayMg : displayMmol}
          </div>
          <div
            id="unit"
            data-testid="indicator-unit"
            className={twMerge("text-[26px] font-medium mt-[-20px] text-nowrap", variant.hidden ? "opacity-0" : "opacity-100")}
            style={{ color: colors.mutedForeground }}>
            {settings.unit === "mg/dl" ? "mg/dL" : "mmol/L"}
          </div>
        </div>
      </div>
    </div>
  );
});
