import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { videoTokens as t } from "../theme/tokens";
import "../theme/loadFonts";

// ─── Scene boundaries (frames @ 30fps) ────────────────────────────────────
const S = {
  widget:  { start: 0,   end: 150 }, // 0–5s
  today:   { start: 140, end: 300 }, // 4.7–10s  (10f overlap fade)
  history: { start: 290, end: 600 }, // 9.7–20s
  digest:  { start: 590, end: 750 }, // 19.7–25s
  toast:   { start: 740, end: 900 }, // 24.7–30s
};
const FADE = 12;

function easeInOut(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function rangeProgress(frame: number, start: number, end: number): number {
  return easeInOut(
    Math.max(0, Math.min(1, (frame - start) / Math.max(end - start, 1)))
  );
}

function sceneFade(frame: number, scene: { start: number; end: number }): number {
  const fadeIn  = interpolate(frame, [scene.start, scene.start + FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [scene.end - FADE, scene.end],     [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.min(fadeIn, fadeOut);
}

// ─── Shared desktop backdrop ───────────────────────────────────────────────
function DesktopBackdrop() {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse at 30% 40%, rgba(0,255,200,0.04) 0%, transparent 55%), radial-gradient(ellipse at 75% 70%, rgba(127,110,255,0.03) 0%, transparent 50%), #090d11",
    }} />
  );
}

// ─── SCENE 1 — Widget ──────────────────────────────────────────────────────
function WidgetScene({ frame, width, height, fps }: SceneProps) {
  const opacity = sceneFade(frame, S.widget);
  if (opacity <= 0) return null;

  const localF = frame - S.widget.start;

  // Phase 1 (0-30f): widget sits at corner, small
  // Phase 2 (30-110f): zoom in toward center — spring
  // Phase 3 (110-140f): hold, slight zoom back
  const zoomProgress = spring({ frame: localF - 30, fps, config: { damping: 28, stiffness: 60, mass: 1 }, durationInFrames: 80 });
  const zoomOutProgress = rangeProgress(localF, 110, 140);

  const cornerX = width - 340;
  const cornerY = height - 260;
  const centerX = width / 2 - 320;
  const centerY = height / 2 - 200;

  const imgX = cornerX + (centerX - cornerX) * zoomProgress;
  const imgY = cornerY + (centerY - cornerY) * zoomProgress;
  const scaleIn  = 0.55 + 0.5 * zoomProgress;
  const scaleOut = scaleIn - 0.06 * zoomOutProgress;
  const finalScale = scaleOut;

  return (
    <AbsoluteFill style={{ opacity }}>
      <DesktopBackdrop />
      {/* Subtle taskbar hint */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 48,
        background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(255,255,255,0.05)",
      }} />
      {/* Widget image */}
      <div style={{
        position: "absolute",
        left: imgX, top: imgY,
        transform: `scale(${finalScale})`,
        transformOrigin: "top left",
        filter: "drop-shadow(0 24px 60px rgba(0,0,0,0.6))",
      }}>
        <Img
          src={staticFile("images/widget.png")}
          style={{ width: 640, height: "auto", borderRadius: 24 }}
        />
      </div>
      {/* Ambient glow under widget */}
      <div style={{
        position: "absolute",
        left: imgX + 80, top: imgY + 120,
        width: 400 * finalScale, height: 200 * finalScale,
        background: "radial-gradient(ellipse, rgba(0,255,200,0.12), transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none",
        transform: `scale(${finalScale})`, transformOrigin: "top left",
      }} />
    </AbsoluteFill>
  );
}

