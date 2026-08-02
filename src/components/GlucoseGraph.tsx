import { useMemo } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    ReferenceLine,
    ReferenceArea,
    Dot,
    Tooltip,
} from "recharts";
import { Reading, Settings } from "../shared/types";
import { parseReadingDateTime } from "../shared/reading-utils";

interface GlucoseGraphProps {
    readings: Reading[];
    settings: Settings;
    timeRange: number;
    graphHeight: number;
}

interface DataPoint {
    time: number;
    value: number;
    range: "normal" | "high" | "low";
}

function CustomDot(props: any) {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null) return null;
    const color =
        payload.range === "high"
            ? "var(--color-reading-high)"
            : payload.range === "low"
              ? "var(--color-reading-low)"
              : "var(--color-brand)";
    return <Dot cx={cx} cy={cy} r={2.5} fill={color} stroke="none" />;
}

export function GlucoseGraph({ readings, settings, timeRange, graphHeight }: GlucoseGraphProps) {
    const { data, maxValue, now, cutoff } = useMemo(() => {
        const now = Date.now();
        const cutoff = now - timeRange * 60 * 1000;
        const isMgDl = settings.unit === "mg/dl";
        const high = isMgDl ? settings.high : settings.highMMOLL;
        const low = isMgDl ? settings.low : settings.lowMMOLL;
        const valueFloor = isMgDl ? 40 : 2.0;
        const valueCap = isMgDl ? 400 : Math.round((400 / 18.018) * 10) / 10;

        const data = readings
            .filter((r) => r.value !== -1)
            .map((r) => {
                const date = parseReadingDateTime(r.date_time);
                if (!date) return null;
                const time = date.getTime();
                if (time < cutoff) return null;
                const rawValue = isMgDl ? r.value : r.mmol_l;
                const value = Math.max(Math.min(rawValue, valueCap), valueFloor);
                const range = value >= high ? "high" : value <= low ? "low" : "normal";
                return { time, value, range } as DataPoint;
            })
            .filter(Boolean)
            .sort((a, b) => a!.time - b!.time) as DataPoint[];

        const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.value)) : 0;

        return { data, maxValue, now, cutoff };
    }, [readings, settings, timeRange]);

    const isMgDl = settings.unit === "mg/dl";
    const high = isMgDl ? settings.high : settings.highMMOLL;
    const low = isMgDl ? settings.low : settings.lowMMOLL;
    const criticalLow = isMgDl ? settings.criticalLow : settings.criticalLowMMOLL;

    const yMin = isMgDl ? 40 : 2.0;
    const yMaxSetting = isMgDl ? graphHeight : Math.round((graphHeight / 18.018) * 10) / 10;
    const yMax = Math.max(yMaxSetting, maxValue);
    const unitLabel = isMgDl ? "mg/dL" : "mmol/L";

    function CustomTooltip({ active, payload }: any) {
        if (!active || !payload?.length) return null;
        const point = payload[0].payload as DataPoint;
        const color =
            point.range === "high"
                ? "var(--color-reading-high)"
                : point.range === "low"
                  ? "var(--color-reading-low)"
                  : "var(--color-brand)";
        const timeStr = new Date(point.time).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        });
        return (
            <div className="bg-app-text text-app-surface text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap">
                <span style={{ color }}>{point.value}</span>
                <span className="ml-0.5 text-app-border">{unitLabel}</span>
                <span className="ml-1.5 text-app-border">{timeStr}</span>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-sm text-app-text-muted select-none">
                No readings in this time range
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%" className="-ml-3">
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -12 }}>
                <XAxis
                    dataKey="time"
                    type="number"
                    domain={[cutoff, now]}
                    tickFormatter={(ts) => new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    tick={{ fontSize: 10, fill: "var(--color-app-text-muted)" }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--color-app-background)" }}
                    minTickGap={40}
                />
                <YAxis
                    domain={[yMin, yMax]}
                    ticks={[criticalLow, low, high, yMax]}
                    tick={{ fontSize: 10, fill: "var(--color-app-text-muted)" }}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    content={<CustomTooltip />}
                    cursor={false}
                    isAnimationActive={false}
                />
                <ReferenceArea y1={low} y2={high} fill="var(--color-brand)" fillOpacity={0.06} />
                <ReferenceArea y1={high} y2={yMax} fill="var(--color-reading-high)" fillOpacity={0.06} />
                <ReferenceArea y1={criticalLow} y2={low} fill="var(--color-reading-low)" fillOpacity={0.04} />
                <ReferenceArea y1={yMin} y2={criticalLow} fill="var(--color-reading-low)" fillOpacity={0.08} />
                <ReferenceLine y={high} stroke="var(--color-reading-high)" strokeDasharray="4 4" strokeWidth={1} />
                <ReferenceLine y={low} stroke="var(--color-reading-low)" strokeDasharray="4 4" strokeWidth={1} />
                <ReferenceLine y={criticalLow} stroke="var(--color-reading-low)" strokeWidth={1.5} />
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="none"
                    dot={<CustomDot />}
                    activeDot={false}
                    isAnimationActive={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
