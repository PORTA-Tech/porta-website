import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Orb3D from "../components/Orb3D";

type SceneProps = {
  onAdvance: () => void;
  isActive: boolean;
};

const panels = [
  { name: "Perception Layer", desc: "Captures physiological and behavioral signals" },
  { name: "Inference Layer", desc: "Processes signals to infer internal state" },
  { name: "Adaptive Control", desc: "Adjusts environments based on inferred state" },
  { name: "Environment Modulation", desc: "Continuously shapes user experience in real time" },
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

  // --- Background subtle gradient shift ---
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let id: number;

    const drift = () => {
      if (bgRef.current) {
        const hue = ((frame % 360) / 360) * 10;
        bgRef.current.style.background = `linear-gradient(180deg, hsl(${hue},0%,0%), hsl(${hue},0%,7%))`;
      }
      frame++;
      id = requestAnimationFrame(drift);
    };
    drift();
    return () => cancelAnimationFrame(id);
  }, [isActive]);

  // --- Panel drift ---
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let id: number;

    const drift = () => {
      panelRefs.current.forEach((el, idx) => {
        if (!el) return;
        const offsetY = Math.sin(frame / 20 + idx) * 1;
        const offsetX = Math.sin(frame / 30 + idx) * 0.5;
        const scale = hovered === panels[idx].name ? 1.05 : 1;
        el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      });
      frame++;
      id = requestAnimationFrame(drift);
    };
    drift();
    return () => cancelAnimationFrame(id);
  }, [isActive, hovered]);

  // --- Closed-loop timing controller ---
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

  // --- Panel hover ---
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
      }}
    >
      {/* 3D Orb */}
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <Orb3D mode={2} /> {/* Scene2 mode */}
      </Canvas>

      <h2 style={{ position: "relative", zIndex: 1 }}>Adaptive Intelligence</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "50px",
          width: "90%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {panels.map((p, idx) => (
          <div
            key={p.name}
            ref={(el) => {
              if (el) panelRefs.current[idx] = el;
            }}
            onMouseEnter={() => handlePanelHover(p.name)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: "20px",
              border: "1px solid gray",
              borderRadius: "5px",
              background: "#111111",
              transition: "all 0.2s",
              textAlign: "center",
              minWidth: "140px",
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
    </div>
  );
}