// ─── SCENE 2 — Today (Control Center) ─────────────────────────────────────
function TodayScene({ frame, width, height, fps }: SceneProps) {
  const opacity = sceneFade(frame, S.today);
  if (opacity <= 0) return null;

  const localF = frame - S.today.start;

  const openProgress = spring({ frame: localF, fps, config: { damping: 22, stiffness: 50 }, durationInFrames: 60 });
  const zoomIn = spring({ frame: localF - 60, fps, config: { damping: 30, stiffness: 40 }, durationInFrames: 80 });

  const panelW = 860;
  const panelH = 540;
  const panelX = (width - panelW) / 2;
  const panelY = (height - panelH) / 2;

  const scaleVal = 0.88 + 0.12 * openProgress + 0.06 * zoomIn;

  return (
    <AbsoluteFill style={{ opacity }}>
      <DesktopBackdrop />
      {/* Glow behind panel */}
      <div style={{
        position: "absolute",
        left: panelX - 80, top: panelY - 60,
        width: panelW + 160, height: panelH + 120,
        background: "radial-gradient(ellipse at 50% 40%, rgba(0,255,200,0.08), transparent 65%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />
      {/* App window */}
      <div style={{
        position: "absolute",
        left: panelX, top: panelY,
        width: panelW, height: panelH,
        transform: `scale(${scaleVal}) translateY(${(1 - openProgress) * 30}px)`,
        transformOrigin: "center center",
        borderRadius: 20,
        background: "rgba(10,14,20,0.96)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 48px 120px rgba(0,0,0,0.7)",
        overflow: "hidden",
      }}>
        {/* Title bar */}
        <div style={{
          height: 42, display: "flex", alignItems: "center", padding: "0 16px", gap: 7,
          background: "rgba(255,255,255,0.025)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          {[t.color.coral, "#febc2e", t.color.accentDeep].map((col, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: col }} />
          ))}
          <span style={{
            marginLeft: "auto", color: t.color.softInk,
            fontFamily: t.font.sans, fontSize: 13, fontWeight: 600, letterSpacing: "0.02em",
          }}>Ari</span>
          <div style={{ width: 28 }} />
        </div>

        {/* Sidebar + main */}
        <div style={{ display: "flex", height: "calc(100% - 42px)" }}>
          {/* Sidebar */}
          <div style={{
            width: 180, padding: "20px 12px",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ marginBottom: 6, padding: "0 8px 10px", color: t.color.softInk, fontFamily: t.font.sans, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>Ari</div>
            <NavItem label="Today" active />
            <NavItem label="History" active={false} />
          </div>

          {/* Today content */}
          <div style={{ flex: 1, padding: 28, overflowY: "hidden" }}>
            <div style={{ fontFamily: t.font.sans, color: t.color.softInk, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>TODAY</div>
            <div style={{ fontFamily: t.font.sans, color: t.color.mutedInk, fontSize: 13, marginBottom: 20 }}>Thu 28 May</div>

            {/* Stat cards row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <StatCard label="FOCUS TIME" value="2h 14m" sub="Deep work detected" barPct={74} barColor={t.color.accentDeep} />
              <StatCard label="PRESSURE" value="51%" sub="Moderate" barPct={51} barColor={t.color.coral} />
              <StatCard label="WORK TIME" value="3h 46m" sub="Active session" barPct={88} barColor={t.color.cyan} />
            </div>

            {/* Status row */}
            <div style={{
              marginTop: 18, padding: "12px 16px",
              background: "rgba(127,232,255,0.06)",
              border: "1px solid rgba(127,232,255,0.14)",
              borderRadius: 14, display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color.cyan }} />
              <span style={{ fontFamily: t.font.sans, color: t.color.cyan, fontSize: 13, fontWeight: 600 }}>
                Deep work — notifications suppressed
              </span>
              <span style={{ marginLeft: "auto", fontFamily: t.font.mono, color: t.color.softInk, fontSize: 11 }}>93% confidence</span>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function NavItem({ label, active }: { label: string; active: boolean }) {
  return (
    <div style={{
      padding: "8px 10px", borderRadius: 10, marginBottom: 2,
      background: active ? "rgba(127,232,255,0.08)" : "transparent",
      color: active ? t.color.cyan : t.color.mutedInk,
      fontFamily: t.font.sans, fontSize: 13, fontWeight: active ? 600 : 400,
      cursor: "default",
    }}>
      {label}
    </div>
  );
}

function StatCard({ label, value, sub, barPct, barColor }: { label: string; value: string; sub: string; barPct: number; barColor: string }) {
  return (
    <div style={{
      padding: "16px 16px 14px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
    }}>
      <div style={{ fontFamily: t.font.sans, color: t.color.softInk, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: t.font.sans, color: t.color.ink, fontSize: 24, fontWeight: 700, lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 999, marginBottom: 8 }}>
        <div style={{ height: "100%", width: `${barPct}%`, background: barColor, borderRadius: 999 }} />
      </div>
      <div style={{ fontFamily: t.font.sans, color: t.color.softInk, fontSize: 11 }}>{sub}</div>
    </div>
  );
}

// ─── SCENE 3 — History Calendar ────────────────────────────────────────────
function HistoryScene({ frame, width, height }: SceneProps) {
  const opacity = sceneFade(frame, S.history);
  if (opacity <= 0) return null;

  const localF = frame - S.history.start;

  // Phase 1 (0-100f): start zoomed out, scroll down
  // Phase 2 (100-180f): zoom in on block cluster
  // Phase 3 (180-240f): hold on blocks
  // Phase 4 (240-280f): zoom back out
  // Phase 5 (280-300f): fade out

  const scrollProgress = rangeProgress(localF, 20, 160);
  const zoomInProgress = rangeProgress(localF, 100, 180);
  const zoomOutProgress = rangeProgress(localF, 220, 280);

  const imgW = width * 1.05;
  const translateY = -scrollProgress * height * 0.18;
  const zoomScale = 1.0 + 0.28 * zoomInProgress - 0.22 * zoomOutProgress;
  const zoomTranslateY = -zoomInProgress * height * 0.08 + zoomOutProgress * height * 0.08;

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <DesktopBackdrop />
      {/* History image with scroll + zoom */}
      <div style={{
        position: "absolute",
        left: (width - imgW) / 2,
        top: 0,
        width: imgW,
        transform: `translateY(${translateY + zoomTranslateY}px) scale(${zoomScale})`,
        transformOrigin: "50% 40%",
      }}>
        <Img
          src={staticFile("images/history.png")}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
      {/* Vignette top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 80,
        background: "linear-gradient(to bottom, #090d11, transparent)",
        pointerEvents: "none",
      }} />
      {/* Vignette bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
        background: "linear-gradient(to top, #090d11, transparent)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
}

// ─── SCENE 4 — Digest Email ────────────────────────────────────────────────
function DigestScene({ frame, width, fps }: SceneProps) {
  const opacity = sceneFade(frame, S.digest);
  if (opacity <= 0) return null;

  const localF = frame - S.digest.start;

  const slideIn = spring({ frame: localF, fps, config: { damping: 24, stiffness: 55 }, durationInFrames: 50 });
  const zoomIn  = spring({ frame: localF - 50, fps, config: { damping: 30, stiffness: 40 }, durationInFrames: 60 });

  const imgW = 480;
  const imgLeft = (width - imgW) / 2;
  const slideOffset = (1 - slideIn) * 80;
  const scale = 1.0 + 0.12 * zoomIn;

  return (
    <AbsoluteFill style={{ opacity }}>
      <DesktopBackdrop />
      {/* Ambient glow */}
      <div style={{
        position: "absolute", left: imgLeft - 100, top: "20%",
        width: imgW + 200, height: 400,
        background: "radial-gradient(ellipse, rgba(138,120,255,0.09), transparent 65%)",
        filter: "blur(50px)", pointerEvents: "none",
      }} />
      {/* Email window */}
      <div style={{
        position: "absolute",
        left: imgLeft, top: "6%",
        width: imgW,
        transform: `translateY(${slideOffset}px) scale(${scale})`,
        transformOrigin: "50% 30%",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 48px 120px rgba(0,0,0,0.65)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}>
        {/* Titlebar */}
        <div style={{
          height: 38, display: "flex", alignItems: "center", padding: "0 14px", gap: 7,
          background: "rgba(10,14,20,0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          {[t.color.coral, "#febc2e", t.color.accentDeep].map((col, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: col }} />
          ))}
        </div>
        <Img
          src={staticFile("images/digest.png")}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    </AbsoluteFill>
  );
}

// ─── SCENE 5 — Toast notification ─────────────────────────────────────────
function ToastScene({ frame, width, height, fps }: SceneProps) {
  const opacity = sceneFade(frame, S.toast);
  if (opacity <= 0) return null;

  const localF = frame - S.toast.start;

  // Toast appears at 30f, fades at 120f
  const toastIn   = spring({ frame: localF - 30, fps, config: { damping: 20, stiffness: 60 }, durationInFrames: 40 });
  const toastOut  = rangeProgress(localF, 120, 150);
  const zoomIn    = spring({ frame: localF - 50, fps, config: { damping: 28, stiffness: 42 }, durationInFrames: 60 });
  const zoomBack  = rangeProgress(localF, 140, 160);

  const toastOpacity = Math.max(0, Math.min(1, toastIn) * (1 - toastOut));
  const toastSlide   = (1 - toastIn) * 48;

  const scale    = 1.0 + 0.22 * zoomIn - 0.12 * zoomBack;
  const toastX   = width - 380;
  const toastY   = height - 160;

  return (
    <AbsoluteFill style={{ opacity }}>
      <DesktopBackdrop />
      {/* Widget still in corner */}
      <div style={{
        position: "absolute",
        right: 32, bottom: 60,
        opacity: 0.85,
        filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.5))",
      }}>
        <Img
          src={staticFile("images/widget.png")}
          style={{ width: 240, height: "auto", borderRadius: 16 }}
        />
      </div>

      {/* Toast */}
      <div style={{
        position: "absolute",
        left: toastX,
        top: toastY + toastSlide,
        opacity: toastOpacity,
        transform: `scale(${scale})`,
        transformOrigin: "right bottom",
        width: 320,
        padding: "14px 18px",
        background: "rgba(10,14,20,0.96)",
        border: "1px solid rgba(127,232,255,0.24)",
        borderRadius: 18,
        boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(127,232,255,0.08)",
        backdropFilter: "blur(14px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color.cyan, flexShrink: 0 }} />
          <span style={{ fontFamily: t.font.sans, color: t.color.cyan, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Deep Work
          </span>
        </div>
        <div style={{ fontFamily: t.font.sans, color: t.color.ink, fontSize: 14, fontWeight: 600, lineHeight: 1.4, marginBottom: 4 }}>
          Notifications suppressed
        </div>
        <div style={{ fontFamily: t.font.sans, color: t.color.mutedInk, fontSize: 12, lineHeight: 1.4 }}>
          Focus locked in · 93% confidence
        </div>
        {/* Confidence bar */}
        <div style={{ marginTop: 10, height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 999 }}>
          <div style={{ width: "93%", height: "100%", background: t.color.cyan, borderRadius: 999 }} />
        </div>
      </div>

      {/* Taskbar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 48,
        background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(255,255,255,0.05)",
      }} />
    </AbsoluteFill>
  );
}

// ─── Types + export ─────────────────────────────────────────────────────────
type SceneProps = { frame: number; width: number; height: number; fps: number };

export function ProductDemoComposition() {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const props: SceneProps = { frame, width, height, fps };

  return (
    <AbsoluteFill style={{ background: "#090d11", overflow: "hidden" }}>
      <WidgetScene   {...props} />
      <TodayScene    {...props} />
      <HistoryScene  {...props} />
      <DigestScene   {...props} />
      <ToastScene    {...props} />
    </AbsoluteFill>
  );
}
