import { useState, useRef, useEffect } from "react";

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

const BASE_TIME = 5000; // 5s base
const HOVER_EXTENSION = 1500; // +1.5s when a new term is hovered
const MAX_TOTAL = 15000; // max 12s total

export default function Scene4_Technical({ onAdvance: _onAdvance, isActive: _isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredTerms, setHoveredTerms] = useState<Set<string>>(new Set());
  const termRefs = useRef<HTMLSpanElement[]>([]);
  const orbRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const deadlineRef = useRef<number>(0);

  // Orb rotation + pulse
  useEffect(() => {
    if (!_isActive) return;
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
  }, [_isActive]);

  // Term drift + hover scale
  useEffect(() => {
    if (!_isActive) return;
    let frame = 0;
    let animationId: number;

    const drift = () => {
      termRefs.current.forEach((el, idx) => {
        if (el) {
          const offsetY = Math.sin(frame / 20 + idx) * 1;
          const scale = hovered === terms[idx].word ? 1.05 : 1;
          el.style.transform = `translateY(${offsetY}px) scale(${scale})`;
        }
      });
      frame++;
      animationId = requestAnimationFrame(drift);
    };
    drift();
    return () => cancelAnimationFrame(animationId);
  }, [_isActive, hovered]);

  // Auto-advance logic
  useEffect(() => {
    if (!_isActive) return;

    // initialize start and deadline
    startTimeRef.current = Date.now();
    deadlineRef.current = startTimeRef.current + BASE_TIME;

    const interval = setInterval(() => {
      if (Date.now() >= deadlineRef.current) {
        _onAdvance();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [_isActive, _onAdvance]);

  // Extend deadline when a new term is hovered
  const handleHover = (word: string) => {
    setHovered(word);

    if (!hoveredTerms.has(word)) {
      const newTerms = new Set(hoveredTerms);
      newTerms.add(word);
      setHoveredTerms(newTerms);

      // Extend the deadline dynamically
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.min(BASE_TIME + newTerms.size * HOVER_EXTENSION - elapsed, MAX_TOTAL - elapsed);
      deadlineRef.current = Date.now() + remaining;
    }
  };

  return (
    <div
      className="scene"
      style={{
        height: "100vh",
        cursor: "default",
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

      <h2>Technical Foundation</h2>

      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "50px", width: "90%" }}>
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
