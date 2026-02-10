import { useState, useRef, useEffect } from "react";

type SceneProps = {
  onAdvance: () => void;
  isActive: boolean;
};

const signals = [
  "EEG",
  "Heart Rate",
  "Electrodermal Activity (EDA)",
  "Behavioral Signals",
  "Emotional Inference Engine",
];

const AUTO_ADVANCE_DELAY = 2500;
const MAX_TOTAL = 10000;

// Predefined positions avoiding the orb (center 50%/50%)
const positions = [
  { x: 20, y: 20 }, // EEG – top-left
  { x: 80, y: 20 }, // Heart Rate – top-right
  { x: 20, y: 70 }, // Behavioral Signals – bottom-left
  { x: 80, y: 70 }, // Emotional Inference Engine – bottom-right
  { x: 50, y: 80 }, // Emotional Inference Engine – bottom-center, avoids orb
];

export default function Scene1_Perception({ onAdvance, isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredSignals, setHoveredSignals] = useState<Set<string>>(new Set());
  const signalRefs = useRef<HTMLDivElement[]>([]);
  const bgRef = useRef<HTMLDivElement>(null);

  const startTimeRef = useRef<number>(0);
  const deadlineRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  // --- Background subtle gradient ---
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let id: number;
    const driftBG = () => {
      if (bgRef.current) {
        const hue = (frame % 360) / 360 * 10;
        bgRef.current.style.background = `linear-gradient(180deg, hsl(${hue},0%,0%), hsl(${hue},0%,7%))`;
      }
      frame++;
      id = requestAnimationFrame(driftBG);
    };
    driftBG();
    return () => cancelAnimationFrame(id);
  }, [isActive]);

  // --- Panels gentle movement ---
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let id: number;

    const drift = () => {
      signalRefs.current.forEach((el, idx) => {
        if (!el) return;
        const offsetX = Math.sin(frame / 50 + idx) * 15; // gentle horizontal float
        const offsetY = Math.cos(frame / 70 + idx) * 10; // gentle vertical float
        const scale = hovered === signals[idx] ? 1.1 : 1;
        el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      });
      frame++;
      id = requestAnimationFrame(drift);
    };

    drift();
    return () => cancelAnimationFrame(id);
  }, [isActive, hovered]);

  // --- Auto-advance logic ---
  useEffect(() => {
    if (!isActive) return;
    finishedRef.current = false;
    startTimeRef.current = Date.now();
    deadlineRef.current = hoveredSignals.size >= signals.length
      ? startTimeRef.current + AUTO_ADVANCE_DELAY
      : Infinity;

    const loop = () => {
      if (finishedRef.current) return;

      if (hoveredSignals.size >= signals.length && deadlineRef.current === Infinity) {
        deadlineRef.current = Date.now() + AUTO_ADVANCE_DELAY;
      }

      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      if (now >= deadlineRef.current || elapsed >= MAX_TOTAL) {
        finishedRef.current = true;
        onAdvance();
        return;
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);
    return () => {
      finishedRef.current = true;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isActive, hoveredSignals, onAdvance]);

  return (
    <div
      ref={bgRef}
      className="scene"
      style={{
        height: "100vh",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        background: "linear-gradient(180deg, #000000, #111111)",
        color: "white",
        paddingTop: "50px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Static orb removed; only World3D / global 3D orb remains */}

      <h2 style={{ position: "relative", zIndex: 1 }}>Neuro-Scanning / Perception</h2>

      {/* Signal panels scattered around */}
      {signals.map((s, idx) => (
        <div
          key={s}
          ref={(el) => { if (el) signalRefs.current[idx] = el; }}
          onMouseEnter={() => {
            setHoveredSignals((prev) => new Set([...prev, s]));
            setHovered(s);
          }}
          onMouseLeave={() => setHovered(null)}
          style={{
            position: "absolute",
            top: `${positions[idx].y}%`,
            left: `${positions[idx].x}%`,
            padding: "20px",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            textAlign: "center",
            minWidth: "140px",
            cursor: "pointer",
            zIndex: 1,
            boxShadow: hovered === s
              ? "0 0 20px rgba(68,68,255,0.8), 0 0 40px rgba(68,68,255,0.4)"
              : "0 0 8px rgba(68,68,255,0.2)", // soft glow even when not hovered
            transition: "all 0.3s",
          }}
        >
          {s}
          {hovered === s && (
            <div style={{ fontSize: "0.85em", color: "lightgray", marginTop: "5px" }}>
              {s === "EEG" && "Measures brain electrical activity"}
              {s === "Heart Rate" && "Tracks heartbeat"}
              {s === "Electrodermal Activity (EDA)" && "Tracks skin conductance"}
              {s === "Behavioral Signals" && "Monitors gestures and movement"}
              {s === "Emotional Inference Engine" && "Computes inferred emotional state"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
