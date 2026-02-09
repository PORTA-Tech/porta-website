import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Orb3D from "../components/Orb3D";

type SceneProps = {
  onAdvance: () => void;
  isActive: boolean;
};

const terms = [
  { word: "Software", desc: "PORTA is software, not hardware" },
  { word: "Hardware-Agnostic", desc: "Sits above sensors and devices" },
  { word: "Closed-Loop Regulation", desc: "Enables closed-loop emotional regulation" },
  { word: "VR", desc: "Starts with high-fidelity VR but not limited" },
];

const BASE_TIME = 5000;
const HOVER_EXTENSION = 1500;
const MAX_TOTAL = 15000;

export default function Scene4_Technical({ onAdvance, isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredTerms, setHoveredTerms] = useState<Set<string>>(new Set());

  const termRefs = useRef<HTMLSpanElement[]>([]);
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
        const offsetY = Math.sin(frame / 20 + idx) * 1;
        const scale = hovered === terms[idx].word ? 1.05 : 1;
        el.style.transform = `translateY(${offsetY}px) scale(${scale})`;
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

  // --- Hover logic ---
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
        <Orb3D mode={4} /> {/* Scene4 mode */}
      </Canvas>

      <h2 style={{ position: "relative", zIndex: 1 }}>Technical Foundation</h2>

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
        {terms.map((t, idx) => (
          <span
            key={t.word}
            ref={(el) => { if (el) termRefs.current[idx] = el; }}
            onMouseEnter={() => handleHover(t.word)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: "10px",
              borderBottom: hovered === t.word ? "1px solid lightgray" : "none",
              transition: "all 0.2s",
              minWidth: "120px",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {t.word}
            {hovered === t.word && (
              <div style={{ fontSize: "0.8em", color: "lightgray", marginTop: "5px" }}>
                {t.desc}
              </div>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
