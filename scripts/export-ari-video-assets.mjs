import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const projectRoot = process.cwd();
const syncScriptPath = path.join(projectRoot, "scripts", "sync-ari-video-assets.mjs");
const remotionCliPath = path.join(projectRoot, "node_modules", "@remotion", "cli", "remotion-cli.js");
const tracePath = path.join(projectRoot, "public", "ari-video", "ari-video-trace.json");
const exportPublicDir = path.join(projectRoot, "public", "ari-video", "exports");
const outputDir = path.join(projectRoot, "out", "ari-video");
const masterDir = path.join(outputDir, "master");
const compositionId = "AriRecordedStory";

const args = process.argv.slice(2);
const traceDir = readOption(args, "--trace-dir");
const skipSync = hasFlag(args, "--skip-sync");
const skipMaster = hasFlag(args, "--skip-master");
const skipWebm = hasFlag(args, "--skip-webm");
const skipHomepageCut = hasFlag(args, "--skip-homepage-cut");

await main();

async function main() {
  if (!skipSync) {
    const syncArgs = [syncScriptPath];
    if (traceDir) {
      syncArgs.push("--trace-dir", traceDir);
    }

    await run(process.execPath, syncArgs, "Syncing curated Ari trace into porta-website");
  }

  if (!fs.existsSync(tracePath)) {
    throw new Error(`Trace file was not found: ${tracePath}`);
  }

  const trace = JSON.parse(fs.readFileSync(tracePath, "utf8"));
  const meta = trace?.Meta ?? {};
  const fps = Number.isFinite(meta.FrameRate) ? meta.FrameRate : 30;
  const durationSec = Number.isFinite(meta.DurationSec) ? meta.DurationSec : 45;
  const durationInFrames = Math.max(1, Math.round(durationSec * fps));
  const anchorEvent = selectAnchorEvent(trace?.Events);
  const posterFrame = clamp(
    anchorEvent ? Math.round(anchorEvent.TSec * fps) : Math.round(durationInFrames * 0.62),
    0,
    durationInFrames - 1
  );
  const homepageDurationSec = Math.min(30, durationSec);
  const homepageEndFrame = clamp(Math.round(homepageDurationSec * fps) - 1, 0, durationInFrames - 1);

  const assets = {
    generatedAtUtc: new Date().toISOString(),
    compositionId,
    traceLabel: typeof meta.Label === "string" ? meta.Label : "Ari Recorded Story",
    traceId: typeof meta.TraceId === "string" ? meta.TraceId : null,
    fps,
    durationSec,
    posterFrame,
    master: {
      path: path.join(masterDir, "ari-recorded-story-master.mp4"),
      relativePath: path.relative(projectRoot, path.join(masterDir, "ari-recorded-story-master.mp4")).replaceAll("\\", "/"),
      width: 3840,
      height: 2160,
      codec: "h264",
      videoBitrate: "35M",
      maxRate: "42M",
      bufferSize: "84M",
    },
    webMp4: {
      path: path.join(exportPublicDir, "ari-recorded-story-web.mp4"),
      publicPath: "/ari-video/exports/ari-recorded-story-web.mp4",
      width: 1920,
      height: 1080,
      codec: "h264",
      scale: 0.5,
      crf: 20,
    },
    webWebm: {
      path: path.join(exportPublicDir, "ari-recorded-story-web.webm"),
      publicPath: "/ari-video/exports/ari-recorded-story-web.webm",
      width: 1920,
      height: 1080,
      codec: "vp9",
      scale: 0.5,
      crf: 33,
      skipped: skipWebm,
    },
    poster: {
      path: path.join(exportPublicDir, "ari-recorded-story-poster.png"),
      publicPath: "/ari-video/exports/ari-recorded-story-poster.png",
      frame: posterFrame,
    },
    homepageCut: {
      path: path.join(exportPublicDir, "ari-recorded-story-homepage.mp4"),
      publicPath: "/ari-video/exports/ari-recorded-story-homepage.mp4",
      width: 1920,
      height: 1080,
      codec: "h264",
      scale: 0.5,
      crf: 18,
      durationSec: homepageDurationSec,
      frames: `0-${homepageEndFrame}`,
      skipped: skipHomepageCut,
    },
  };

  fs.mkdirSync(exportPublicDir, { recursive: true });
  fs.mkdirSync(masterDir, { recursive: true });

  const outputsToReset = [
    !skipMaster ? assets.master.path : null,
    assets.webMp4.path,
    !skipWebm ? assets.webWebm.path : null,
    assets.poster.path,
    !skipHomepageCut ? assets.homepageCut.path : null,
    path.join(exportPublicDir, "asset-manifest.json"),
  ].filter(Boolean);

  for (const outputPath of outputsToReset) {
    removeIfExists(outputPath);
  }

  if (!skipMaster) {
    await renderVideo("Rendering 4K master export", assets.master.path, [
      "--codec=h264",
      "--video-bitrate=35M",
      "--max-rate=42M",
      "--buffer-size=84M",
      "--pixel-format=yuv420p",
      "--x264-preset=slow",
    ]);
  }

  await renderStill("Rendering poster frame", assets.poster.path, [
    "--frame",
    String(assets.poster.frame),
    "--image-format=png",
  ]);

  await renderVideo("Rendering website MP4 delivery", assets.webMp4.path, [
    "--codec=h264",
    "--scale=0.5",
    "--crf=20",
    "--pixel-format=yuv420p",
    "--x264-preset=slow",
  ]);

  if (!skipWebm) {
    await renderVideo("Rendering website WebM delivery", assets.webWebm.path, [
      "--codec=vp9",
      "--scale=0.5",
      "--crf=33",
      "--pixel-format=yuv420p",
    ]);
  }

  if (!skipHomepageCut) {
    await renderVideo("Rendering homepage cut", assets.homepageCut.path, [
      "--codec=h264",
      "--scale=0.5",
      "--crf=18",
      "--pixel-format=yuv420p",
      "--x264-preset=slow",
      "--frames",
      assets.homepageCut.frames,
    ]);
  }

  assets.master.sizeBytes = readFileSize(assets.master.path);
  assets.webMp4.sizeBytes = readFileSize(assets.webMp4.path);
  assets.poster.sizeBytes = readFileSize(assets.poster.path);
  assets.webWebm.sizeBytes = skipWebm ? null : readFileSize(assets.webWebm.path);
  assets.homepageCut.sizeBytes = skipHomepageCut ? null : readFileSize(assets.homepageCut.path);

  fs.writeFileSync(
    path.join(exportPublicDir, "asset-manifest.json"),
    JSON.stringify(
      {
        schema: "porta.ari.exported-video.v1",
        ...assets,
      },
      null,
      2
    )
  );

  console.log("");
  console.log("Export complete.");
  console.log(`Master: ${assets.master.path}`);
  console.log(`Website MP4: ${assets.webMp4.path}`);
  console.log(`Website WebM: ${assets.webWebm.path}`);
  console.log(`Poster: ${assets.poster.path}`);
  console.log(`Homepage cut: ${assets.homepageCut.path}`);
}

