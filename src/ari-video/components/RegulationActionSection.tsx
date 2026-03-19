import { AbsoluteFill } from "remotion";
import type { AriEventSample, AriSnapshotSample } from "../lib/types";
import { formatPercent, humanizeToken } from "../lib/format";
import { videoTokens } from "../theme/tokens";

interface RegulationActionSectionProps {
  event: AriEventSample | null;
  snapshot: AriSnapshotSample | null;
  opacity: number;
  scale: number;
}

export function RegulationActionSection({
  event,
  snapshot,
  opacity,
  scale,
}: RegulationActionSectionProps) {
  if (!event) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        padding: "250px 140px 240px",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.72fr 1.28fr",
          gap: 38,
          height: "100%",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 18,
            alignContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: videoTokens.font.mono,
              fontSize: 18,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: videoTokens.color.accent,
            }}
          >
            Regulate
          </div>
          <div
            style={{
              maxWidth: 760,
              fontFamily: videoTokens.font.display,
              fontSize: 98,
              lineHeight: 0.94,
              letterSpacing: "-0.03em",
              color: videoTokens.color.ink,
            }}
          >
            Ari crosses a threshold and commits to a real action.
          </div>
          <div
            style={{
              maxWidth: 620,
              fontFamily: videoTokens.font.sans,
              fontSize: 24,
              lineHeight: 1.5,
              color: videoTokens.color.mutedInk,
            }}
          >
            The action card is sourced from the recorded intervention event. Trigger state, confidence, and system outcome are shown as captured, not storyboarded.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: 20,
            padding: "34px 36px",
            borderRadius: 42,
            border: `1px solid ${videoTokens.color.line}`,
            background: "rgba(11,17,23,0.8)",
            boxShadow: videoTokens.shadow.soft,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 24,
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
              Recorded intervention
            </div>
            <div
              style={{
                fontFamily: videoTokens.font.mono,
                fontSize: 16,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: videoTokens.color.accent,
              }}
            >
              {formatPercent(event.confidence, 1)}
            </div>
          </div>
          <div
            style={{
              fontFamily: videoTokens.font.sans,
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.04,
              color: videoTokens.color.ink,
            }}
          >
            {humanizeToken(event.action)}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 16,
            }}
          >
            <ActionStat label="Trigger" value={humanizeToken(event.triggerState)} />
            <ActionStat label="Trigger value" value={formatPercent(event.triggerValue, 1)} />
            <ActionStat label="Execution" value={humanizeToken(event.executionState)} />
          </div>
          <div
            style={{
              padding: "22px 24px",
              borderRadius: 24,
              background: "rgba(244,239,231,0.04)",
              display: "grid",
              gap: 10,
            }}
          >
            <div
              style={{
                fontFamily: videoTokens.font.mono,
                fontSize: 14,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: videoTokens.color.softInk,
              }}
            >
              What changed
            </div>
            <div
              style={{
                fontFamily: videoTokens.font.sans,
                fontSize: 26,
                lineHeight: 1.42,
                color: videoTokens.color.ink,
              }}
            >
              {event.whatChanged || event.reason}
            </div>
          </div>
          {snapshot ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 16,
              }}
            >
              <ActionStat label="Focus" value={formatPercent(snapshot.focusStrength)} />
              <ActionStat label="Stability" value={formatPercent(snapshot.cognitiveStability)} />
              <ActionStat label="Overload" value={formatPercent(snapshot.overloadLikelihood)} />
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function ActionStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 8,
        padding: "18px 18px 16px",
        borderRadius: 24,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(11,17,23,0.52)",
      }}
    >
      <div
        style={{
          fontFamily: videoTokens.font.mono,
          fontSize: 13,
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
          lineHeight: 1.3,
        }}
      >
        {value}
      </div>
    </div>
  );
}
