import { videoTokens } from "../theme/tokens";

interface SeriesPoint {
  tSec: number;
  value: number;
}

interface StateRibbonChartProps {
  width?: number;
  height?: number;
  progressSec: number;
  focusSeries: SeriesPoint[];
  overloadSeries: SeriesPoint[];
  fatigueSeries: SeriesPoint[];
  stabilitySeries: SeriesPoint[];
}

const chartColors = {
  focus: "#d7ff64",
  overload: "#ff8c6b",
  fatigue: "#a796ff",
  stability: "#7fe8ff",
} as const;

export function StateRibbonChart({
  width = 1120,
  height = 380,
  progressSec,
  focusSeries,
  overloadSeries,
  fatigueSeries,
  stabilitySeries,
}: StateRibbonChartProps) {
  const maxTime = Math.max(
    focusSeries.at(-1)?.tSec ?? 1,
    overloadSeries.at(-1)?.tSec ?? 1,
    fatigueSeries.at(-1)?.tSec ?? 1,
    stabilitySeries.at(-1)?.tSec ?? 1,
    1,
  );

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%" }}>
      {[0.2, 0.4, 0.6, 0.8].map((ratio) => (
        <line
          key={ratio}
          x1={0}
          y1={height * ratio}
          x2={width}
          y2={height * ratio}
          stroke="rgba(244,239,231,0.08)"
          strokeDasharray="8 18"
        />
      ))}
      <path d={buildLine(focusSeries, width, height, maxTime)} fill="none" stroke={chartColors.focus} strokeWidth={6} />
      <path d={buildLine(overloadSeries, width, height, maxTime)} fill="none" stroke={chartColors.overload} strokeWidth={4} opacity={0.92} />
      <path d={buildLine(fatigueSeries, width, height, maxTime)} fill="none" stroke={chartColors.fatigue} strokeWidth={4} opacity={0.82} />
      <path d={buildLine(stabilitySeries, width, height, maxTime)} fill="none" stroke={chartColors.stability} strokeWidth={4} opacity={0.88} />
      <line
        x1={(progressSec / maxTime) * width}
        y1={0}
        x2={(progressSec / maxTime) * width}
        y2={height}
        stroke={videoTokens.color.ink}
        strokeWidth={3}
        opacity={0.4}
      />
    </svg>
  );
}

function buildLine(series: SeriesPoint[], width: number, height: number, maxTime: number) {
  if (series.length === 0) {
    return "";
  }

  return series
    .map((point, index) => {
      const x = (point.tSec / maxTime) * width;
      const y = height - (point.value * (height - 24)) - 12;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}
