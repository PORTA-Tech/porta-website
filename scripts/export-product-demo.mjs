import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const projectRoot = process.cwd();
const remotionCliPath = path.join(projectRoot, "node_modules", "@remotion", "cli", "remotion-cli.js");
const exportPublicDir = path.join(projectRoot, "public", "ari-video", "exports");
const compositionId = "AriProductDemo";

// Output paths — these are exactly what the site serves
const webMp4Path   = path.join(exportPublicDir, "ari-recorded-story-web.mp4");
const posterPath   = path.join(exportPublicDir, "ari-recorded-story-poster.png");

fs.mkdirSync(exportPublicDir, { recursive: true });

// Remove stale outputs
[webMp4Path, posterPath].forEach(p => { if (fs.existsSync(p)) fs.rmSync(p, { force: true }); });

// 1. Poster frame — frame 45 (widget zoomed in at ~1.5s)
await run("Rendering poster frame", [
  remotionCliPath, "still",
  "remotion/index.ts", compositionId, posterPath,
  "--frame", "45",
  "--image-format=png",
]);

// 2. Web MP4 — 1920x1080, h264, good quality
await run("Rendering web MP4 (this takes a few minutes)", [
  remotionCliPath, "render",
  "remotion/index.ts", compositionId, webMp4Path,
  "--codec=h264",
  "--crf=20",
  "--pixel-format=yuv420p",
  "--x264-preset=medium",
]);

console.log("\n✓ Done.");
console.log("  MP4:    " + webMp4Path);
console.log("  Poster: " + posterPath);
console.log("\nNow run:");
console.log("  git add public/ari-video/exports && git commit -m \"Render new product demo video\" && git push");

function run(label, args) {
  return new Promise((resolve, reject) => {
    console.log("\n→ " + label + "...");
    const child = spawn(process.execPath, args, {
      cwd: projectRoot, stdio: "inherit", windowsHide: true,
      env: { ...process.env, CI: "1", FORCE_COLOR: "0" },
    });
    child.on("exit", code => code === 0 ? resolve() : reject(new Error(label + " failed (exit " + code + ")")));
    child.on("error", reject);
  });
}
