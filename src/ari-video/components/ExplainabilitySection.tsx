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
        padding: "170px 120px 170px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 26,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 16,
          alignContent: "start",
        }}
      >
        <div
          style={{
            fontFamily: videoTokens.font.mono,
            fontSize: 22,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: videoTokens.color.cyan,
          }}
        >
          Explain
        </div>
        <div
          style={{
            fontFamily: videoTokens.font.display,
            fontSize: 104,
            lineHeight: 0.92,
            color: videoTokens.color.ink,
          }}
        >
          Trust comes from showing why the system moved.
        </div>
        <div
          style={{
            maxWidth: 740,
            fontFamily: videoTokens.font.sans,
            fontSize: 30,
            lineHeight: 1.42,
            color: videoTokens.color.mutedInk,
          }}
        >
          The close is not a generic end-card. It surfaces the trigger state, the confidence that supported the decision, and the reversible path back out.
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gap: 18,
          alignContent: "start",
        }}
      >
        <ExplainCard label="Reason" value={event.reason} />
        <ExplainCard label="Undo Path" value={event.howToUndo || "No explicit undo required."} />
        <ExplainCard label="Contributors" value={event.contributors.map(humanizeToken).join("  /  ") || "Recorded state trajectory"} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 18,
          }}
        >
          <ExplainStat label="Confidence" value={formatPercent(event.confidence, 1)} />
          <ExplainStat label="Lifecycle" value={humanizeToken(event.lifecycleState)} />
          <ExplainStat label="Source" value={summary?.selectedCapture ?? "Recorded capture"} />
        </div>
      </div>
    </div>
  );
}

function ExplainCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 10,
        padding: "24px 26px",
        borderRadius: videoTokens.radius.lg,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(11,17,23,0.72)",
      }}
    >
      <div
        style={{
          fontFamily: videoTokens.font.mono,
          fontSize: 16,
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
          fontSize: 30,
          lineHeight: 1.4,
          color: videoTokens.color.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ExplainStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 8,
        padding: "18px 18px 16px",
        borderRadius: 24,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(11,17,23,0.48)",
      }}
    >
      <div
        style={{
          fontFamily: videoTokens.font.mono,
          fontSize: 16,
          letterSpacing: "0.14em",
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
          fontWeight: 500,
          color: videoTokens.color.ink,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}
