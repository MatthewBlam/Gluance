import { useMemo } from "react";
import { useHistoryContext } from "../contexts/HistoryContext";
import { useSettingsContext } from "../contexts/SettingsContext";
import { calculateRateOfChange } from "../shared/reading-utils";

export function RateOfChange() {
    const { historyItems } = useHistoryContext();
    const { settings } = useSettingsContext();

    const roc = useMemo(
        () => calculateRateOfChange(historyItems, settings.unit),
        [historyItems, settings.unit]
    );

    if (!roc) return null;

    const colorClass =
        roc.severity === "rapid"
            ? "text-reading-low"
            : roc.severity === "moderate"
              ? "text-reading-high"
              : "text-brand";

    const unitLabel = settings.unit === "mg/dl" ? "mg/dL" : "mmol/L";

    return (
        <span className={`text-xs font-medium ${colorClass}`}>
            {roc.formatted} {unitLabel}/min
        </span>
    );
}
