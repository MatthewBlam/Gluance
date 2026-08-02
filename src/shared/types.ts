export type Trend =
    | "Unavailable"
    | "DoubleUp"
    | "SingleUp"
    | "FortyFiveUp"
    | "Flat"
    | "FortyFiveDown"
    | "SingleDown"
    | "DoubleDown";

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedThemeMode = Exclude<ThemeMode, "system">;

export interface Reading {
    id: string;
    value: number;
    mmol_l: number;
    trend: number;
    trend_direction: string;
    trend_description: string;
    trend_arrow: string;
    date_time: [string, string];
    trend_reliable: boolean;
}

export interface Settings {
    theme: ThemeMode;
    unit: "mg/dl" | "mmol/l";
    high: number;
    low: number;
    highMMOLL: number;
    lowMMOLL: number;
    criticalLow: number;
    criticalLowMMOLL: number;
    launchAtLogin: boolean;
    widgetOpacity: number;
    widgetShowIndicator: boolean;
    widgetShowSparkline: boolean;
}

export type ConnectionStatus = "connected" | "reconnecting" | "disconnected" | "error";

export interface Credentials {
    user: string;
    password: string;
    region: "us" | "ous" | "jp";
}

export interface WindowBounds {
    width: number;
    height: number;
}

export const DEFAULT_READING: Reading = {
    id: "Unavailable",
    value: -1,
    mmol_l: -1,
    trend: 0,
    trend_direction: "Unavailable",
    trend_description: "Unavailable",
    trend_arrow: "Unavailable",
    date_time: ["Unavailable", "Unavailable"],
    trend_reliable: false,
};

export const DEFAULT_SETTINGS: Settings = {
    theme: "system",
    unit: "mg/dl",
    high: 200,
    low: 70,
    highMMOLL: 11.0,
    lowMMOLL: 4.0,
    criticalLow: 55,
    criticalLowMMOLL: 3.0,
    launchAtLogin: false,
    widgetOpacity: 1.0,
    widgetShowIndicator: true,
    widgetShowSparkline: true,
};
