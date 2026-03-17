import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { ExplainabilitySection } from "../components/ExplainabilitySection";
import { OpeningHookSection } from "../components/OpeningHookSection";
import { RegulationActionSection } from "../components/RegulationActionSection";
import { SignalTrackingSection } from "../components/SignalTrackingSection";
import { StateInferenceSection } from "../components/StateInferenceSection";
import { TimelineRail } from "../components/TimelineRail";
import {
  clamp01,
  findActiveBeat,
  findActiveChapter,
  findAnchorEvent,
  formatPercent,
  getCurrentSignal,
  humanizeToken,
  interpolateSnapshotMetric,
  rangeProgress,
} from "../lib/format";
import { useAriVideoData } from "../lib/useAriVideoData";
import { videoTokens } from "../theme/tokens";

export function AriVideoComposition() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { data } = useAriVideoData();

  if (!data) {
    return <AbsoluteFill style={{ background: videoTokens.color.canvas }} />;
  }

  const currentSec = frame / fps;
  const { trace, beatMap, summary } = data;
  const anchorEvent = findAnchorEvent(trace.events);
  const currentSignal = getCurrentSignal(trace.signals, currentSec);
  const currentSnapshot =
    [...trace.snapshots].reverse().find((snapshot) => currentSec >= snapshot.tSec)
    ?? trace.snapshots[0]
    ?? null;
  const activeBeat = findActiveBeat(beatMap.beats, currentSec);
  const activeChapter = findActiveChapter(trace.chapters, currentSec);

  const observeStart = trace.chapters.find((chapter) => chapter.chapterId === "observe")?.startSec ?? 0;
  const inferStart = trace.chapters.find((chapter) => chapter.chapterId === "infer")?.startSec ?? 10;
  const regulateStart = trace.chapters.find((chapter) => chapter.chapterId === "regulate")?.startSec ?? 22;
  const explainStart = trace.chapters.find((chapter) => chapter.chapterId === "explain")?.startSec ?? 36;

  const openingOpacity = 1 - rangeProgress(currentSec, 6.5, 12);
  const trackingOpacity = clamp01(rangeProgress(currentSec, observeStart, observeStart + 3.2))
    * (1 - rangeProgress(currentSec, inferStart - 2.4, inferStart + 1.2));
  const inferenceOpacity = clamp01(rangeProgress(currentSec, inferStart - 1.8, inferStart + 1.6))
    * (1 - rangeProgress(currentSec, regulateStart - 1.8, regulateStart + 1.2));
  const regulationOpacity = clamp01(rangeProgress(currentSec, regulateStart - 1.2, regulateStart + 1.4))
    * (1 - rangeProgress(currentSec, explainStart - 1.4, explainStart + 1.2));
  const explainOpacity = clamp01(rangeProgress(currentSec, explainStart - 1.4, explainStart + 1.8));

  const regulationScale = interpolate(regulationOpacity, [0, 1], [0.965, 1]);
  const openingOffset = interpolate(openingOpacity, [0, 1], [28, 0]);
  const trackingOffset = interpolate(trackingOpacity, [0, 1], [44, 0]);
  const inferenceOffset = interpolate(inferenceOpacity, [0, 1], [40, 0]);
  const explainOffset = interpolate(explainOpacity, [0, 1], [30, 0]);

  const confidence = interpolateSnapshotMetric(trace.snapshots, currentSec, (snapshot) => snapshot.confidence);
  const focus = interpolateSnapshotMetric(trace.snapshots, currentSec, (snapshot) => snapshot.focusStrength);
  const overload = interpolateSnapshotMetric(trace.snapshots, currentSec, (snapshot) => snapshot.overloadLikelihood);

  const pulse = spring({
    frame,
    fps,
    config: {
      damping: 200,
      mass: 0.8,
      stiffness: 90,
    },
  });

  return (
    <AbsoluteFill
      style={{
        background: videoTokens.color.canvas,
        color: videoTokens.color.ink,
        fontFamily: videoTokens.font.sans,
      }}
    >
      <Backdrop />

      <OpeningHookSection
        meta={trace.meta}
        anchorEvent={anchorEvent}
        opacity={openingOpacity}
        translateY={openingOffset}
      />

      <SignalTrackingSection
        signals={trace.signals}
        currentSignal={currentSignal}
        currentSec={currentSec}
        opacity={trackingOpacity}
        translateY={trackingOffset}
      />

      <StateInferenceSection
        snapshots={trace.snapshots}
        currentSnapshot={currentSnapshot}
        currentSec={currentSec}
        opacity={inferenceOpacity}
        translateY={inferenceOffset}
      />

      <RegulationActionSection
        event={anchorEvent}
        snapshot={currentSnapshot}
        opacity={regulationOpacity}
        scale={regulationScale}
      />

      <ExplainabilitySection
        event={anchorEvent}
        summary={summary}
        opacity={explainOpacity}
        translateY={explainOffset}
      />

      <div
        style={{
          position: "absolute",
          top: 82,
          right: 120,
          width: 580,
          display: "grid",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 8,
            padding: "22px 24px",
            borderRadius: 26,
            border: `1px solid ${videoTokens.color.line}`,
            background: "rgba(11,17,23,0.58)",
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
            Active beat
          </div>
          <div
            style={{
              fontFamily: videoTokens.font.sans,
              fontSize: 34,
              fontWeight: 600,
              color: videoTokens.color.ink,
            }}
          >
            {activeBeat?.title ?? "Loading"}
          </div>
          <div
            style={{
              fontFamily: videoTokens.font.sans,
              fontSize: 22,
              lineHeight: 1.4,
              color: videoTokens.color.mutedInk,
            }}
          >
            {activeBeat?.purpose ?? "Waiting for curated beat map"}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          <TopMetric label="Focus" value={formatPercent(focus)} accent={videoTokens.color.accent} />
          <TopMetric label="Confidence" value={formatPercent(confidence, 1)} accent={videoTokens.color.cyan} />
          <TopMetric label="Overload" value={formatPercent(overload)} accent={videoTokens.color.coral} />
        </div>

        <div
          style={{
            display: "grid",
            gap: 8,
            padding: "18px 24px",
            borderRadius: 24,
            border: `1px solid ${videoTokens.color.line}`,
            background: "rgba(11,17,23,0.54)",
          }}
        >
          <div
            style={{
              fontFamily: videoTokens.font.mono,
              fontSize: 17,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: videoTokens.color.softInk,
            }}
          >
            Current chapter
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 12 + (pulse * 10),
                height: 12 + (pulse * 10),
                borderRadius: "50%",
                background: videoTokens.color.accent,
                boxShadow: "0 0 20px rgba(215,255,100,0.45)",
              }}
            />
            <div
              style={{
                fontFamily: videoTokens.font.sans,
                fontSize: 30,
                fontWeight: 500,
                color: videoTokens.color.ink,
              }}
            >
              {humanizeToken(activeChapter?.chapterId ?? "observe")}
            </div>
          </div>
        </div>
      </div>

      <TimelineRail
        chapters={trace.chapters}
        beats={beatMap.beats}
        durationSec={trace.meta.durationSec}
        currentSec={currentSec}
      />
    </AbsoluteFill>
  );
}

function TopMetric({
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
        borderRadius: 22,
        border: `1px solid ${videoTokens.color.line}`,
        background: "rgba(11,17,23,0.56)",
      }}
    >
      <div
        style={{
          width: 44,
          height: 3,
          borderRadius: 999,
          background: accent,
        }}
      />
      <div
        style={{
          fontFamily: videoTokens.font.mono,
          fontSize: 14,
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
          fontSize: 24,
          fontWeight: 600,
          color: videoTokens.color.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
}
