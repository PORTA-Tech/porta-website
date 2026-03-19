import type { AriEventSample, AriVideoSummary } from "../lib/types";
import { formatPercent, humanizeToken } from "../lib/format";
import { videoTokens } from "../theme/tokens";

interface ExplainabilitySectionProps {
  event: AriEventSample | null;
  summary: AriVideoSummary | null;
  opacity: number;
  translateY: number;
}

export function ExplainabilitySection({
  event,
  summary,
  opacity,
  translateY,
}: ExplainabilitySectionProps) {
  if (!event) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "250px 140px 240px",
        display: "grid",
        gridTemplateColumns: "0.72fr 1.28fr",
        gap: 34,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 18,
          alignContent: "start",
        }}
      >
        <div
          style={{
            fontFamily: videoTokens.font.mono,
            fontSize: 18,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: videoTokens.color.cyan,
          }}
        >
          Explain
        </div>
        <div
          style={{
            maxWidth: 760,
            fontFamily: videoTokens.font.display,
            fontSize: 92,
            lineHeight: 0.94,
            letterSpacing: "-0.03em",
            color: videoTokens.color.ink,
          }}
        >
          Trust comes from showing why the system moved.
        </div>
        <div
          style={{
            maxWidth: 640,
            fontFamily: videoTokens.font.sans,
            fontSize: 24,
            lineHeight: 1.5,
            color: videoTokens.color.mutedInk,
          }}
        >
          The close makes the action legible: which state triggered it, how confident the system was, and how the intervention resolves when context changes.
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
          alignContent: "start",
        }}
      >
        <ExplainCard label="Reason" value={event.reason} wide />
        <ExplainCard label="Undo path" value={event.howToUndo || "No explicit undo required."} wide />
        <ExplainCard
          label="Contributors"
          value={event.contributors.length > 0 ? event.contributors.map(humanizeToken).join(" / ") : "Recorded state trajectory"}
          wide
        />
        <ExplainCard label="Confidence" value={formatPercent(event.confidence, 1)} />
        <ExplainCard label="Lifecycle" value={humanizeToken(event.lifecycleState)} />
        <ExplainCard label="Source capture" value={summary?.selectedCapture ?? "Recorded capture"} wide />
      </div>
    </div>
  );
}

function ExplainCard({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 10,
        padding: "22px 24px",
        borderRadius: videoTokens.radius.lg,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(11,17,23,0.72)",
        gridColumn: wide ? "1 / -1" : undefined,
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
          fontSize: wide ? 24 : 28,
          lineHeight: 1.45,
          fontWeight: wide ? 400 : 500,
          color: videoTokens.color.ink,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </div>
    </div>
  );
}