async function renderVideo(label, outputPath, flags) {
  await run(process.execPath, [
    remotionCliPath,
    "render",
    "remotion/index.ts",
    compositionId,
    outputPath,
    ...flags,
  ], label);

  ensureFileExists(outputPath, label);
}

async function renderStill(label, outputPath, flags) {
  await run(process.execPath, [
    remotionCliPath,
    "still",
    "remotion/index.ts",
    compositionId,
    outputPath,
    ...flags,
  ], label);

  ensureFileExists(outputPath, label);
}

function removeIfExists(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { force: true });
  }
}

function ensureFileExists(targetPath, label) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`${label} completed but output file was not created: ${targetPath}`);
  }
}

function readFileSize(targetPath) {
  return fs.existsSync(targetPath) ? fs.statSync(targetPath).size : null;
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

  return path.resolve(next);
}

function hasFlag(rawArgs, flag) {
  return rawArgs.includes(flag);
}

function selectAnchorEvent(events) {
  if (!Array.isArray(events) || events.length === 0) {
    return null;
  }

  return [...events]
    .sort((left, right) => {
      const confidenceDelta = (right?.Confidence ?? 0) - (left?.Confidence ?? 0);
      if (confidenceDelta !== 0) {
        return confidenceDelta;
      }

      return (left?.TSec ?? 0) - (right?.TSec ?? 0);
    })[0] ?? null;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function run(command, commandArgs, label) {
  return new Promise((resolve, reject) => {
    console.log("");
    console.log(label);

    const child = spawn(command, commandArgs, {
      cwd: projectRoot,
      stdio: "inherit",
      windowsHide: true,
      env: {
        ...process.env,
        CI: "1",
        FORCE_COLOR: "0",
      },
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${label} failed with exit code ${code ?? "unknown"}`));
    });

    child.on("error", reject);
  });
}
