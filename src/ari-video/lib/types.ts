export interface AriVideoManifest {
  compositionId: string;
  label: string;
  fps: number;
  durationSec: number;
  durationInFrames: number;
  width: number;
  height: number;
  tracePublicPath: string;
  beatMapPublicPath: string;
  summaryPublicPath: string;
  voiceoverPublicPath: string;
}

export interface AriVideoData {
  trace: AriVideoTrace;
  beatMap: AriVideoBeatMap;
  summary: AriVideoSummary | null;
  voiceover: AriVoiceoverManifest | null;
}

export interface AriVideoTrace {
  meta: AriVideoMeta;
  signals: AriSignalSample[];
  snapshots: AriSnapshotSample[];
  events: AriEventSample[];
  chapters: AriChapter[];
}

export interface AriVideoMeta {
  schema: string;
  traceId: string;
  label: string;
  createdAtUtc: string;
  frameRate: number;
  durationSec: number;
  curationMode: string;
  storyArc: string;
  sourceCaptures: AriSourceCapture[];
}

export interface AriSourceCapture {
  captureId: string;
  label: string;
  directoryPath: string;
  observedFromUtc: string | null;
  observedToUtc: string | null;
  segments: AriSourceSegment[];
}

export interface AriSourceSegment {
  chapterId: string;
  sourceFromUtc: string;
  sourceToUtc: string;
  traceStartSec: number;
  traceEndSec: number;
  selectionReason: string;
  selectionScore: number;
}

export interface AriSignalSample {
  signalKind: string;
  tStartSec: number;
  tEndSec: number;
  sourceCaptureId: string;
  sourceStartUtc: string;
  sourceEndUtc: string;
  typingBurstIntensity: number | null;
  scrollVelocityIndex: number | null;
  focusSwitchRate: number | null;
  keyboardKeydownCount: number | null;
  keyboardBackspaceCount: number | null;
  keyboardBackspaceRate: number | null;
  keyboardIkiMeanMs: number | null;
  keyboardIkiStdMs: number | null;
  keyboardIkiCv: number | null;
  keyboardBurstCount: number | null;
  keyboardBurstRate: number | null;
  keyboardCorrectionSpikeCount: number | null;
  keyboardCorrectionSpikeRate: number | null;
  mouseWheelDelta: number | null;
  mouseWheelEventCount: number | null;
  mouseMoveDx: number | null;
  mouseMoveDy: number | null;
  mouseMoveSampleCount: number | null;
  mousePathLengthPx: number | null;
  mouseSpeedMeanPxPerSec: number | null;
  mouseJerkP95: number | null;
  mouseMicroCorrectionCount: number | null;
  mouseMicroCorrectionRate: number | null;
  mouseScrollBurstCount: number | null;
  mouseScrollBurstRate: number | null;
  mouseScrollSpeedMean: number | null;
  focusObservationCount: number | null;
  focusSwitchCount: number | null;
  focusActiveAppCount: number | null;
  focusAppEntropy: number | null;
  focusAppHash: string | null;
  idleSeconds: number | null;
  idleObservationCount: number | null;
  idleSecondsWithinWindow: number | null;
  microIdleCount: number | null;
  microIdleSeconds: number | null;
  trueBreakSeconds: number | null;
  trueBreakFlag: boolean | null;
  shortIdleBoundaryObserved: boolean | null;
  notificationToastsEnabled: boolean | null;
  qualityScore: number | null;
  partial: boolean | null;
  contributorsJson: string | null;
}

export interface AriSnapshotSample {
  tSec: number;
  sourceCaptureId: string;
  sourceTimestampUtc: string;
  focusStrength: number;
  overloadLikelihood: number;
  fatigueProbability: number;
  cognitiveStability: number;
  dominantStateValue: number;
  dominantStateName: string;
  confidence: number;
  lastAction: string;
  activationWindowTriggered: boolean;
  cooldownTriggered: boolean;
  activationWindowOpen: boolean;
  sustainedAttentionDurationSec: number;
  idleFragmentationIndex: number;
  overloadActive: boolean;
  stateFlagsJson: string;
  contributors: string[];
}

export interface AriEventSample {
  tSec: number;
  sourceCaptureId: string;
  sourceTimestampUtc: string;
  action: string;
  triggerState: string;
  triggerValue: number;
  confidence: number;
  durationSeconds: number | null;
  escalationLevel: string;
  reversible: boolean;
  reason: string;
  contributors: string[];
  interventionId: string;
  policyId: string;
  domain: string;
  whatChanged: string;
  howToUndo: string;
  lifecycleState: string;
  commandType: string;
  executionState: string;
  whyJson: string;
  stateFlagsJson: string;
}

export interface AriChapter {
  chapterId: string;
  title: string;
  role: string;
  startSec: number;
  endSec: number;
  sourceCaptureId: string;
  sourceFromUtc: string;
  sourceToUtc: string;
  purpose: string;
  dataFocus: string;
}

export interface AriBeat {
  beatId: string;
  chapterId: string;
  startSec: number;
  endSec: number;
  title: string;
  purpose: string;
  dataFocus: string;
  sourceCaptureId: string;
  sourceFromUtc: string;
  sourceToUtc: string;
}

export interface AriVideoBeatMap {
  schema: string;
  traceId: string;
  generatedAtUtc: string;
  beats: AriBeat[];
}

export interface AriVideoSummary {
  traceId: string;
  label: string;
  curationMode: string;
  durationSec: number;
  selectedCapture: string;
  selectedEvent: {
    action: string;
    timestampUtc: string;
    confidence: number;
    triggerState: string;
    triggerValue: number;
  };
}

export interface AriVoiceoverManifest {
  schema: string;
  voiceName: string;
  segments: AriVoiceoverSegment[];
}

export interface AriVoiceoverSegment {
  segmentId: string;
  startSec: number;
  rate: number;
  volume: number;
  text: string;
}
