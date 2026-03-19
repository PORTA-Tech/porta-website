import { videoTokens } from "../theme/tokens";
import type { AriEventSample, AriVideoMeta } from "../lib/types";
import { formatPercent, humanizeToken } from "../lib/format";

interface OpeningHookSectionProps {
  meta: AriVideoMeta;
  anchorEvent: AriEventSample | null;
  opacity: number;
  translateY: number;
}

export function OpeningHookSection({
  meta,
  anchorEvent,
  opacity,
  translateY,
}: OpeningHookSectionProps) {
  const primaryCapture = meta.sourceCaptures[0] ?? null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "248px 140px 242px",
        display: "grid",
        gridTemplateColumns: "1.08fr 0.92fr",
        gap: 48,
        alignItems: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 24,
        }}
      >
        <div
          style={{
            fontFamily: videoTokens.font.mono,
            fontSize: 18,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: videoTokens.color.accent,
          }}
        >
          Recorded Ari behavior
        </div>
        <div
          style={{
            maxWidth: 1320,
            fontFamily: videoTokens.font.display,
            fontSize: 138,
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            color: videoTokens.color.ink,
          }}
        >
          Ari watches the rhythm,
          <br />
          not the content.
        </div>
        <div
          style={{
            maxWidth: 820,
            fontFamily: videoTokens.font.sans,
            fontSize: 28,
            lineHeight: 1.52,
            color: videoTokens.color.mutedInk,
          }}
        >
          This film is built from a curated recorded Ari trace. Every state shift, threshold crossing, and intervention cue shown here comes from the exact session behind the video.
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 18,
          padding: "30px 32px",
          borderRadius: 38,
          border: `1px solid ${videoTokens.color.line}`,
          background: "rgba(11,17,23,0.74)",
          boxShadow: videoTokens.shadow.soft,
        }}
      >
        <div
          style={{
            fontFamily: videoTokens.font.mono,
            fontSize: 16,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: videoTokens.color.softInk,
          }}
        >
          Truth layer
        </div>
        <div
          style={{
            fontFamily: videoTokens.font.sans,
            fontSize: 40,
            fontWeight: 600,
            lineHeight: 1.14,
            color: videoTokens.color.ink,
          }}
        >
          Built from one recorded session, then art-directed for clarity.
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          <FactCard label="Runtime" value={`${meta.durationSec}s`} />
          <FactCard label="Boundary" value="Behavioral signals only" />
          <FactCard label="Story Arc" value={meta.storyArc} compact />
          <FactCard
            label="Anchor Event"
            value={anchorEvent ? `${humanizeToken(anchorEvent.action)} ${formatPercent(anchorEvent.confidence, 1)}` : "Awaiting event"}
            compact
          />
        </div>
        {primaryCapture ? (
          <div
            style={{
              display: "grid",
              gap: 8,
              padding: "18px 20px",
              borderRadius: 24,
              background: "rgba(244,239,231,0.04)",
            }}
          >
            <div
              style={{
                fontFamily: videoTokens.font.mono,
                fontSize: 14,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: videoTokens.color.softInk,
              }}
            >
              Source capture
            </div>
            <div
              style={{
                fontFamily: videoTokens.font.sans,
                fontSize: 22,
                lineHeight: 1.4,
                color: videoTokens.color.ink,
                overflowWrap: "anywhere",
              }}
            >
              {primaryCapture.label}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FactCard({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 8,
        padding: compact ? "18px 18px 16px" : "20px 18px 18px",
        borderRadius: 24,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(11,17,23,0.44)",
      }}
    >
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
          fontSize: compact ? 20 : 24,
          lineHeight: 1.35,
          fontWeight: 500,
          color: videoTokens.color.ink,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </div>
    </div>
  );
}
