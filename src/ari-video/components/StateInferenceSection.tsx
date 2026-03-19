import type { AriSnapshotSample } from "../lib/types";
import { buildSnapshotSeries, formatPercent, formatSeconds, humanizeToken } from "../lib/format";
import { videoTokens } from "../theme/tokens";
import { StateRibbonChart } from "./StateRibbonChart";

interface StateInferenceSectionProps {
  snapshots: AriSnapshotSample[];
  currentSnapshot: AriSnapshotSample | null;
  currentSec: number;
  opacity: number;
  translateY: number;
}

export function StateInferenceSection({
  snapshots,
  currentSnapshot,
  currentSec,
  opacity,
  translateY,
}: StateInferenceSectionProps) {
  if (!currentSnapshot) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "250px 140px 240px",
        display: "grid",
        gridTemplateColumns: "1.12fr 0.88fr",
        gap: 34,
        height: "100%",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr",
          gap: 26,
          minHeight: 0,
        }}
      >
        <div style={{ display: "grid", gap: 16 }}>
          <div
            style={{
              fontFamily: videoTokens.font.mono,
              fontSize: 18,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: videoTokens.color.cyan,
            }}
          >
            Infer
          </div>
          <div
            style={{
              maxWidth: 900,
              fontFamily: videoTokens.font.display,
              fontSize: 90,
              lineHeight: 0.94,
              letterSpacing: "-0.03em",
              color: videoTokens.color.ink,
            }}
          >
            Signals become state before Ari ever acts.
          </div>
          <div
            style={{
              maxWidth: 720,
              fontFamily: videoTokens.font.sans,
              fontSize: 24,
              lineHeight: 1.5,
              color: videoTokens.color.mutedInk,
            }}
          >
            The recorded trace is converted into a state trajectory: focus, overload, fatigue, stability, and confidence move first, then policy evaluates what to do next.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateRows: "auto 1fr auto",
            gap: 22,
            minHeight: 0,
            padding: 30,
            borderRadius: videoTokens.radius.xl,
            border: `1px solid ${videoTokens.color.line}`,
            background: videoTokens.color.panel,
            boxShadow: videoTokens.shadow.soft,
          }}
        >
          <div
            style={{
              fontFamily: videoTokens.font.mono,
              fontSize: 15,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: videoTokens.color.softInk,
            }}
          >
            State trajectory
          </div>
          <div style={{ minHeight: 0 }}>
            <StateRibbonChart
              progressSec={currentSec}
              focusSeries={buildSnapshotSeries(snapshots, (snapshot) => snapshot.focusStrength)}
              overloadSeries={buildSnapshotSeries(snapshots, (snapshot) => snapshot.overloadLikelihood)}
              fatigueSeries={buildSnapshotSeries(snapshots, (snapshot) => snapshot.fatigueProbability)}
              stabilitySeries={buildSnapshotSeries(snapshots, (snapshot) => snapshot.cognitiveStability)}
              width={1480}
              height={760}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 14,
            }}
          >
            <MetricStat label="Focus" value={formatPercent(currentSnapshot.focusStrength)} accent={videoTokens.color.accent} />
            <MetricStat label="Overload" value={formatPercent(currentSnapshot.overloadLikelihood)} accent={videoTokens.color.coral} />
            <MetricStat label="Fatigue" value={formatPercent(currentSnapshot.fatigueProbability)} accent={videoTokens.color.plum} />
            <MetricStat label="Stability" value={formatPercent(currentSnapshot.cognitiveStability)} accent={videoTokens.color.cyan} />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          alignContent: "center",
          gap: 16,
        }}
      >
        <SummaryPanel
          label="Current reading"
          primary={humanizeToken(currentSnapshot.dominantStateName)}
          secondary={`Confidence ${formatPercent(currentSnapshot.confidence, 1)}`}
        />
        <DetailPanel label="Last action" value={currentSnapshot.lastAction === "none" ? "Observation only" : humanizeToken(currentSnapshot.lastAction)} />
        <DetailPanel label="Sustained attention" value={formatSeconds(currentSnapshot.sustainedAttentionDurationSec)} />
        <DetailPanel label="Activation window" value={currentSnapshot.activationWindowOpen ? "Open" : "Closed"} />
      </div>
    </div>
  );
}

function MetricStat({
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
        gap: 8,
        padding: "18px 18px 16px",
        borderRadius: videoTokens.radius.md,
        background: "rgba(244,239,231,0.03)",
      }}
    >
      <div
        style={{
          width: 56,
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
          fontSize: 28,
          fontWeight: 600,
          color: videoTokens.color.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function SummaryPanel({
  label,
  primary,
  secondary,
}: {
  label: string;
  primary: string;
  secondary: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 10,
        padding: "26px 28px",
        borderRadius: videoTokens.radius.lg,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(11,17,23,0.74)",
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
        {label}
      </div>
      <div
        style={{
          fontFamily: videoTokens.font.sans,
          fontSize: 50,
          fontWeight: 600,
          lineHeight: 1.08,
          color: videoTokens.color.ink,
        }}
      >
        {primary}
      </div>
      <div
        style={{
          fontSize: 24,
          lineHeight: 1.4,
          color: videoTokens.color.mutedInk,
        }}
      >
        {secondary}
      </div>
    </div>
  );
}

function DetailPanel({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 10,
        padding: "22px 24px",
        borderRadius: videoTokens.radius.lg,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(11,17,23,0.68)",
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
          fontSize: 30,
          lineHeight: 1.3,
          fontWeight: 500,
          color: videoTokens.color.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
}
