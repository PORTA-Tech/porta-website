import { formatPercent, humanizeToken } from "../lib/format";
import type { AriBeat, AriChapter } from "../lib/types";
import { videoTokens } from "../theme/tokens";

interface VideoHudProps {
  activeBeat: AriBeat | null;
  activeChapter: AriChapter | null;
  focus: number;
  confidence: number;
  overload: number;
  opacity: number;
}

export function VideoHud({
  activeBeat,
  activeChapter,
  focus,
  confidence,
  overload,
  opacity,
}: VideoHudProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 68,
        left: 120,
        right: 120,
        display: "grid",
        gridTemplateColumns: "1.15fr 0.85fr",
        gap: 18,
        opacity,
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 12,
          padding: "22px 26px",
          borderRadius: 28,
          border: `1px solid ${videoTokens.color.line}`,
          background: "rgba(11,17,23,0.62)",
          boxShadow: videoTokens.shadow.crisp,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              fontFamily: videoTokens.font.mono,
              fontSize: 14,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: videoTokens.color.softInk,
            }}
          >
            Active beat
          </div>
          <div
            style={{
              padding: "7px 12px",
              borderRadius: 999,
              background: "rgba(244,239,231,0.04)",
              color: videoTokens.color.accent,
              fontFamily: videoTokens.font.mono,
              fontSize: 13,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            {humanizeToken(activeChapter?.chapterId ?? "observe")}
          </div>
        </div>
        <div
          style={{
            fontFamily: videoTokens.font.sans,
            fontSize: 34,
            fontWeight: 600,
            color: videoTokens.color.ink,
          }}
        >
          {activeBeat?.title ?? "Recorded Ari Story"}
        </div>
        <div
          style={{
            fontFamily: videoTokens.font.sans,
            fontSize: 20,
            lineHeight: 1.45,
            color: videoTokens.color.mutedInk,
          }}
        >
          {activeBeat?.purpose ?? "Curated recorded Ari behavior."}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 14,
        }}
      >
        <HudMetric label="Focus" value={formatPercent(focus)} accent={videoTokens.color.accent} />
        <HudMetric label="Confidence" value={formatPercent(confidence, 1)} accent={videoTokens.color.cyan} />
        <HudMetric label="Overload" value={formatPercent(overload)} accent={videoTokens.color.coral} />
      </div>
    </div>
  );
}

function HudMetric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 10,
        padding: "18px 18px 16px",
        borderRadius: 24,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(11,17,23,0.58)",
      }}
    >
      <div
        style={{
          width: 52,
          height: 3,
          borderRadius: 999,
          background: accent,
        }}
      />
      <div
        style={{
          fontFamily: videoTokens.font.mono,
          fontSize: 13,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: videoTokens.color.softInk,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: videoTokens.font.sans,
          fontSize: 26,
          fontWeight: 600,
          color: videoTokens.color.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
}
