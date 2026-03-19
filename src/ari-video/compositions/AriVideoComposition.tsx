import {
  AbsoluteFill,
  interpolate,
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
import { VideoHud } from "../components/VideoHud";
import { VoiceoverTrack } from "../components/VoiceoverTrack";
import {
  clamp01,
  findActiveBeat,
  findActiveChapter,
  findAnchorEvent,
  getCurrentSignal,
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
  const { trace, beatMap, summary, voiceover } = data;
  const anchorEvent = findAnchorEvent(trace.events);
  const currentSignal = getCurrentSignal(trace.signals, currentSec);
  const currentSnapshot =
    [...trace.snapshots].reverse().find((snapshot) => currentSec >= snapshot.tSec)
    ?? trace.snapshots[0]
    ?? null;
  const activeBeat = findActiveBeat(beatMap.beats, currentSec);
  const activeChapter = findActiveChapter(trace.chapters, currentSec);

  const inferStart = trace.chapters.find((chapter) => chapter.chapterId === "infer")?.startSec ?? 10;
  const regulateStart = trace.chapters.find((chapter) => chapter.chapterId === "regulate")?.startSec ?? 22;
  const explainStart = trace.chapters.find((chapter) => chapter.chapterId === "explain")?.startSec ?? 36;

  const openingOpacity = 1 - rangeProgress(currentSec, 5.2, 6.8);
  const trackingOpacity = clamp01(rangeProgress(currentSec, 5.8, 7.1))
    * (1 - rangeProgress(currentSec, inferStart - 0.45, inferStart + 0.8));
  const inferenceOpacity = clamp01(rangeProgress(currentSec, inferStart - 0.15, inferStart + 1.15))
    * (1 - rangeProgress(currentSec, regulateStart - 0.6, regulateStart + 0.85));
  const regulationOpacity = clamp01(rangeProgress(currentSec, regulateStart - 0.15, regulateStart + 1.15))
    * (1 - rangeProgress(currentSec, explainStart - 0.55, explainStart + 0.85));
  const explainOpacity = clamp01(rangeProgress(currentSec, explainStart - 0.15, explainStart + 1.15));

  const regulationScale = interpolate(regulationOpacity, [0, 1], [0.982, 1]);
  const openingOffset = interpolate(openingOpacity, [0, 1], [18, 0]);
  const trackingOffset = interpolate(trackingOpacity, [0, 1], [24, 0]);
  const inferenceOffset = interpolate(inferenceOpacity, [0, 1], [22, 0]);
  const explainOffset = interpolate(explainOpacity, [0, 1], [20, 0]);
  const hudOpacity = clamp01(rangeProgress(currentSec, 1.6, 2.8));
  const timelineOpacity = clamp01(rangeProgress(currentSec, 1.8, 3.4));

  const confidence = interpolateSnapshotMetric(trace.snapshots, currentSec, (snapshot) => snapshot.confidence);
  const focus = interpolateSnapshotMetric(trace.snapshots, currentSec, (snapshot) => snapshot.focusStrength);
  const overload = interpolateSnapshotMetric(trace.snapshots, currentSec, (snapshot) => snapshot.overloadLikelihood);

  return (
    <AbsoluteFill
      style={{
        background: videoTokens.color.canvas,
        color: videoTokens.color.ink,
        fontFamily: videoTokens.font.sans,
      }}
    >
      <Backdrop />

      <VoiceoverTrack voiceover={voiceover} fps={fps} />

      <VideoHud
        activeBeat={activeBeat}
        activeChapter={activeChapter}
        focus={focus}
        confidence={confidence}
        overload={overload}
        opacity={hudOpacity}
      />

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

      <TimelineRail
        chapters={trace.chapters}
        beats={beatMap.beats}
        durationSec={trace.meta.durationSec}
        currentSec={currentSec}
        opacity={timelineOpacity}
      />
    </AbsoluteFill>
  );
}
