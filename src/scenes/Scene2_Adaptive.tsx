import { useState, useRef, useEffect } from "react";

type SceneProps = {
  onAdvance: () => void;
  isActive: boolean;
};

// Panels and positions (fixed, avoids orb area)
const panels = [
  { name: "Perception Layer", desc: "Captures physiological and behavioral signals", pos: { x: 25, y: 25 } }, 
  { name: "Inference Layer", desc: "Processes signals to infer internal state", pos: { x: 75, y: 25 } },     
  { name: "Adaptive Control", desc: "Adjusts environments based on inferred state", pos: { x: 25, y: 70 } }, 
  { name: "Environment Modulation", desc: "Continuously shapes user experience in real time", pos: { x: 75, y: 70 } },
];

const BASE_DELAY = 4000;
const HOVER_DELAY = 1500;
const MAX_TOTAL = 10000;

export default function Scene2_Adaptive({ onAdvance, isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);
  const bgRef = useRef<HTMLDivElement | null>(null);

  const startTimeRef = useRef(0);
  const deadlineRef = useRef(0);
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

  // --- Panel gentle float ---
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let id: number;
    const drift = () => {
      panelRefs.current.forEach((el, idx) => {
        if (!el) return;
        const offsetX = Math.sin(frame / 100 + idx) * 8;
        const offsetY = Math.cos(frame / 120 + idx) * 5;
        const scale = hovered === panels[idx].name ? 1.05 : 1;
        el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      });
      frame++;
      id = requestAnimationFrame(drift);
    };
    drift();
    return () => cancelAnimationFrame(id);
  }, [isActive, hovered]);

  // --- Closed-loop advance controller ---
  useEffect(() => {
    if (!isActive) return;
    finishedRef.current = false;
    startTimeRef.current = Date.now();
    deadlineRef.current = startTimeRef.current + BASE_DELAY;

    const loop = () => {
      if (finishedRef.current) return;
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
  }, [isActive, onAdvance]);

  const handlePanelHover = (panelName: string) => {
    setHovered(panelName);
    const now = Date.now();
    if (now >= deadlineRef.current) return;
    deadlineRef.current = Math.min(deadlineRef.current + HOVER_DELAY, startTimeRef.current + MAX_TOTAL);
  };

  return (
    <div
      ref={bgRef}
      className="scene"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "50px",
        background: "linear-gradient(180deg, #000000, #111111)",
        color: "white",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <h2 style={{ position: "relative", zIndex: 1 }}>Adaptive Intelligence</h2>

      {panels.map((p, idx) => (
        <div
          key={p.name}
          ref={(el) => { if (el) panelRefs.current[idx] = el; }}
          onMouseEnter={() => handlePanelHover(p.name)}
          onMouseLeave={() => setHovered(null)}
          style={{
            position: "absolute",
            top: `${p.pos.y}%`,
            left: `${p.pos.x}%`,
            padding: "20px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            textAlign: "center",
            minWidth: "140px",
            cursor: "pointer",
            zIndex: 1,
            boxShadow: hovered === p.name
              ? "0 0 20px rgba(68,68,255,0.8), 0 0 40px rgba(68,68,255,0.4)"
              : "0 0 8px rgba(68,68,255,0.2)",
            transition: "all 0.3s",
          }}
        >
          {p.name}
          {hovered === p.name && (
            <div style={{ fontSize: "0.8em", color: "lightgray", marginTop: "5px" }}>
              {p.desc}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
