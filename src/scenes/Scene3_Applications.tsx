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

export default function Scene3_Applications({ onAdvance: _onAdvance, isActive: _isActive }: SceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const appRefs = useRef<HTMLDivElement[]>([]);
  const orbRef = useRef<HTMLDivElement>(null);

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

  // Card drift with vertical + horizontal wiggle
  useEffect(() => {
    if (!_isActive) return;
    let frame = 0;
    let animationId: number;

    const drift = () => {
      appRefs.current.forEach((el, idx) => {
        if (el) {
          const offsetY = Math.sin(frame / 20 + idx) * 1;
          const offsetX = Math.sin(frame / 30 + idx) * 0.5;
          const scale = hovered === apps[idx].name ? 1.05 : 1;
          el.style.transform = `translate(${offsetX}px, ${hovered === apps[idx].name ? -2 : offsetY}px) scale(${scale})`;
        }
      });
      frame++;
      animationId = requestAnimationFrame(drift);
    };
    drift();
    return () => cancelAnimationFrame(animationId);
  }, [_isActive, hovered]);

  return (
    <div
      className="scene"
      onClick={() => _onAdvance()}
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

      <h2>Platform Applications</h2>

      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "50px", width: "90%" }}>
        {apps.map((a, idx) => (
          <div
            key={a.name}
            ref={(el) => {
              if (el) appRefs.current[idx] = el;
            }}
            onMouseEnter={() => setHovered(a.name)}
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
              <div style={{ fontSize: "0.8em", color: "lightgray", marginTop: "5px" }}>{a.desc}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
