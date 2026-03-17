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
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 110,
        width: 1440,
        display: "grid",
        gap: 26,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          fontFamily: videoTokens.font.mono,
          fontSize: 24,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: videoTokens.color.accent,
        }}
      >
        Recorded Ari behavior
      </div>
      <div
        style={{
          maxWidth: 1220,
          fontFamily: videoTokens.font.display,
          fontSize: 158,
          lineHeight: 0.9,
          color: videoTokens.color.ink,
        }}
      >
        Ari watches the rhythm,
        <br />
        not the content.
      </div>
      <div
        style={{
          maxWidth: 900,
          fontFamily: videoTokens.font.sans,
          fontSize: 36,
          lineHeight: 1.38,
          color: videoTokens.color.mutedInk,
        }}
      >
        This film is built from one curated recorded trace. Every state rise, threshold, and intervention cue comes from the exact Ari session behind the video.
      </div>
      <div
        style={{
          display: "flex",
          gap: 22,
          marginTop: 8,
        }}
      >
        <MetricPill label="Story Arc" value={meta.storyArc} />
        {anchorEvent ? (
          <MetricPill
            label="Anchor Event"
            value={`${humanizeToken(anchorEvent.action)}  ${formatPercent(anchorEvent.confidence, 1)}`}
          />
        ) : null}
      </div>
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 8,
        padding: "18px 22px",
        borderRadius: videoTokens.radius.md,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(11,17,23,0.5)",
        boxShadow: videoTokens.shadow.crisp,
      }}
    >
      <div
        style={{
          fontFamily: videoTokens.font.mono,
          fontSize: 18,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: videoTokens.color.softInk,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: videoTokens.font.sans,
          fontSize: 28,
          fontWeight: 500,
          color: videoTokens.color.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
}
