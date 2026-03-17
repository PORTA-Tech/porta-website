import type {
  AriBeat,
  AriChapter,
  AriEventSample,
  AriSignalSample,
  AriSnapshotSample,
} from "./types";

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const mix = (from: number, to: number, progress: number) => {
  return from + ((to - from) * clamp01(progress));
};

export const rangeProgress = (value: number, start: number, end: number) => {
  if (end <= start) {
    return value >= end ? 1 : 0;
  }

  return clamp01((value - start) / (end - start));
};

export const humanizeToken = (value: string) => {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

export const formatPercent = (value: number, digits = 0) => `${(value * 100).toFixed(digits)}%`;

export const formatSeconds = (value: number) => `${value.toFixed(value >= 100 ? 0 : 1)}s`;

export const formatMs = (value: number) => `${Math.round(value)} ms`;

export const formatSigned = (value: number, digits = 1) => {
  const rounded = value.toFixed(digits);
  return value > 0 ? `+${rounded}` : rounded;
};

export const findActiveBeat = (beats: AriBeat[], timeSec: number) => {
  return beats.find((beat) => timeSec >= beat.startSec && timeSec < beat.endSec) ?? beats.at(-1) ?? null;
};

export const findActiveChapter = (chapters: AriChapter[], timeSec: number) => {
  return chapters.find((chapter) => timeSec >= chapter.startSec && timeSec < chapter.endSec) ?? chapters.at(-1) ?? null;
};

export const findNextEvent = (events: AriEventSample[], timeSec: number) => {
  return events.find((event) => event.tSec >= timeSec) ?? events.at(-1) ?? null;
};

export const findAnchorEvent = (events: AriEventSample[]) => {
  return events.reduce<AriEventSample | null>((best, current) => {
    if (!best) {
      return current;
    }

    return current.confidence >= best.confidence ? current : best;
  }, null);
};

export const getVisibleSignals = (signals: AriSignalSample[], timeSec: number) => {
  return signals.filter((signal) => signal.tEndSec <= timeSec + 1.5);
};

export const getCurrentSignal = (signals: AriSignalSample[], timeSec: number) => {
  return signals.find((signal) => timeSec >= signal.tStartSec && timeSec <= signal.tEndSec) ?? signals.at(-1) ?? null;
};

export const interpolateSnapshotMetric = (
  snapshots: AriSnapshotSample[],
  timeSec: number,
  pick: (sample: AriSnapshotSample) => number,
) => {
  if (snapshots.length === 0) {
    return 0;
  }

  if (timeSec <= snapshots[0].tSec) {
    return pick(snapshots[0]);
  }

  for (let index = 1; index < snapshots.length; index += 1) {
    const current = snapshots[index];
    if (timeSec <= current.tSec) {
      const previous = snapshots[index - 1];
      const progress = rangeProgress(timeSec, previous.tSec, current.tSec);
      return mix(pick(previous), pick(current), progress);
    }
  }

  return pick(snapshots[snapshots.length - 1]);
};

export const buildSignalSeries = (
  signals: AriSignalSample[],
  pick: (signal: AriSignalSample) => number | null,
) => {
  return signals.map((signal, index) => ({
    index,
    centerSec: (signal.tStartSec + signal.tEndSec) / 2,
    value: pick(signal) ?? 0,
  }));
};

export const buildSnapshotSeries = (
  snapshots: AriSnapshotSample[],
  pick: (snapshot: AriSnapshotSample) => number,
) => {
  return snapshots.map((snapshot) => ({
    tSec: snapshot.tSec,
    value: pick(snapshot),
  }));
};

export const measureSignalEnergy = (signal: AriSignalSample) => {
  const numericValues = [
    signal.typingBurstIntensity,
    signal.scrollVelocityIndex,
    signal.focusSwitchRate,
    signal.keyboardBurstRate,
    signal.mouseScrollSpeedMean ? signal.mouseScrollSpeedMean / 500 : null,
    signal.idleSecondsWithinWindow ? signal.idleSecondsWithinWindow / 5 : null,
  ].filter((value): value is number => typeof value === "number");

  if (numericValues.length === 0) {
    return 0;
  }

  return numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length;
};
