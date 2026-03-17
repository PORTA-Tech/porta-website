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
        padding: "165px 120px 160px",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        gap: 34,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div style={{ display: "grid", gap: 14 }}>
        <div
          style={{
            fontFamily: videoTokens.font.mono,
            fontSize: 22,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: videoTokens.color.cyan,
          }}
        >
          Infer
        </div>
        <div
          style={{
            maxWidth: 1040,
            fontFamily: videoTokens.font.display,
            fontSize: 108,
            lineHeight: 0.92,
            color: videoTokens.color.ink,
          }}
        >
          Signals become a state trajectory before Ari acts.
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 28,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 22,
            padding: 30,
            borderRadius: videoTokens.radius.xl,
            border: `1px solid ${videoTokens.color.line}`,
            background: videoTokens.color.panel,
            boxShadow: videoTokens.shadow.soft,
          }}
        >
          <StateRibbonChart
            progressSec={currentSec}
            focusSeries={buildSnapshotSeries(snapshots, (snapshot) => snapshot.focusStrength)}
            overloadSeries={buildSnapshotSeries(snapshots, (snapshot) => snapshot.overloadLikelihood)}
            fatigueSeries={buildSnapshotSeries(snapshots, (snapshot) => snapshot.fatigueProbability)}
            stabilitySeries={buildSnapshotSeries(snapshots, (snapshot) => snapshot.cognitiveStability)}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 18,
            }}
          >
            <MetricStat label="Focus" value={formatPercent(currentSnapshot.focusStrength)} accent={videoTokens.color.accent} />
            <MetricStat label="Overload" value={formatPercent(currentSnapshot.overloadLikelihood)} accent={videoTokens.color.coral} />
            <MetricStat label="Fatigue" value={formatPercent(currentSnapshot.fatigueProbability)} accent={videoTokens.color.plum} />
            <MetricStat label="Stability" value={formatPercent(currentSnapshot.cognitiveStability)} accent={videoTokens.color.cyan} />
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gap: 18,
            alignContent: "start",
          }}
        >
          <DetailPanel label="Dominant State" value={humanizeToken(currentSnapshot.dominantStateName)} />
          <DetailPanel label="Confidence" value={formatPercent(currentSnapshot.confidence, 1)} />
          <DetailPanel label="Sustained Attention" value={formatSeconds(currentSnapshot.sustainedAttentionDurationSec)} />
          <DetailPanel label="Last Action" value={currentSnapshot.lastAction === "none" ? "Observation only" : humanizeToken(currentSnapshot.lastAction)} />
        </div>
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
          width: 64,
          height: 3,
          borderRadius: 999,
          background: accent,
        }}
      />
      <div
        style={{
          fontFamily: videoTokens.font.mono,
          fontSize: 17,
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
          fontSize: 34,
          fontWeight: 600,
          color: videoTokens.color.ink,
        }}
      >
        {value}
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
        padding: "24px 26px",
        borderRadius: videoTokens.radius.lg,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(11,17,23,0.72)",
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
        {label}
      </div>
      <div
        style={{
          fontFamily: videoTokens.font.sans,
          fontSize: 38,
          fontWeight: 500,
          color: videoTokens.color.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
}
