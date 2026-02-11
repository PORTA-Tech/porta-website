import { useState, useRef, useEffect } from "react";

type SceneProps = {
  isActive: boolean;
  onAdvance: () => void;
};

const terms = [
  { word: "Software", desc: "PORTA is software, not hardware", pos: { x: 25, y: 25 } },
  { word: "Hardware-Agnostic", desc: "Sits above sensors and devices", pos: { x: 75, y: 25 } },
  { word: "Closed-Loop Regulation", desc: "Enables closed-loop emotional regulation", pos: { x: 25, y: 70 } },
  { word: "VR", desc: "Starts with high-fidelity VR but not limited", pos: { x: 75, y: 70 } },
];

export default function Scene4_Technical({ isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const termRefs = useRef<HTMLDivElement[]>([]);

  // --- Gentle drift ---
  useEffect(() => {
    if (!isActive) return;
    let frame = 0;
    let id: number;

    const drift = () => {
      termRefs.current.forEach((el, idx) => {
        if (!el) return;
        const offsetY = Math.sin(frame / 20 + idx) * 2;
        const scale = hovered === terms[idx].word ? 1.05 : 1;
        el.style.transform = `translateY(${offsetY}px) scale(${scale})`;
        el.style.filter = hovered === terms[idx].word ? "brightness(1.3)" : "brightness(1)";
        el.style.boxShadow = hovered === terms[idx].word
          ? "0 0 20px rgba(68,68,255,0.8), 0 0 40px rgba(68,68,255,0.4)"
          : "0 0 8px rgba(68,68,255,0.2)";
      });
      frame++;
      id = requestAnimationFrame(drift);
    };

    drift();
    return () => cancelAnimationFrame(id);
  }, [isActive, hovered]);

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
      <h2 style={{ position: "relative", zIndex: 1 }}>Technical Foundation</h2>

      {terms.map((t, idx) => (
        <div
          key={t.word}
          ref={(el) => { if (el) termRefs.current[idx] = el; }}
          onMouseEnter={() => setHovered(t.word)}
          onMouseLeave={() => setHovered(null)}
          style={{
            position: "absolute",
            top: `${t.pos.y}%`,
            left: `${t.pos.x}%`,
            padding: "20px",
            borderRadius: "8px",
            background: "#111111", 
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
