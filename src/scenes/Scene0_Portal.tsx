import { useEffect, useRef } from "react";

type SceneProps = {
  onAdvance: () => void;
  isActive: boolean;
};

export default function Scene0_Portal({ onAdvance: _onAdvance, isActive: _isActive }: SceneProps) {
  const orbRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!_isActive) return;
    let animationId: number;
    let angle = 0;
    const rotateAndPulseOrb = () => {
      if (orbRef.current) {
        angle += 0.2;
        const scale = 1 + Math.sin(angle / 50) * 0.01; // tiny pulse
        orbRef.current.style.transform = `rotate(${angle}deg) scale(${scale})`;
      }
      animationId = requestAnimationFrame(rotateAndPulseOrb);
    };
    rotateAndPulseOrb();
    return () => cancelAnimationFrame(animationId);
  }, [_isActive]);

  // Background subtle hue shift
  useEffect(() => {
    if (!_isActive) return;
    let frame = 0;
    let animationId: number;
    const driftBG = () => {
      if (bgRef.current) {
        const hue = (frame % 360) / 360 * 10; // tiny hue shift
        bgRef.current.style.background = `linear-gradient(180deg, hsl(${hue},0%,0%), hsl(${hue},0%,7%))`;
      }
      frame++;
      animationId = requestAnimationFrame(driftBG);
    };
    driftBG();
    return () => cancelAnimationFrame(animationId);
  }, [_isActive]);

  return (
    <div
      ref={bgRef}
      className="scene"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Orb placeholder */}
      <div
        ref={orbRef}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #4444ff, #000000)",
          marginBottom: "40px",
          transition: "box-shadow 0.3s",
        }}
      />

      <h1>PORTA</h1>
      <h3>A neuro-adaptive emotional intelligence platform</h3>
      <p>Senses. Infers. Responds. In real time.</p>

      <button
        onClick={() => _onAdvance()}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          cursor: "pointer",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 15px rgba(255,255,255,0.5)")}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
      >
        Enter Interface
      </button>
    </div>
  );
}
