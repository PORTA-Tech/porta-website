import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Orb3D from "../components/Orb3D";

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

export default function Scene3_Applications({ onAdvance, isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredPanels, setHoveredPanels] = useState<Set<string>>(new Set());

  const appRefs = useRef<HTMLDivElement[]>([]);
  const startTimeRef = useRef(0);
  const deadlineRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  // --- Reset timing on activation ---
  useEffect(() => {
    if (!isActive) return;
    startTimeRef.current = Date.now();
    deadlineRef.current = startTimeRef.current + BASE_TIME;
    finishedRef.current = false;
    setHoveredPanels(new Set());
  }, [isActive]);

  // --- Card drift ---
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let id: number;

    const drift = () => {
      appRefs.current.forEach((el, idx) => {
        if (!el) return;
        const offsetY = Math.sin(frame / 20 + idx) * 1;
        const offsetX = Math.sin(frame / 30 + idx) * 0.5;
        const scale = hovered === apps[idx].name ? 1.05 : 1;
        el.style.transform =
          `translate(${offsetX}px, ${hovered === apps[idx].name ? -2 : offsetY}px) scale(${scale})`;
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

  // --- Hover signal ---
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
        <Orb3D mode={3} /> {/* Scene3 mode */}
      </Canvas>

      <h2 style={{ position: "relative", zIndex: 1 }}>Platform Applications</h2>

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
        {apps.map((a, idx) => (
          <div
            key={a.name}
            ref={(el) => { if (el) appRefs.current[idx] = el; }}
            onMouseEnter={() => handleHover(a.name)}
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
            {a.name}
            {hovered === a.name && (
              <div style={{ fontSize: "0.8em", color: "lightgray", marginTop: "5px" }}>
                {a.desc}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
