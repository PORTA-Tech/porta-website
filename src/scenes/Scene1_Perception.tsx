import { useState, useRef, useEffect } from "react";

type SceneProps = {
  isActive: boolean;
};

const signals = [
  "EEG",
  "Heart Rate",
  "Electrodermal Activity (EDA)",
  "Behavioral Signals",
  "Emotional Inference Engine",
];

const positions = [
  { x: 20, y: 20 },
  { x: 80, y: 20 },
  { x: 20, y: 70 },
  { x: 80, y: 70 },
  { x: 50, y: 80 },
];

export default function Scene1_Perception({ isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const signalRefs = useRef<HTMLDivElement[]>([]);
  const bgRef = useRef<HTMLDivElement>(null);

  // Background subtle gradient
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

  // Panels gentle movement
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let id: number;
    const drift = () => {
      signalRefs.current.forEach((el, idx) => {
        if (!el) return;
        const offsetX = Math.sin(frame / 50 + idx) * 15;
        const offsetY = Math.cos(frame / 70 + idx) * 10;
        const scale = hovered === signals[idx] ? 1.1 : 1;
        el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      });
      frame++;
      id = requestAnimationFrame(drift);
    };
    drift();
    return () => cancelAnimationFrame(id);
  }, [isActive, hovered]);

  return (
    <div
      ref={bgRef}
      className="scene"
      style={{
        height: "100vh",
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
      <h2 style={{ position: "relative", zIndex: 1 }}>Neuro-Scanning / Perception</h2>

      {signals.map((s, idx) => (
        <div
          key={s}
          ref={(el) => { if (el) signalRefs.current[idx] = el; }}
          onMouseEnter={() => setHovered(s)}
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
              : "0 0 8px rgba(68,68,255,0.2)",
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
