import { staticFile } from "remotion";
import type {
  AriBeat,
  AriChapter,
  AriEventSample,
  AriSignalSample,
  AriSnapshotSample,
  AriVideoBeatMap,
  AriVideoData,
  AriVideoSummary,
  AriVideoTrace,
  AriVoiceoverManifest,
} from "./types";
import { ARI_VIDEO_TRACE_MANIFEST } from "../data/traceManifest";

let cachedPromise: Promise<AriVideoData> | null = null;

export const loadAriVideoData = async () => {
  if (!cachedPromise) {
    cachedPromise = Promise.all([
      fetchJson(staticFile(ARI_VIDEO_TRACE_MANIFEST.tracePublicPath.replace(/^\//, ""))),
      fetchJson(staticFile(ARI_VIDEO_TRACE_MANIFEST.beatMapPublicPath.replace(/^\//, ""))),
      fetchJson(staticFile(ARI_VIDEO_TRACE_MANIFEST.summaryPublicPath.replace(/^\//, ""))).catch(() => null),
      fetchJson(staticFile(ARI_VIDEO_TRACE_MANIFEST.voiceoverPublicPath.replace(/^\//, ""))).catch(() => null),
    ]).then(([tracePayload, beatMapPayload, summaryPayload, voiceoverPayload]) => {
      return {
        trace: normalizeTrace(tracePayload),
        beatMap: normalizeBeatMap(beatMapPayload),
        summary: normalizeSummary(summaryPayload),
        voiceover: normalizeVoiceover(voiceoverPayload),
      };
    });
  }

  return cachedPromise;
};

const fetchJson = async (path: string) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load Ari video asset: ${path} (${response.status})`);
  }

  return response.json();
};

const normalizeTrace = (payload: unknown): AriVideoTrace => {
  const trace = payload as Record<string, unknown>;
  return {
    meta: normalizeMeta(trace.Meta as Record<string, unknown>),
    signals: ((trace.Signals as unknown[]) ?? []).map(normalizeSignal),
    snapshots: ((trace.Snapshots as unknown[]) ?? []).map(normalizeSnapshot),
    events: ((trace.Events as unknown[]) ?? []).map(normalizeEvent),
    chapters: ((trace.Chapters as unknown[]) ?? []).map(normalizeChapter),
  };
};

const normalizeMeta = (payload: Record<string, unknown>) => ({
  schema: String(payload.Schema ?? ""),
  traceId: String(payload.TraceId ?? ""),
  label: String(payload.Label ?? ""),
  createdAtUtc: String(payload.CreatedAtUtc ?? ""),
  frameRate: Number(payload.FrameRate ?? 30),
  durationSec: Number(payload.DurationSec ?? 45),
  curationMode: String(payload.CurationMode ?? ""),
  storyArc: String(payload.StoryArc ?? ""),
  sourceCaptures: ((payload.SourceCaptures as unknown[]) ?? []).map((source) => {
    const entry = source as Record<string, unknown>;
    return {
      captureId: String(entry.CaptureId ?? ""),
      label: String(entry.Label ?? ""),
      directoryPath: String(entry.DirectoryPath ?? ""),
      observedFromUtc: optionalString(entry.ObservedFromUtc),
      observedToUtc: optionalString(entry.ObservedToUtc),
      segments: ((entry.Segments as unknown[]) ?? []).map((segment) => {
        const rawSegment = segment as Record<string, unknown>;
        return {
          chapterId: String(rawSegment.ChapterId ?? ""),
          sourceFromUtc: String(rawSegment.SourceFromUtc ?? ""),
          sourceToUtc: String(rawSegment.SourceToUtc ?? ""),
          traceStartSec: Number(rawSegment.TraceStartSec ?? 0),
          traceEndSec: Number(rawSegment.TraceEndSec ?? 0),
          selectionReason: String(rawSegment.SelectionReason ?? ""),
          selectionScore: Number(rawSegment.SelectionScore ?? 0),
        };
      }),
    };
  }),
});

const normalizeSignal = (payload: unknown): AriSignalSample => {
  const signal = payload as Record<string, unknown>;
  return {
    signalKind: String(signal.SignalKind ?? "input_bucket"),
    tStartSec: Number(signal.TStartSec ?? 0),
    tEndSec: Number(signal.TEndSec ?? 0),
    sourceCaptureId: String(signal.SourceCaptureId ?? ""),
    sourceStartUtc: String(signal.SourceStartUtc ?? ""),
    sourceEndUtc: String(signal.SourceEndUtc ?? ""),
    typingBurstIntensity: optionalNumber(signal.TypingBurstIntensity),
    scrollVelocityIndex: optionalNumber(signal.ScrollVelocityIndex),
    focusSwitchRate: optionalNumber(signal.FocusSwitchRate),
    keyboardKeydownCount: optionalNumber(signal.KeyboardKeydownCount),
    keyboardBackspaceCount: optionalNumber(signal.KeyboardBackspaceCount),
    keyboardBackspaceRate: optionalNumber(signal.KeyboardBackspaceRate),
    keyboardIkiMeanMs: optionalNumber(signal.KeyboardIkiMeanMs),
    keyboardIkiStdMs: optionalNumber(signal.KeyboardIkiStdMs),
    keyboardIkiCv: optionalNumber(signal.KeyboardIkiCv),
    keyboardBurstCount: optionalNumber(signal.KeyboardBurstCount),
    keyboardBurstRate: optionalNumber(signal.KeyboardBurstRate),
    keyboardCorrectionSpikeCount: optionalNumber(signal.KeyboardCorrectionSpikeCount),
    keyboardCorrectionSpikeRate: optionalNumber(signal.KeyboardCorrectionSpikeRate),
    mouseWheelDelta: optionalNumber(signal.MouseWheelDelta),
    mouseWheelEventCount: optionalNumber(signal.MouseWheelEventCount),
    mouseMoveDx: optionalNumber(signal.MouseMoveDx),
    mouseMoveDy: optionalNumber(signal.MouseMoveDy),
    mouseMoveSampleCount: optionalNumber(signal.MouseMoveSampleCount),
    mousePathLengthPx: optionalNumber(signal.MousePathLengthPx),
    mouseSpeedMeanPxPerSec: optionalNumber(signal.MouseSpeedMeanPxPerSec),
    mouseJerkP95: optionalNumber(signal.MouseJerkP95),
    mouseMicroCorrectionCount: optionalNumber(signal.MouseMicroCorrectionCount),
    mouseMicroCorrectionRate: optionalNumber(signal.MouseMicroCorrectionRate),
    mouseScrollBurstCount: optionalNumber(signal.MouseScrollBurstCount),
    mouseScrollBurstRate: optionalNumber(signal.MouseScrollBurstRate),
    mouseScrollSpeedMean: optionalNumber(signal.MouseScrollSpeedMean),
    focusObservationCount: optionalNumber(signal.FocusObservationCount),
    focusSwitchCount: optionalNumber(signal.FocusSwitchCount),
    focusActiveAppCount: optionalNumber(signal.FocusActiveAppCount),
    focusAppEntropy: optionalNumber(signal.FocusAppEntropy),
    focusAppHash: optionalString(signal.FocusAppHash),
    idleSeconds: optionalNumber(signal.IdleSeconds),
    idleObservationCount: optionalNumber(signal.IdleObservationCount),
    idleSecondsWithinWindow: optionalNumber(signal.IdleSecondsWithinWindow),
    microIdleCount: optionalNumber(signal.MicroIdleCount),
    microIdleSeconds: optionalNumber(signal.MicroIdleSeconds),
    trueBreakSeconds: optionalNumber(signal.TrueBreakSeconds),
    trueBreakFlag: optionalBoolean(signal.TrueBreakFlag),
    shortIdleBoundaryObserved: optionalBoolean(signal.ShortIdleBoundaryObserved),
    notificationToastsEnabled: optionalBoolean(signal.NotificationToastsEnabled),
    qualityScore: optionalNumber(signal.QualityScore),
    partial: optionalBoolean(signal.Partial),
    contributorsJson: optionalString(signal.ContributorsJson),
  };
};

const normalizeSnapshot = (payload: unknown): AriSnapshotSample => {
  const snapshot = payload as Record<string, unknown>;
  return {
    tSec: Number(snapshot.TSec ?? 0),
    sourceCaptureId: String(snapshot.SourceCaptureId ?? ""),
    sourceTimestampUtc: String(snapshot.SourceTimestampUtc ?? ""),
    focusStrength: Number(snapshot.FocusStrength ?? 0),
    overloadLikelihood: Number(snapshot.OverloadLikelihood ?? 0),
    fatigueProbability: Number(snapshot.FatigueProbability ?? 0),
    cognitiveStability: Number(snapshot.CognitiveStability ?? 0),
    dominantStateValue: Number(snapshot.DominantStateValue ?? 0),
    dominantStateName: String(snapshot.DominantStateName ?? "focus"),
    confidence: Number(snapshot.Confidence ?? 0),
    lastAction: String(snapshot.LastAction ?? ""),
    activationWindowTriggered: Boolean(snapshot.ActivationWindowTriggered),
    cooldownTriggered: Boolean(snapshot.CooldownTriggered),
    activationWindowOpen: Boolean(snapshot.ActivationWindowOpen),
    sustainedAttentionDurationSec: Number(snapshot.SustainedAttentionDurationSec ?? 0),
    idleFragmentationIndex: Number(snapshot.IdleFragmentationIndex ?? 0),
    overloadActive: Boolean(snapshot.OverloadActive),
    stateFlagsJson: String(snapshot.StateFlagsJson ?? "{}"),
    contributors: ((snapshot.Contributors as unknown[]) ?? []).map(String),
  };
};

const normalizeEvent = (payload: unknown): AriEventSample => {
  const event = payload as Record<string, unknown>;
  return {
    tSec: Number(event.TSec ?? 0),
    sourceCaptureId: String(event.SourceCaptureId ?? ""),
    sourceTimestampUtc: String(event.SourceTimestampUtc ?? ""),
    action: String(event.Action ?? ""),
    triggerState: String(event.TriggerState ?? ""),
    triggerValue: Number(event.TriggerValue ?? 0),
    confidence: Number(event.Confidence ?? 0),
    durationSeconds: optionalNumber(event.DurationSeconds),
    escalationLevel: String(event.EscalationLevel ?? ""),
    reversible: Boolean(event.Reversible),
    reason: String(event.Reason ?? ""),
    contributors: ((event.Contributors as unknown[]) ?? []).map(String),
    interventionId: String(event.InterventionId ?? ""),
    policyId: String(event.PolicyId ?? ""),
    domain: String(event.Domain ?? ""),
    whatChanged: String(event.WhatChanged ?? ""),
    howToUndo: String(event.HowToUndo ?? ""),
    lifecycleState: String(event.LifecycleState ?? ""),
    commandType: String(event.CommandType ?? ""),
    executionState: String(event.ExecutionState ?? ""),
    whyJson: String(event.WhyJson ?? "{}"),
    stateFlagsJson: String(event.StateFlagsJson ?? "{}"),
  };
};

const normalizeChapter = (payload: unknown): AriChapter => {
  const chapter = payload as Record<string, unknown>;
  return {
    chapterId: String(chapter.ChapterId ?? ""),
    title: String(chapter.Title ?? ""),
    role: String(chapter.Role ?? ""),
    startSec: Number(chapter.StartSec ?? 0),
    endSec: Number(chapter.EndSec ?? 0),
    sourceCaptureId: String(chapter.SourceCaptureId ?? ""),
    sourceFromUtc: String(chapter.SourceFromUtc ?? ""),
    sourceToUtc: String(chapter.SourceToUtc ?? ""),
    purpose: String(chapter.Purpose ?? ""),
    dataFocus: String(chapter.DataFocus ?? ""),
  };
};

const normalizeBeatMap = (payload: unknown): AriVideoBeatMap => {
  const beatMap = payload as Record<string, unknown>;
  return {
    schema: String(beatMap.schema ?? ""),
    traceId: String(beatMap.trace_id ?? ""),
    generatedAtUtc: String(beatMap.generated_at_utc ?? ""),
    beats: ((beatMap.beats as unknown[]) ?? []).map((beat) => {
      const rawBeat = beat as Record<string, unknown>;
      return {
        beatId: String(rawBeat.BeatId ?? ""),
        chapterId: String(rawBeat.ChapterId ?? ""),
        startSec: Number(rawBeat.StartSec ?? 0),
        endSec: Number(rawBeat.EndSec ?? 0),
        title: String(rawBeat.Title ?? ""),
        purpose: String(rawBeat.Purpose ?? ""),
        dataFocus: String(rawBeat.DataFocus ?? ""),
        sourceCaptureId: String(rawBeat.SourceCaptureId ?? ""),
        sourceFromUtc: String(rawBeat.SourceFromUtc ?? ""),
        sourceToUtc: String(rawBeat.SourceToUtc ?? ""),
      };
    }) as AriBeat[],
  };
};

const normalizeSummary = (payload: unknown): AriVideoSummary | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const summary = payload as Record<string, unknown>;
  const selectedEvent = (summary.selected_event ?? {}) as Record<string, unknown>;
  return {
    traceId: String(summary.trace_id ?? ""),
    label: String(summary.label ?? ""),
    curationMode: String(summary.curation_mode ?? ""),
    durationSec: Number(summary.duration_sec ?? 0),
    selectedCapture: String(summary.selected_capture ?? ""),
    selectedEvent: {
      action: String(selectedEvent.action ?? ""),
      timestampUtc: String(selectedEvent.timestamp_utc ?? ""),
      confidence: Number(selectedEvent.confidence ?? 0),
      triggerState: String(selectedEvent.trigger_state ?? ""),
      triggerValue: Number(selectedEvent.trigger_value ?? 0),
    },
  };
};

const normalizeVoiceover = (payload: unknown): AriVoiceoverManifest | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const manifest = payload as Record<string, unknown>;
  return {
    schema: String(manifest.schema ?? ""),
    voiceName: String(manifest.voiceName ?? ""),
    segments: ((manifest.segments as unknown[]) ?? []).map((segment) => {
      const rawSegment = segment as Record<string, unknown>;
      return {
        segmentId: String(rawSegment.segmentId ?? ""),
        startSec: Number(rawSegment.startSec ?? 0),
        rate: Number(rawSegment.rate ?? 0),
        volume: Number(rawSegment.volume ?? 1),
        text: String(rawSegment.text ?? ""),
      };
    }),
  };
};

const optionalString = (value: unknown) => {
  return typeof value === "string" && value.trim() ? value : null;
};

const optionalNumber = (value: unknown) => {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
};

const optionalBoolean = (value: unknown) => {
  return typeof value === "boolean" ? value : null;
};
