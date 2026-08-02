import { ComponentProps, forwardRef, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { HTMLMotionProps, motion } from "motion/react";
import { Button } from "./Button";
import { Slider } from "./Slider";
import { Toggle } from "./Toggle";
import { RotateCcw, ChevronLeft, ChevronRight, Info } from "lucide-react";
import {
  Settings as SettingsType,
  type ResolvedThemeMode,
} from "../shared/types";

export interface SettingsProps extends HTMLMotionProps<"div"> {
  active: boolean;
  settingsTabbable: boolean;
  draft: SettingsType;
  updateDraft: (partial: Partial<SettingsType>) => void;
  onSave: () => void;
  onClose: () => void;
  onReset: () => void;
  confirmActive: boolean;
  confirmTabbable: boolean;
  onOpenConfirm: () => void;
  onCloseConfirm: (logout?: boolean) => void;
  onLogout: () => void;
  resolvedTheme: ResolvedThemeMode;
}

const variants = {
  hidden: { opacity: 0, x: "-50%", y: "-50%" },
  visible: { opacity: 1, x: "-50%", y: "-50%" },
};

export const Settings = forwardRef<HTMLDivElement, SettingsProps>(
  (
    {
      children,
      className,
      active,
      settingsTabbable,
      draft,
      updateDraft,
      onSave,
      onClose,
      onReset,
      confirmActive,
      confirmTabbable,
      onOpenConfirm,
      onCloseConfirm,
      onLogout,
      resolvedTheme,
      ...props
    },
    ref,
  ) => {
    const themeElement = useRef(null);
    const unitElement = useRef(null);
    const highElement = useRef(null);
    const lowElement = useRef(null);
    const highElementMMOLL = useRef(null);
    const lowElementMMOLL = useRef(null);

    return (
      <>
        <motion.div
          variants={variants}
          initial="hidden"
          animate={active ? "visible" : "hidden"}
          transition={{ duration: 0.2 }}
          ref={ref}
          className={twMerge(
            "bg-app-surface z-20 drop-shadow-2xl rounded-xl size-fit min-w-[430px] absolute left-1/2 top-1/2 [@media(max-height:430px)]:top-[53.5%] transition-top duration-1000",
            !active && "pointer-events-none",
            className,
          )}
          {...props}>
          <div className="w-full h-full p-6">
            <div className="w-full h-full flex flex-col gap-1.5 justify-start items-center">
              <div className="w-full flex flex-row content-start">
                <span className="text-app-text text-xl select-none font-semibold ml-0.5">Settings</span>
                <button
                  tabIndex={settingsTabbable ? 12 : -1}
                  onClick={onReset}
                  className="group relative cursor-pointer appearance-none focus-visible:outline-brand ml-auto text-app-text-muted hover:text-app-text transition-all duration-[0.03s]">
                  <RotateCcw className="size-4" strokeWidth={2.35} />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2 py-1 text-[10px] font-medium text-app-surface bg-app-text rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                    reset to default settings
                  </div>
                </button>
              </div>

              <div className="w-full h-full pb-4 pt-2.5 px-0.5 flex flex-row gap-8 mb-6">
                <div className="w-full flex flex-col content-start gap-8">
                  <div className="low">
                    <div className="text-app-text text-sm select-none font-medium mb-1.5 ml-0.5">Low</div>
                    {draft.unit === "mg/dl" ? (
                      <ValueBox valueBoxHandler={(v) => updateDraft({ low: v })} upperBound={draft.high} tabbable={settingsTabbable} index={[1, 2]} ref={lowElement} value={draft.low} min={60} max={150}></ValueBox>
                    ) : (
                      <ValueBoxMMOLL
                        valueBoxHandler={(v) => updateDraft({ lowMMOLL: v })}
                        upperBound={draft.highMMOLL}
                        tabbable={settingsTabbable}
                        index={[1, 2]}
                        ref={lowElementMMOLL}
                        value={draft.lowMMOLL}
                        min={3.5}
                        max={8.5}></ValueBoxMMOLL>
                    )}
                  </div>
                  <div className="version">
                    <div className="text-app-text text-sm select-none font-medium mb-1.5 ml-0.5">Theme</div>
                    <SegmentedButton
                      changeHandler={(btn: number) => {
                        updateDraft({ theme: btn === 1 ? "light" : "dark" });
                      }}
                      tabbable={settingsTabbable}
                      index={[5, 6]}
                      ref={themeElement}
                      buttonOne="Light"
                      buttonTwo="Dark"
                      activeButton={(draft.theme === "system" ? resolvedTheme : draft.theme) === "light" ? 1 : 2}></SegmentedButton>
                  </div>
                  <div className="widget-indicator">
                    <div className="text-app-text text-sm select-none font-medium mb-1.5 ml-0.5">Widget Indicator</div>
                    <Toggle checked={draft.widgetShowIndicator} onChange={(v) => updateDraft({ widgetShowIndicator: v })} tabIndex={settingsTabbable ? 21 : -1} />
                  </div>
                  <div className="widget-opacity">
                    <div className="text-app-text text-sm select-none font-medium mb-1.5 ml-0.5">Widget Opacity</div>
                    <Slider
                      min={0.3}
                      max={1.0}
                      step={0.05}
                      value={draft.widgetOpacity}
                      onChange={(v) => updateDraft({ widgetOpacity: v })}
                      formatLabel={(v) => `${Math.round(v * 100)}%`}
                      tabIndex={settingsTabbable ? 20 : -1}
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col content-start gap-8">
                  <div className="high">
                    <div className="text-app-text text-sm select-none font-medium mb-1.5 ml-0.5">High</div>
                    {draft.unit === "mg/dl" ? (
                      <ValueBox valueBoxHandler={(v) => updateDraft({ high: v })} lowerBound={draft.low} tabbable={settingsTabbable} index={[3, 4]} ref={highElement} value={draft.high} min={150} max={400}></ValueBox>
                    ) : (
                      <ValueBoxMMOLL
                        valueBoxHandler={(v) => updateDraft({ highMMOLL: v })}
                        lowerBound={draft.lowMMOLL}
                        tabbable={settingsTabbable}
                        index={[3, 4]}
                        ref={highElementMMOLL}
                        value={draft.highMMOLL}
                        min={8.5}
                        max={22.0}></ValueBoxMMOLL>
                    )}
                  </div>
                  <div className="unit">
                    <div className="text-app-text text-sm select-none font-medium mb-1.5 ml-0.5">Unit</div>
                    <SegmentedButton
                      changeHandler={(btn: number) => {
                        updateDraft({ unit: btn === 1 ? "mg/dl" : "mmol/l" });
                      }}
                      tabbable={settingsTabbable}
                      index={[7, 8]}
                      ref={unitElement}
                      buttonOne="mg/dl"
                      buttonTwo="mmol/l"
                      activeButton={draft.unit === "mg/dl" ? 1 : 2}></SegmentedButton>
                  </div>
                  <div className="widget-sparkline">
                    <div className="text-app-text text-sm select-none font-medium mb-1.5 ml-0.5">Widget Sparkline</div>
                    <Toggle checked={draft.widgetShowSparkline} onChange={(v) => updateDraft({ widgetShowSparkline: v })} tabIndex={settingsTabbable ? 22 : -1} />
                  </div>
                  <div className="launch-at-login">
                    <div className="flex items-center gap-1.5 mb-1.5 ml-0.5">
                      <div className="text-app-text text-sm select-none font-medium">Launch at Login</div>
                      <div className="group relative flex items-center">
                        <Info className="size-3 text-app-text-subtle" strokeWidth={2.5} />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2 py-1 text-[10px] font-medium text-app-surface bg-app-text rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                          automatically open the app when you log in to your computer
                        </div>
                      </div>
                    </div>
                    <Toggle checked={draft.launchAtLogin} onChange={(v) => updateDraft({ launchAtLogin: v })} tabIndex={settingsTabbable ? 16 : -1} />
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-row mt-auto justify-end gap-1">
                <Button
                  className="mr-auto focus-visible:outline-brand outline-transparent text-sm pl-[14.15px] pr-[14.25px]"
                  text="Log Out"
                  tabbable={settingsTabbable}
                  tabIndex={settingsTabbable ? 11 : -1}
                  click={() => {
                    onClose();
                    onOpenConfirm();
                  }}></Button>
                <Button
                  className="text-sm py-2 pl-3.5 pr-[14.25px] bg-app-surface hover:bg-app-surface text-app-text-muted hover:text-app-text "
                  text="Cancel"
                  tabbable={settingsTabbable}
                  tabIndex={settingsTabbable ? 10 : -1}
                  click={onClose}></Button>
                <Button
                  className="focus-visible:outline-brand outline-transparent text-sm py-2 pl-3.5 pr-[14.25px]"
                  text="Save"
                  tabbable={settingsTabbable}
                  tabIndex={settingsTabbable ? 9 : -1}
                  click={onSave}></Button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          id="confirmation"
          variants={variants}
          initial="hidden"
          animate={confirmActive ? "visible" : "hidden"}
          transition={{ duration: 0.2 }}
          className={`w-max absolute rounded-lg bg-app-surface drop-shadow-2xl left-1/2 top-1/2 p-6 z-30 ${confirmActive ? "" : "pointer-events-none"}`}>
          <div className="text-nowrap mb-1 text-lg font-semibold text-app-text">Confirm</div>
          <div className="mb-6 text-sm font-normal text-app-text-muted">Are you sure you want to log out?</div>
          <div className="flex justify-end gap-2">
            <Button
              className="text-sm py-2 pl-3.5 pr-[14.25px] bg-app-surface hover:bg-app-surface text-app-text-muted hover:text-app-text "
              text="No"
              tabbable={confirmTabbable}
              click={() => {
                onCloseConfirm();
              }}></Button>
            <Button
              className="focus-visible:outline-brand outline-transparent text-sm py-2 pl-3.5 pr-[14.25px]"
              text="Yes"
              tabbable={confirmTabbable}
              click={() => {
                onLogout();
                onCloseConfirm(true);
              }}></Button>
          </div>
        </motion.div>
      </>
    );
  },
);

interface SegmentedButtonProps extends ComponentProps<"div"> {
  buttonOne: string;
  buttonTwo: string;
  activeButton: 1 | 2;
  tabbable: boolean;
  index: number[];
  changeHandler: (btn: number) => void;
}

const SegmentedButton = forwardRef<HTMLDivElement, SegmentedButtonProps>(({ children, className, buttonOne, buttonTwo, activeButton, tabbable, index, changeHandler, ...props }, ref) => {
  return (
    <div ref={ref} className={twMerge("w-[200px] flex items-center justify-center p-1 gap-1 rounded-lg bg-app-background-light text-app-text-subtle", className)} {...props}>
      <button
        tabIndex={tabbable ? index[0] : -1}
        onClick={() => {
          changeHandler(1);
        }}
        data-state={activeButton === 1 ? "active" : ""}
        className="cursor-pointer focus-visible:outline-brand select-none outline-transparent outline outline-2 flex flex-1 min-w-0 items-center justify-center whitespace-nowrap rounded-md px-4 py-1 text-sm font-normal hover:bg-app-background data-[state=active]:bg-app-surface data-[state=active]:text-app-text data-[state=active]:font-medium">
        {buttonOne}
      </button>
      <button
        tabIndex={tabbable ? index[1] : -1}
        onClick={() => {
          changeHandler(2);
        }}
        data-state={activeButton === 2 ? "active" : ""}
        className="cursor-pointer focus-visible:outline-brand select-none outline-transparent outline outline-2 flex flex-1 min-w-0 items-center justify-center whitespace-nowrap rounded-md px-4 py-1 text-sm font-normal hover:bg-app-background data-[state=active]:bg-app-surface data-[state=active]:text-app-text data-[state=active]:font-medium">
        {buttonTwo}
      </button>
    </div>
  );
});

interface ValueBoxProps extends ComponentProps<"div"> {
  value: number | null;
  upperBound?: number | null;
  lowerBound?: number | null;
  min: number;
  max: number;
  tabbable: boolean;
  index: number[];
  valueBoxHandler: (value: number) => void;
}

const ValueBox = forwardRef<HTMLDivElement, ValueBoxProps>(({ children, className, value: valueProp, upperBound, lowerBound, min, max, tabbable, index, valueBoxHandler, ...props }, ref) => {
  const value = valueProp ?? 0;
  const valueRef = useRef(value);
  valueRef.current = value;
  const timerRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  function step(delta: number) {
    const newValue = valueRef.current + delta;
    if (delta < 0) {
      if (lowerBound != null && newValue <= lowerBound) return;
      if (newValue < min) return;
    } else {
      if (upperBound != null && newValue >= upperBound) return;
      if (newValue > max) return;
    }
    valueRef.current = newValue;
    valueBoxHandler(newValue);
  }

  function startHold(delta: number) {
    step(delta);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = window.setInterval(() => step(delta), 100);
    }, 400);
  }

  function stopHold() {
    clearTimeout(timerRef.current);
    clearInterval(timerRef.current);
  }

  return (
    <div ref={ref} className={twMerge("w-[145.6px] flex relative gap-1.5 bg-app-background-light py-1.5 px-1.5 items-center justify-center rounded-lg ", className)} {...props}>
      <button
        tabIndex={tabbable ? index[0] : -1}
        onPointerDown={() => startHold(-5)}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        className="cursor-pointer focus-visible:outline-brand outline-transparent outline outline-2 mr-auto p-1 rounded text-app-text-muted hover:text-app-text-muted bg-app-background-light hover:bg-app-background">
        <ChevronLeft className="size-4 p-0.5" strokeWidth={3.5} />
      </button>
      <div className="w-[72px] h-7 px-6 select-none rounded-md absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] bg-app-surface p-2 text-app-text text-sm font-medium text-center flex items-center justify-center">
        {value}
      </div>
      <button
        tabIndex={tabbable ? index[1] : -1}
        onPointerDown={() => startHold(5)}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        className="cursor-pointer focus-visible:outline-brand outline-transparent outline outline-2 ml-auto p-1 rounded text-app-text-muted hover:text-app-text-muted bg-app-background-light hover:bg-app-background">
        <ChevronRight className="size-4 p-0.5" strokeWidth={3.5} />
      </button>
    </div>
  );
});

