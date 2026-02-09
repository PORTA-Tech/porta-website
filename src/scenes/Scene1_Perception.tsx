import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Orb3D from "../components/Orb3D";

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

export default function Scene1_Perception({ onAdvance, isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredSignals, setHoveredSignals] = useState<Set<string>>(new Set());

  const signalRefs = useRef<HTMLDivElement[]>([]);
  const bgRef = useRef<HTMLDivElement>(null);

  const startTimeRef = useRef<number>(0);
  const deadlineRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  // --- Background subtle gradient shift ---
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

  // --- Signal drift ---
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let id: number;

    const drift = () => {
      signalRefs.current.forEach((el, idx) => {
        if (!el) return;
        const offsetY = Math.sin(frame / 20 + idx) * 1;
        const offsetX = Math.sin(frame / 30 + idx) * 0.5;
        const scale = hovered === signals[idx] ? 1.05 : 1;
        el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      });
      frame++;
      id = requestAnimationFrame(drift);
    };
    drift();
    return () => cancelAnimationFrame(id);
  }, [isActive, hovered]);

  // --- Auto-advance ---
  useEffect(() => {
    if (!isActive) return;

    finishedRef.current = false;
    startTimeRef.current = Date.now();
    if (hoveredSignals.size >= signals.length) {
      deadlineRef.current = startTimeRef.current + AUTO_ADVANCE_DELAY;
    } else {
      deadlineRef.current = Infinity;
    }

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
        <Orb3D mode={1} /> {/* Scene1 mode */}
      </Canvas>

      <h2 style={{ position: "relative", zIndex: 1 }}>Neuro-Scanning / Perception</h2>

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
        {signals.map((s, idx) => (
          <div
            key={s}
            ref={(el) => {
              if (el) signalRefs.current[idx] = el;
            }}
            onMouseEnter={() => {
              setHoveredSignals((prev) => new Set([...prev, s]));
              setHovered(s);
            }}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: "20px",
              border: "1px solid gray",
              borderRadius: "5px",
              background: "#111111",
              transition: "all 0.2s",
              textAlign: "center",
              minWidth: "120px",
            }}
          >
            {s}
            {hovered === s && (
              <div style={{ fontSize: "0.8em", color: "lightgray", marginTop: "5px" }}>
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
    </div>
  );
}
