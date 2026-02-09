import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Orb3D from "../components/Orb3D";

type SceneProps = {
  onAdvance: () => void;
  isActive: boolean;
};

const terms = [
  { word: "Software", desc: "PORTA is software, not hardware", pos: { x: 25, y: 25 } },
  { word: "Hardware-Agnostic", desc: "Sits above sensors and devices", pos: { x: 75, y: 25 } },
  { word: "Closed-Loop Regulation", desc: "Enables closed-loop emotional regulation", pos: { x: 25, y: 70 } },
  { word: "VR", desc: "Starts with high-fidelity VR but not limited", pos: { x: 75, y: 70 } },
];

const BASE_TIME = 5000;
const HOVER_EXTENSION = 1500;
const MAX_TOTAL = 15000;

export default function Scene4_Technical({ onAdvance, isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredTerms, setHoveredTerms] = useState<Set<string>>(new Set());

  const termRefs = useRef<HTMLDivElement[]>([]);
  const startTimeRef = useRef(0);
  const deadlineRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  // --- Reset on activation ---
  useEffect(() => {
    if (!isActive) return;
    startTimeRef.current = Date.now();
    deadlineRef.current = startTimeRef.current + BASE_TIME;
    finishedRef.current = false;
    setHoveredTerms(new Set());
  }, [isActive]);

  // --- Term drift + hover ---
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let id: number;

    const drift = () => {
      termRefs.current.forEach((el, idx) => {
        if (!el) return;
        const offsetY = Math.sin(frame / 20 + idx) * 2; // gentle drift
        const scale = hovered === terms[idx].word ? 1.05 : 1;
        el.style.transform = `translateY(${offsetY}px) scale(${scale})`;
        el.style.filter = hovered === terms[idx].word ? "brightness(1.3)" : "brightness(1)";
        el.style.boxShadow = hovered === terms[idx].word
          ? "0 0 20px rgba(68,68,255,0.8), 0 0 40px rgba(68,68,255,0.4)"
          : "0 0 8px rgba(68,68,255,0.2)"; // soft glow always
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

  const handleHover = (word: string) => {
    setHovered(word);

    if (hoveredTerms.has(word)) return;

    const newTerms = new Set(hoveredTerms);
    newTerms.add(word);
    setHoveredTerms(newTerms);

    const totalTime = Math.min(BASE_TIME + newTerms.size * HOVER_EXTENSION, MAX_TOTAL);
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
        <Orb3D mode={4} />
      </Canvas>

      <h2 style={{ position: "relative", zIndex: 1 }}>Technical Foundation</h2>

      {terms.map((t, idx) => (
        <div
          key={t.word}
          ref={(el) => { if (el) termRefs.current[idx] = el; }}
          onMouseEnter={() => handleHover(t.word)}
          onMouseLeave={() => setHovered(null)}
          style={{
            position: "absolute",
            top: `${t.pos.y}%`,
            left: `${t.pos.x}%`,
            padding: "20px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
            minWidth: "140px",
            cursor: "pointer",
            color: "white",
            zIndex: 1,
            transition: "all 0.3s",
          }}
        >
          {t.word}
          {hovered === t.word && (
            <div style={{ fontSize: "0.8em", color: "lightgray", marginTop: "5px" }}>
              {t.desc}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
