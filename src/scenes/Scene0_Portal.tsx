import { useEffect, useRef } from "react";

type SceneProps = {
  onAdvance: () => void;
  isActive: boolean;
};

export default function Scene0_Portal({ onAdvance, isActive }: SceneProps) {
  const bgRef = useRef<HTMLDivElement>(null);

  // Background subtle hue shift
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
        position: "relative", // keep in flow so Canvas behind is visible
        overflow: "hidden",
      }}
    >
      <h1>PORTA</h1>
      <h3>A neuro-adaptive emotional intelligence platform</h3>
      <p>Senses. Infers. Responds. In real time.</p>

      <button
        onClick={onAdvance}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          cursor: "pointer",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = "0 0 15px rgba(255,255,255,0.5)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
      >
        Enter Interface
      </button>
    </div>
  );
}
