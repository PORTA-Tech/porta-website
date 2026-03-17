import { videoTokens } from "../theme/tokens";
import type { AriSignalSample } from "../lib/types";
import { clamp01, measureSignalEnergy } from "../lib/format";

interface SignalConstellationProps {
  signals: AriSignalSample[];
  currentSec: number;
  width?: number;
  height?: number;
}

export function SignalConstellation({
  signals,
  currentSec,
  width = 1100,
  height = 320,
}: SignalConstellationProps) {
  if (signals.length === 0) {
    return null;
  }

  const slotWidth = width / Math.max(1, signals.length);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="signal-grid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(244,239,231,0.18)" />
          <stop offset="100%" stopColor="rgba(244,239,231,0.02)" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((ratio) => (
        <line
          key={ratio}
          x1={0}
          y1={height * ratio}
          x2={width}
          y2={height * ratio}
          stroke="rgba(244,239,231,0.08)"
          strokeDasharray="6 16"
        />
      ))}
      {signals.map((signal, index) => {
        const x = index * slotWidth;
        const barWidth = Math.max(18, slotWidth * 0.58);
        const energy = clamp01(measureSignalEnergy(signal));
        const barHeight = 28 + (energy * 210);
        const isActive = currentSec >= signal.tStartSec && currentSec <= signal.tEndSec;
        const accent = isActive ? videoTokens.color.accent : videoTokens.color.cyan;

        return (
          <g key={`${signal.sourceCaptureId}-${signal.tStartSec}`}>
            <rect
              x={x + (slotWidth * 0.21)}
              y={height - barHeight}
              width={barWidth}
              height={barHeight}
              rx={18}
              fill={isActive ? accent : "url(#signal-grid)"}
              opacity={isActive ? 0.95 : 0.76}
            />
            <circle
              cx={x + (slotWidth * 0.5)}
              cy={height - barHeight - 18}
              r={isActive ? 9 : 6}
              fill={accent}
              opacity={0.92}
            />
          </g>
        );
      })}
    </svg>
  );
}
