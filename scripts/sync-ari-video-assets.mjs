import fs from "node:fs";
import path from "node:path";

const programData = process.env.ProgramData ?? "C:\\ProgramData";
const defaultTraceRoot = path.join(programData, "PortaAgent", "video-traces");
const publicTargetDir = path.join(process.cwd(), "public", "ari-video");
const manifestPath = path.join(process.cwd(), "src", "ari-video", "data", "traceManifest.ts");

const args = process.argv.slice(2);
const traceDir = resolveTraceDir(args);

const tracePath = path.join(traceDir, "ari-video-trace.json");
const beatMapPath = path.join(traceDir, "ari-video-beat-map.json");
const summaryPath = path.join(traceDir, "curation-summary.json");

for (const filePath of [tracePath, beatMapPath, summaryPath]) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required file was not found: ${filePath}`);
  }
}

fs.mkdirSync(publicTargetDir, { recursive: true });
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });

fs.copyFileSync(tracePath, path.join(publicTargetDir, "ari-video-trace.json"));
fs.copyFileSync(beatMapPath, path.join(publicTargetDir, "ari-video-beat-map.json"));
fs.copyFileSync(summaryPath, path.join(publicTargetDir, "curation-summary.json"));

const trace = JSON.parse(fs.readFileSync(tracePath, "utf8"));
const meta = trace?.Meta ?? {};
const fps = Number.isFinite(meta.FrameRate) ? meta.FrameRate : 30;
const durationSec = Number.isFinite(meta.DurationSec) ? meta.DurationSec : 45;
const durationInFrames = Math.max(1, Math.round(durationSec * fps));
const label = typeof meta.Label === "string" && meta.Label.trim() ? meta.Label.trim() : "Ari Recorded Story";

const manifestSource = `export const ARI_VIDEO_TRACE_MANIFEST = {
  compositionId: "AriRecordedStory",
  label: ${JSON.stringify(label)},
  fps: ${fps},
  durationSec: ${durationSec},
  durationInFrames: ${durationInFrames},
  width: 3840,
  height: 2160,
  tracePublicPath: "/ari-video/ari-video-trace.json",
  beatMapPublicPath: "/ari-video/ari-video-beat-map.json",
  summaryPublicPath: "/ari-video/curation-summary.json",
} as const;
`;

fs.writeFileSync(manifestPath, manifestSource);

console.log(`Synced Ari video assets from ${traceDir}`);
console.log(`Trace label: ${label}`);
console.log(`Duration: ${durationSec}s @ ${fps}fps (${durationInFrames} frames)`);

function resolveTraceDir(rawArgs) {
  const explicit = readOption(rawArgs, "--trace-dir");
  if (explicit) {
    const fullPath = path.resolve(explicit);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Trace directory was not found: ${fullPath}`);
    }

    return fullPath;
  }

  if (!fs.existsSync(defaultTraceRoot)) {
    throw new Error(`Trace root was not found: ${defaultTraceRoot}`);
  }

  const candidates = fs
    .readdirSync(defaultTraceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("trace-"))
    .map((entry) => {
      const directoryPath = path.join(defaultTraceRoot, entry.name);
      const stats = fs.statSync(directoryPath);
      return {
        directoryPath,
        modifiedMs: stats.mtimeMs,
      };
    })
    .sort((left, right) => right.modifiedMs - left.modifiedMs);

  if (candidates.length === 0) {
    throw new Error(`No trace-* directories were found under ${defaultTraceRoot}`);
  }

  return candidates[0].directoryPath;
}

function readOption(rawArgs, key) {
  const index = rawArgs.indexOf(key);
  if (index === -1) {
    return null;
  }

  const next = rawArgs[index + 1];
  if (!next) {
    throw new Error(`Missing value for ${key}`);
  }

  return next;
}
