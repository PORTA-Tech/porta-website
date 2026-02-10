import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";

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
    <div ref={bgRef} className="scene" style={{ overflow: "hidden" }}>
      {/* Canvas kept for lights or other 3D elements if needed */}
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
        {/* Orb3D removed from this scene */}
      </Canvas>

      {/* Overlay text + button */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
    </div>
  );
}
