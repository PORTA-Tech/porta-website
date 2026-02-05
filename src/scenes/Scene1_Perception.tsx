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

const AUTO_ADVANCE_DELAY = 2500; // 2.5s after all signals hovered
const MAX_TOTAL = 10000; // optional hard cap

export default function Scene1_Perception({ onAdvance, isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredSignals, setHoveredSignals] = useState<Set<string>>(new Set());

  const signalRefs = useRef<HTMLDivElement[]>([]);
  const orbRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const startTimeRef = useRef<number>(0);
  const deadlineRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  // --- Orb rotation + pulse ---
  useEffect(() => {
    if (!isActive) return;
    let angle = 0;
    let id: number;

    const animate = () => {
      if (orbRef.current) {
        angle += 0.2;
        const scale = 1 + Math.sin(angle / 50) * 0.02;
        orbRef.current.style.transform = `rotate(${angle}deg) scale(${scale})`;
      }
      id = requestAnimationFrame(animate);
    };
    animate();
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

  // --- Closed-loop auto-advance ---
  useEffect(() => {
    if (!isActive) return;

    finishedRef.current = false;
    startTimeRef.current = Date.now();
    if (hoveredSignals.size >= signals.length) {
      deadlineRef.current = startTimeRef.current + AUTO_ADVANCE_DELAY;
    } else {
      deadlineRef.current = Infinity; // wait for all signals hovered
    }

    const loop = () => {
      if (finishedRef.current) return;

      // update deadline dynamically when all signals hovered
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
      {/* Orb */}
      <div
        ref={orbRef}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #4444ff, #000000)",
          marginBottom: "30px",
        }}
      />

      <h2>Neuro-Scanning / Perception</h2>

      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "50px", width: "90%" }}>
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
