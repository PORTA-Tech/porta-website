import { useState, useRef, useEffect } from "react";

type SceneProps = {
  onAdvance: () => void;
  isActive: boolean;
};

const apps = [
  { name: "Immersive Training", desc: "For high-focus skill building" },
  { name: "High-Stakes Performance", desc: "Optimizes critical execution" },
  { name: "Therapeutic Environments", desc: "Supports emotional regulation" },
  { name: "Research / Experimental Interfaces", desc: "Exploration in controlled settings" },
];

const BASE_TIME = 5000;
const HOVER_DELAY = 1000;
const MAX_TOTAL = 15000;

// Explicit offsets around the orb
const OFFSETS = [
  { x: -300, y:-200 },
  { x: 200, y: -80 },
  { x: -200, y: 150 },
  { x: 200, y: 80 },
];

export default function Scene3_Applications({ onAdvance, isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredPanels, setHoveredPanels] = useState<Set<string>>(new Set());

  const appRefs = useRef<HTMLDivElement[]>([]);
  const startTimeRef = useRef(0);
  const deadlineRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!isActive) return;
    startTimeRef.current = Date.now();
    deadlineRef.current = startTimeRef.current + BASE_TIME;
    finishedRef.current = false;
    setHoveredPanels(new Set());
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let id: number;

    const drift = () => {
      appRefs.current.forEach((el, idx) => {
        if (!el) return;
        const base = OFFSETS[idx];
        const offsetX = Math.sin(frame / 50 + idx) * 8;
        const offsetY = Math.cos(frame / 60 + idx) * 5;
        const scale = hovered === apps[idx].name ? 1.05 : 1;
        el.style.transform = `translate(calc(50% + ${base.x + offsetX}px), calc(50% + ${base.y + offsetY}px)) scale(${scale})`;
        el.style.filter = hovered === apps[idx].name ? "brightness(1.3)" : "brightness(1)";
      });
      frame++;
      id = requestAnimationFrame(drift);
    };

    drift();
    return () => cancelAnimationFrame(id);
  }, [isActive, hovered]);

  useEffect(() => {
    if (!isActive) return;

    const loop = () => {
      if (finishedRef.current) return;

      if (Date.now() >= deadlineRef.current) {
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

  const handleHover = (name: string) => {
    setHovered(name);

    if (hoveredPanels.has(name)) return;

    const newPanels = new Set(hoveredPanels);
    newPanels.add(name);
    setHoveredPanels(newPanels);

    const totalTime = Math.min(BASE_TIME + newPanels.size * HOVER_DELAY, MAX_TOTAL);
    deadlineRef.current = startTimeRef.current + totalTime;
  };

  return (
    <div
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
      <h2 style={{ position: "relative", zIndex: 1 }}>Platform Applications</h2>

      {apps.map((a, idx) => (
        <div
          key={a.name}
          ref={(el) => { if (el) appRefs.current[idx] = el; }}
          onMouseEnter={() => handleHover(a.name)}
          onMouseLeave={() => setHovered(null)}
          style={{
            position: "absolute",
            padding: "20px",
            borderRadius: "8px",
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.2)",
            minWidth: "140px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.3s",
            zIndex: 1,
            boxShadow: hovered === a.name
              ? "0 0 20px rgba(68,68,255,0.8), 0 0 40px rgba(68,68,255,0.4)"
              : "0 0 8px rgba(68,68,255,0.2)",
          }}
        >
          {a.name}
          {hovered === a.name && (
            <div style={{ fontSize: "0.8em", color: "lightgray", marginTop: "5px" }}>
              {a.desc}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
