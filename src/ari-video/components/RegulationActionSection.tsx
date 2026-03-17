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
        padding: "150px 120px 170px",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr",
          gap: 28,
          height: "100%",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 18,
          }}
        >
          <div
            style={{
              fontFamily: videoTokens.font.mono,
              fontSize: 22,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: videoTokens.color.accent,
            }}
          >
            Regulate
          </div>
          <div
            style={{
              fontFamily: videoTokens.font.display,
              fontSize: 112,
              lineHeight: 0.92,
              color: videoTokens.color.ink,
            }}
          >
            Ari crosses a threshold and commits to an action.
          </div>
          <div
            style={{
              maxWidth: 700,
              fontFamily: videoTokens.font.sans,
              fontSize: 30,
              lineHeight: 1.42,
              color: videoTokens.color.mutedInk,
            }}
          >
            The action card is sourced from the real recorded intervention event. Confidence, trigger state, and outcome text are not storyboarded guesses.
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gap: 20,
            padding: 34,
            borderRadius: 44,
            border: `1px solid ${videoTokens.color.line}`,
            background: "rgba(11,17,23,0.78)",
            boxShadow: videoTokens.shadow.soft,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <div
              style={{
                fontFamily: videoTokens.font.mono,
                fontSize: 18,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: videoTokens.color.softInk,
              }}
            >
              Real intervention event
            </div>
            <div
              style={{
                fontFamily: videoTokens.font.mono,
                fontSize: 18,
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
              fontSize: 68,
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
              gap: 18,
            }}
          >
            <ActionStat label="Trigger" value={humanizeToken(event.triggerState)} />
            <ActionStat label="Trigger Value" value={formatPercent(event.triggerValue, 1)} />
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
                fontSize: 18,
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
                fontSize: 30,
                lineHeight: 1.38,
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
                gap: 18,
              }}
            >
              <ActionStat label="Focus State" value={formatPercent(snapshot.focusStrength)} />
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
        background: "rgba(11,17,23,0.5)",
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
          fontSize: 30,
          fontWeight: 500,
          color: videoTokens.color.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
}