const ValueBoxMMOLL = forwardRef<HTMLDivElement, ValueBoxProps>(({ children, className, value: valueProp, upperBound, lowerBound, min, max, tabbable, index, valueBoxHandler, ...props }, ref) => {
  const value = valueProp ?? 0;
  const valueRef = useRef(value);
  valueRef.current = value;
  const timerRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  function step(delta: number) {
    const newValue = Math.round((valueRef.current + delta) * 10) / 10;
    if (delta < 0) {
      if (lowerBound != null && newValue <= lowerBound) return;
      if (newValue < min) return;
    } else {
      if (upperBound != null && newValue >= upperBound) return;
      if (newValue > max) return;
    }
    valueRef.current = newValue;
    valueBoxHandler(newValue);
  }

  function startHold(delta: number) {
    step(delta);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = window.setInterval(() => step(delta), 100);
    }, 400);
  }

  function stopHold() {
    clearTimeout(timerRef.current);
    clearInterval(timerRef.current);
  }

  return (
    <div ref={ref} className={twMerge("w-[145.6px] flex relative gap-1.5 bg-app-background-light py-1.5 px-1.5 items-center justify-center rounded-lg ", className)} {...props}>
      <button
        tabIndex={tabbable ? index[0] : -1}
        onPointerDown={() => startHold(-0.5)}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        className="cursor-pointer focus-visible:outline-brand outline-transparent outline outline-2 mr-auto p-1 rounded text-app-text-muted hover:text-app-text-muted bg-app-background-light hover:bg-app-background">
        <ChevronLeft className="size-4 p-0.5" strokeWidth={3.5} />
      </button>
      <div className="w-[72px] h-7 px-6 select-none rounded-md absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] bg-app-surface p-2 text-app-text text-sm font-medium text-center flex items-center justify-center">
        {value.toFixed(1)}
      </div>
      <button
        tabIndex={tabbable ? index[1] : -1}
        onPointerDown={() => startHold(0.5)}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        className="cursor-pointer focus-visible:outline-brand outline-transparent outline outline-2 ml-auto p-1 rounded text-app-text-muted hover:text-app-text-muted bg-app-background-light hover:bg-app-background">
        <ChevronRight className="size-4 p-0.5" strokeWidth={3.5} />
      </button>
    </div>
  );
});
