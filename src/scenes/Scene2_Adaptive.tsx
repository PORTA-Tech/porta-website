import { useState, useRef, useEffect } from "react";

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

const BASE_DELAY = 4000; // 4s base auto-advance
const HOVER_DELAY = 1500; // 1.5s added per hover
const MAX_TOTAL = 10000; // 10s max total for scene

export default function Scene2_Adaptive({ onAdvance, isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);
  const orbRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const deadlineRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Orb rotation + pulse
  useEffect(() => {
    if (!isActive) return;
    let animationId: number;
    let angle = 0;
    const animateOrb = () => {
      if (orbRef.current) {
        angle += 0.2;
        const scale = 1 + Math.sin(angle / 50) * 0.02;
        orbRef.current.style.transform = `rotate(${angle}deg) scale(${scale})`;
      }
      animationId = requestAnimationFrame(animateOrb);
    };
    animateOrb();
    return () => cancelAnimationFrame(animationId);
  }, [isActive]);

  // Panel drift
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let animationId: number;
    const drift = () => {
      panelRefs.current.forEach((el, idx) => {
        if (el) {
          const offsetY = Math.sin(frame / 20 + idx) * 1;
          const offsetX = Math.sin(frame / 30 + idx) * 0.5;
          const scale = hovered === panels[idx].name ? 1.05 : 1;
          el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        }
      });
      frame++;
      animationId = requestAnimationFrame(drift);
    };
    drift();
    return () => cancelAnimationFrame(animationId);
  }, [isActive, hovered]);

  // Background gradient
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let animationId: number;
    const driftBG = () => {
      if (bgRef.current) {
        const hue = (frame % 360) / 360 * 10;
        bgRef.current.style.background = `linear-gradient(180deg, hsl(${hue},0%,0%), hsl(${hue},0%,7%))`;
      }
      frame++;
      animationId = requestAnimationFrame(driftBG);
    };
    driftBG();
    return () => cancelAnimationFrame(animationId);
  }, [isActive]);

  // Auto-advance logic
  useEffect(() => {
    if (!isActive) return;

    startTimeRef.current = Date.now();
    deadlineRef.current = startTimeRef.current + BASE_DELAY;

    const checkAdvance = () => {
      const now = Date.now();
      if (now >= deadlineRef.current || now - startTimeRef.current >= MAX_TOTAL) {
        onAdvance();
      } else {
        requestAnimationFrame(checkAdvance);
      }
    };
    requestAnimationFrame(checkAdvance);
  }, [isActive, onAdvance]);

  // Hover panel extends timer
  const handlePanelHover = (panelName: string) => {
    setHovered(panelName);
    deadlineRef.current = Math.min(deadlineRef.current + HOVER_DELAY, startTimeRef.current + MAX_TOTAL);
  };

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

      <h2>Adaptive Intelligence</h2>

      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "50px", width: "90%" }}>
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
              <div style={{ fontSize: "0.8em", color: "lightgray", marginTop: "5px" }}>{p.desc}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
