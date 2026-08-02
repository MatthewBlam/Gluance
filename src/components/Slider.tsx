import { useCallback, useRef, useState } from "react";

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  formatLabel?: (value: number) => string;
  width?: string;
  tabIndex?: number;
}

export function Slider({ min, max, step, value, onChange, formatLabel, width = "110px", tabIndex }: SliderProps) {
  const [localValue, setLocalValue] = useState<number | null>(null);
  const dragging = useRef(false);

  const display = localValue ?? value;
  const percent = ((display - min) / (max - min)) * 100;

  const snap = useCallback((v: number) => Math.round(v / step) * step, [step]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseFloat(e.target.value);
    dragging.current = true;
    setLocalValue(raw);
    onChange(snap(raw));
  }, [onChange, snap]);

  const handleRelease = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    if (localValue !== null) {
      onChange(snap(localValue));
      setLocalValue(null);
    }
  }, [localValue, onChange, snap]);

  return (
    <div className="flex items-center gap-2.5">
      <input
        tabIndex={tabIndex}
        type="range"
        min={min}
        max={max}
        step="any"
        value={display}
        onChange={handleInput}
        onMouseUp={handleRelease}
        onPointerUp={handleRelease}
        style={{
          width,
          background: `linear-gradient(to right, var(--color-brand) ${percent}%, var(--color-app-background) ${percent}%)`,
        }}
        className="h-1.5 appearance-none rounded-full cursor-pointer accent-brand focus-visible:outline-brand outline-transparent outline-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-control-thumb [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-brand"
      />
      {formatLabel && <span className="text-sm text-app-text-muted select-none w-8">{formatLabel(snap(display))}</span>}
    </div>
  );
}
